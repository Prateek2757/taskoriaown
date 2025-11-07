import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";

interface DeductRequestBody {
  professionalId: string;
  taskId?: string | number;
  credits: number;
}

export async function POST(req: Request) {
  try {
    const body: DeductRequestBody = await req.json();
    const { professionalId, taskId, credits } = body;

    if (!professionalId || !credits || credits <= 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rows: userRows } = await client.query(
        `SELECT total_credits FROM credit_wallets WHERE professional_id = $1 FOR UPDATE`,
        [professionalId]
      );

      if (userRows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const currentBalance = Number(userRows[0].total_credits);
      if (currentBalance < credits) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
      }

      if (taskId) {
        const { rows: existingResponse } = await client.query(
          `SELECT * FROM task_responses WHERE task_id = $1 AND professional_id = $2`,
          [taskId, professionalId]
        );

        if (existingResponse.length > 0) {
          await client.query("ROLLBACK");
          return NextResponse.json(
            { error: "You’ve already responded to this lead" },
            { status: 400 }
          );
        }

        // const { rows: totalResponses } = await client.query(
        //   `SELECT COUNT(*) FROM task_responses WHERE task_id = $1`,
        //   [taskId]
        // );

        // if (Number(totalResponses[0].count) >= 5) {
        //   await client.query("ROLLBACK");
        //   return NextResponse.json(
        //     { error: "This lead has already received 5 responses" },
        //     { status: 400 }
        //   );
        // }
      }

      const newBalance = currentBalance - credits;
      await client.query(
        `UPDATE credit_wallets SET total_credits = $1 WHERE professional_id = $2`,
        [newBalance, professionalId]
      );

      if (taskId) {
        await client.query(
          `
          INSERT INTO task_responses(task_id, professional_id, credits_spent, created_at)
          VALUES($1, $2, $3, NOW())
          `,
          [taskId, professionalId, credits]
        );
      }

      await client.query("COMMIT");
      return NextResponse.json({
        success: true,
        balance: newBalance,
        message: "Credits deducted and lead response recorded",
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Deduct credits error:", err);
      return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Deduct credits API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}
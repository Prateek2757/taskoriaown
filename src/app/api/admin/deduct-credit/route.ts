import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { createNotification } from "@/lib/notifications";

interface DeductRequestBody {
  professionalId: string;
  taskId?: string | number;
  credits: number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: DeductRequestBody = await req.json();
    const { professionalId, taskId, credits } = body;

    if (
      !professionalId ||
      professionalId !== session.user.id ||
      credits === undefined ||
      credits === null
    ) {
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
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 400 }
        );
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

      let responseId: number | null = null;
      let taskOwnerId: string | null = null;
      let categoryName = "Task";

      if (taskId) {
        const { rows: taskRows } = await client.query(
          `SELECT t.customer_id, sc.name AS category_name
           FROM tasks t
           LEFT JOIN service_categories sc ON sc.category_id = t.category_id
           WHERE t.task_id = $1
           LIMIT 1`,
          [taskId]
        );

        if (taskRows.length === 0) {
          await client.query("ROLLBACK");
          return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        taskOwnerId = String(taskRows[0].customer_id);
        categoryName = taskRows[0].category_name || "Task";

        const result = await client.query(
          `
      
          INSERT INTO task_responses(task_id, professional_id, credits_spent, created_at)
      
          VALUES($1, $2, $3, NOW())
      
          RETURNING response_id
      
          `,

          [taskId, professionalId, credits]
        );

        responseId = result.rows[0].response_id;
      }

      await client.query("COMMIT");

      if (taskOwnerId) {
        const professionalName = session.user.name?.trim() || "A professional";
        const notificationResults = await Promise.allSettled([
          createNotification({
            userId: professionalId,
            title:
              credits === 0
                ? "Free Lead Claimed 🎉!"
                : "Lead Purchased Successfully 🎉!",
            type: "lead_purchased",
            body: `You have ${credits === 0 ? "claimed a free" : "purchased a"} lead for ${categoryName}`,
            action_url: "/provider-responses",
          }),
          createNotification({
            userId: taskOwnerId,
            title: "Lead Response 🎉",
            type: "lead_response",
            body: `Your ${categoryName} task received a response from ${professionalName}`,
            action_url: "/customer/dashboard",
          }),
        ]);

        notificationResults.forEach((result) => {
          if (result.status === "rejected") {
            console.error("Lead notification delivery failed:", result.reason);
          }
        });
      }

      return NextResponse.json({
        success: true,
        responseId,
        balance: newBalance,
        message: "Credits deducted and lead response recorded",
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Deduct credits error:", err);
      return NextResponse.json(
        { error: "Failed to deduct credits" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Deduct credits API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}

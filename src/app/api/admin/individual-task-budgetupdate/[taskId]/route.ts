import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";

export async function PATCH(
  req: Request,
  context : { params: Promise<{ taskId: string }> }
) {
  const client = await pool.connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userCheck = await client.query(
      `SELECT role FROM users WHERE user_id = $1`,
      [session.user.id]
    );

    if (!userCheck.rows[0] || userCheck.rows[0].role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { estimated_budget } = await req.json();
const taskId =  (await context.params).taskId
    if (!estimated_budget || Number(estimated_budget) <= 0) {
      return NextResponse.json(
        { message: "Invalid budget amount" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const updateResult = await client.query(
      `
      UPDATE tasks 
      SET estimated_budget = $1, updated_at = NOW()
      WHERE task_id = $2
      RETURNING *;
      `,
      [Number(estimated_budget), taskId]
    );

    if (updateResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    const task = updateResult.rows[0];

    const customerResult = await client.query(
      `
      SELECT 
        u.email, 
        up.display_name,
        c.name as category_name
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.user_id
      LEFT JOIN service_categories c ON c.category_id = $1
      WHERE u.user_id = $2
      `,
      [task.category_id, task.customer_id]
    );

    await client.query("COMMIT");


    return NextResponse.json({
      success: true,
      message: "Budget set successfully. Task is now visible to professionals.",
      task: updateResult.rows[0]
    });

  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Budget update error:", err);
    return NextResponse.json(
      { message: "Failed to set budget" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
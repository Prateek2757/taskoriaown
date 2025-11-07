import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
export async function GET(
  req: Request,
  { params }: { params: { task_id: string } }
) {
  const { task_id } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  try {
    const client = await pool.connect();

    const responseCountQuery = `
      SELECT COUNT(*) AS total
      FROM task_responses
      WHERE task_id = $1
    `;
    const responseCountResult = await client.query(responseCountQuery, [
      task_id,
    ]);

    const purchaseCheckQuery = `
      SELECT 1
      FROM task_responses
      WHERE task_id = $1 AND professional_id = $2
      LIMIT 1
    `;
    const purchaseCheckResult = await client.query(purchaseCheckQuery, [
      task_id,
      userId,
    ]);

    client.release();

    return NextResponse.json({
      count: Number(responseCountResult.rows[0].total),
      purchased: purchaseCheckResult.rows.length > 0,
    });
  } catch (error) {
    console.error("Lead status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead status" },
      { status: 500 }
    );
  }
}

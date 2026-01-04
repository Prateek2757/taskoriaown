import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { category_id } = await req.json();
  const userId = session.user.id;

  await pool.query(
    `
    INSERT INTO user_categories (user_id, category_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [userId, category_id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { category_id } = await req.json();
  const userId = session.user.id;

  await pool.query(
    `
    DELETE FROM user_categories
    WHERE user_id = $1 AND category_id = $2
    `,
    [userId, category_id]
  );

  return NextResponse.json({ success: true });
}

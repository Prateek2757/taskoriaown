import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";
import pool from "@/lib/dbConnect";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // Fetch latest display_name and other info from DB
  const { rows } = await pool.query(
    `
    SELECT 
      u.user_id,
      u.email,
      up.display_name,
      COALESCE(r.role_name, 'customer') AS role,
      u.is_email_verified
    FROM users u
    LEFT JOIN user_profiles up ON u.user_id = up.user_id
    LEFT JOIN roles r ON r.role_id = u.default_role_id
    WHERE u.user_id = $1
    `,
    [userId]
  );

  if (!rows[0]) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const user = rows[0];

  // Return the new data
  return NextResponse.json({
    id: user.user_id,
    email: user.email,
    name: user.display_name,
    role: user.role,
    isVerified: user.is_email_verified,
  });
}
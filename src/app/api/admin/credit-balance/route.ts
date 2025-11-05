import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: Request) {

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({message:"Unauthorized"},{status:401});
    }
    const userId=session.user.id
  try {
    const { rows } = await pool.query(
      "SELECT total_credits FROM credit_wallets WHERE professional_id = $1",
      [userId]
    );

    const balance = rows[0]?.total_credits || 0;
    return NextResponse.json({ success: true, balance });
  } catch (error: any) {
    console.error("Fetch balance failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
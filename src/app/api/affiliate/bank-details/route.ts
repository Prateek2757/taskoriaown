import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId  = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rows } = await pool.query(
      `SELECT
         id, user_id,
         account_name, bank_name, bsb,
         account_number,
         abn,
         tax_file_url,
         tax_file_name,
         tax_uploaded_at,
         status,
         created_at, updated_at
       FROM public.affiliate_bank_details
       WHERE user_id = $1
       LIMIT 1`,
      [userId]
    );

    return NextResponse.json(rows[0] ?? null);
  } catch (err) {
    console.error("GET /api/affiliate/bank-details:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId  = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      accountName,
      bankName,
      bsb,
      accountNumber,
      abn,
      taxFileUrl,   
      taxFileName,
    } = body;

    if (bsb && !/^\d{3}-?\d{3}$/.test(bsb))
      return NextResponse.json({ error: "Invalid BSB format" }, { status: 400 });

    const params = [
      userId,                           
      accountName   || null,           
      bankName      || null,           
      bsb           || null,           
      accountNumber || null,            
      abn           || null,            
      taxFileUrl    || null,           
      taxFileName   || null,            
    ];

    const { rows } = await pool.query(
      `INSERT INTO public.affiliate_bank_details
         (user_id, account_name, bank_name, bsb, account_number, abn,
          tax_file_url, tax_file_name, tax_uploaded_at)
       VALUES (
         $1,
         $2::text,
         $3::text,
         $4::text,
         $5::text,
         $6::text,
         $7::text,
         $8::text,
         CASE WHEN $7::text IS NOT NULL THEN NOW() ELSE NULL END
       )
       ON CONFLICT (user_id) DO UPDATE SET
         account_name    = COALESCE(NULLIF($2::text, ''), affiliate_bank_details.account_name),
         bank_name       = COALESCE(NULLIF($3::text, ''), affiliate_bank_details.bank_name),
         bsb             = COALESCE(NULLIF($4::text, ''), affiliate_bank_details.bsb),
         account_number  = COALESCE(NULLIF($5::text, ''), affiliate_bank_details.account_number),
         abn             = COALESCE(NULLIF($6::text, ''), affiliate_bank_details.abn),
         -- Only overwrite tax fields when a new file URL is explicitly provided
         tax_file_url    = COALESCE($7::text, affiliate_bank_details.tax_file_url),
         tax_file_name   = COALESCE($8::text, affiliate_bank_details.tax_file_name),
         tax_uploaded_at = CASE
                             WHEN $7::text IS NOT NULL THEN NOW()
                             ELSE affiliate_bank_details.tax_uploaded_at
                           END
       RETURNING
         id, user_id,
         account_name, bank_name, bsb,
         RIGHT(account_number, 4) AS last4,
         abn,
         tax_file_url, tax_file_name, tax_uploaded_at,
         status, updated_at`,
      params
    );

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("POST /api/affiliate/bank-details:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
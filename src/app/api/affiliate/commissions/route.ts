// app/api/affiliate/commissions/route.ts  — GET + PATCH

import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/affiliate/commissions?status=pending&type=all
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.adminrole !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";       // pending | approved | paid | rejected | all
  const type   = searchParams.get("type")   ?? "all";       // subscription | task | all

  const client = await pool.connect();
  try {
    // Build WHERE clauses dynamically
    const conditions: string[] = [];
    const values: unknown[]    = [];
    let   idx = 1;

    if (status !== "all") {
      conditions.push(`ac.status = $${idx++}`);
      values.push(status);
    }
    if (type !== "all") {
      conditions.push(`ac.commission_type = $${idx++}`);
      values.push(type);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await client.query(
      `SELECT
         ac.*,

         -- Referrer
         ru.email                       AS referrer_email,
         rud.display_name                AS referrer_name,

         -- Referred user
         rnd.email                       AS referred_email,
         rd.display_name                AS referred_name,

         -- Subscription-type extras
         pp.name                        AS package_name,
         (ac.created_at + INTERVAL '12 months') AS commission_eligible_until,

         -- Task-type extras (short title truncated)
         LEFT(t.description, 80)        AS task_title

       FROM public.affiliate_commissions ac

       JOIN public.users ru ON ru.user_id = ac.referrer_id
       JOIN public.user_profiles rud ON rud.user_id = ac.referrer_id
       JOIN public.user_profiles rd ON rd.user_id = ac.referred_user_id
       JOIN public.users rnd ON rnd.user_id = ac.referred_user_id
       -- subscription joins (nullable for task rows)
       LEFT JOIN public.professional_packages pp ON pp.package_id = ac.package_id

       -- task join (nullable for subscription rows)
       LEFT JOIN public.tasks t ON t.task_id = ac.task_id

       ${where}
       ORDER BY ac.created_at DESC`,
      values
    );

    return NextResponse.json(rows);
  } finally {
    client.release();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH  /api/affiliate/commissions
// body: { commissionId, action: "approved"|"rejected", adminNote? }
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.adminrole !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { commissionId, action, adminNote } = await req.json();

  if (!commissionId || !["approved", "rejected"].includes(action))
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const adminId = session.user.id;
  const client  = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the row
    const { rows } = await client.query(
      `SELECT * FROM public.affiliate_commissions WHERE commission_id = $1 FOR UPDATE`,
      [commissionId]
    );
    if (!rows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Commission not found" }, { status: 404 });
    }

    const comm = rows[0];
    if (comm.status !== "pending") {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: `Commission is already ${comm.status}` },
        { status: 409 }
      );
    }

    // Update commission status
    await client.query(
      `UPDATE public.affiliate_commissions
       SET status      = $1,
           approved_at = CASE WHEN $1 = 'approved' THEN now() ELSE NULL END,
           approved_by = CASE WHEN $1 = 'approved' THEN $2    ELSE NULL END,
           admin_note  = $3,
           updated_at  = now()
       WHERE commission_id = $4`,
      [action, adminId, adminNote ?? null, commissionId]
    );

    if (action === "approved") {
      // Credit the referrer's approved_earnings balance
      await client.query(
        `UPDATE public.affiliate_users
         SET approved_earnings = approved_earnings + $1,
             updated_at        = now()
         WHERE user_id = $2`,
        [comm.commission_amount, comm.referrer_id]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true, action, commissionId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PATCH /api/affiliate/commissions:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}
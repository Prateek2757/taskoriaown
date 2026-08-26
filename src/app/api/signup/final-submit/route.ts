import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";
import { isValidABN } from "@/features/onboarding/schema";
import { lookupAbnRegistration } from "@/lib/abn-lookup";
import type { PoolClient } from "pg";

function createCompanySlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function getAvailableCompanySlug(
  client: PoolClient,
  companyName: string,
  userId: number
) {
  const baseSlug = createCompanySlug(companyName) || `provider-${userId}`;

  for (let suffix = 0; ; suffix += 1) {
    const candidate = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;
    const { rowCount } = await client.query(
      "SELECT 1 FROM company WHERE slug = $1 AND user_id <> $2 LIMIT 1",
      [candidate, userId]
    );

    if (!rowCount) return candidate;
  }
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const {
      public_id,
      categoryPublic_id,
      distance,
      is_nationwide,
      location_id,
      name,
      email,
      phone,
      companyName,
      abn,
      websiteUrl,
      companySize,
      password,
      referralCode,
    } = await req.json();

    if (!public_id || !categoryPublic_id || !name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizationemail = await email.trim().toLowerCase();
    const normalizedAbn =
      typeof abn === "string" ? abn.replace(/\s/g, "") : "";

    if (normalizedAbn) {
      if (!isValidABN(normalizedAbn)) {
        return NextResponse.json(
          { message: "Please enter a valid ABN" },
          { status: 400 }
        );
      }

      const abnRegistration = await lookupAbnRegistration(normalizedAbn);

      if (abnRegistration.message || !abnRegistration.isActive) {
        return NextResponse.json(
          { message: "ABN must be active on the Australian Business Register." },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    const userres = await client.query(
      `SELECT user_id FROM users WHERE public_id = $1`,
      [public_id]
    );
    const categoryres = await client.query(
      `SELECT category_id FROM service_categories WHERE public_id = $1`,
      [String(categoryPublic_id)]
    );

    if (userres.rowCount === 0 && categoryres.rowCount === 0) {
      throw new Error("User Not Found and Category");
    }

    const user_idd = userres.rows[0].user_id;
    const category_id = categoryres.rows[0].category_id;

    await client.query(
      `INSERT INTO user_categories (user_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user_idd, category_id]
    );

    await client.query(
      `
      INSERT INTO user_profiles (user_id, display_name, location_id, is_nationwide, is_onboarded, distanceMile)
      VALUES ($1, $2, $3, $4, TRUE, $5)
      ON CONFLICT (user_id)
      DO UPDATE SET
        display_name = $2,
        location_id = $3,
        is_nationwide = $4,
        is_onboarded = TRUE,
        updated_at = NOW()
      `,
      [
        user_idd,
        name,
        is_nationwide ? null : location_id || null,
        is_nationwide,
        distance,
      ]
    );

    if (location_id) {
      await client.query(
        `INSERT INTO user_locations (user_id, city_id, distance_mile) VALUES ($1, $2, $3)`,
        [user_idd, location_id, distance]
      );
    }

    await client.query(
      `
      UPDATE users
      SET email = $1,
          phone = $2,
          password_hash = $3,
          is_deleted = FALSE,
          updated_at = NOW()
      WHERE user_id = $4
      `,
      [normalizationemail, phone || null, hashedPassword, user_idd]
    );

    const companyNameForSlug = companyName?.trim() || name.trim();
    const companySlug = await getAvailableCompanySlug(
      client,
      companyNameForSlug,
      user_idd
    );

    await client.query(
      `
      INSERT INTO company (user_id, company_name, slug, contact_name, contact_email, contact_phone, website, company_size,business_abn)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) DO UPDATE SET slug = EXCLUDED.slug
      `,
      [
        user_idd,
        companyNameForSlug,
        companySlug,
        name,
        normalizationemail,
        phone || null,
        websiteUrl || null,
        companySize || null,
        normalizedAbn || null,
      ]
    );

    if (referralCode && referralCode.trim() !== "") {
      const trimmedCode = referralCode.trim().toUpperCase();

      const referrerRes = await client.query(
        `SELECT user_id FROM users WHERE referral_code = $1 AND is_deleted = FALSE`,
        [trimmedCode]
      );

      if (referrerRes.rowCount && referrerRes.rowCount > 0) {
        const referrer_id = referrerRes.rows[0].user_id;

        if (referrer_id !== user_idd) {
          await client.query(
            `
            INSERT INTO referrals (referrer_id, referred_user_id, referral_code_used, status, reward_amount)
            VALUES ($1, $2, $3, 'pending', 0)
            ON CONFLICT DO NOTHING
            `,
            [referrer_id, user_idd, trimmedCode]
          );
        }
      }

    }

    await client.query("COMMIT");

await client.query(
  `
  INSERT INTO scheduled_emails (user_id, type, send_after) VALUES
    ($1, 'nudge',  NOW() + INTERVAL '12 hour'),
    ($1, 'month',  NOW() + INTERVAL '30 days')
  ON CONFLICT (user_id, type) DO NOTHING  -- safe to re-run
  `,
  [user_idd]
);

    const { rows } = await client.query(
      `
      SELECT u.user_id, u.email, u.phone,
             p.display_name, p.location_id, p.is_nationwide, p.is_onboarded,
             c.company_name, c.contact_name, c.contact_email, c.contact_phone
      FROM users u
      LEFT JOIN user_profiles p ON u.user_id = p.user_id
      LEFT JOIN company c ON u.user_id = c.user_id
      WHERE u.user_id = $1
      `,
      [user_idd]
    );

    await sendEmail({
      email: normalizationemail,
      username: name,
      type: "welcome",
    });

    return NextResponse.json({
      message: "✅ Signup successful!",
      user: rows[0],
    });
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});

    if (err.code === "23505" || err.message?.includes("users_email_key")) {
      return NextResponse.json(
        { message: "Email is already used." },
        { status: 400 }
      );
    }

    console.error("Final submit error:", err);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

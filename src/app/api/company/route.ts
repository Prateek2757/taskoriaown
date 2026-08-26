import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT user_id, company_name, slug, logo_url, contact_name, contact_email, website, contact_phone, about, company_size, years_in_business,business_abn
       FROM company
       WHERE user_id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Company GET error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const client = await pool.connect();

  try {
    const body = await req.json();
    const {
      company_name,
      contact_name,
      contact_email,
      company_logo_url,
      contact_phone,
      website,
      company_size,
      years_in_business,
      business_abn,
      about,
      slug,
    } = body;

    console.log(business_abn,"abn");
    

    if (!company_name || !contact_name || !contact_email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // The client updates this instantly while typing; normalize again before
    // persisting so direct API calls cannot save an invalid public URL.
    const companySlug = createCompanySlug(slug || company_name);
    if (!companySlug) {
      return NextResponse.json(
        { message: "Company name must contain letters or numbers" },
        { status: 400 }
      );
    }

    const existingSlug = await client.query(
      "SELECT 1 FROM company WHERE slug = $1 AND user_id <> $2 LIMIT 1",
      [companySlug, userId]
    );
    if (existingSlug.rowCount) {
      return NextResponse.json(
        { message: "That company name is already being used for another profile" },
        { status: 409 }
      );
    }

    const yearsInBusinessInt =
      years_in_business && years_in_business !== ""
        ? parseInt(years_in_business, 10)
        : null;

    const { rowCount } = await client.query(
      `UPDATE company
       SET company_name = $1,
           contact_name = $2,
           contact_email = $3,
           contact_phone = $4,
           website = $5,
           company_size = $6,
           years_in_business = $7,
           business_abn = $8,
           about = $9,
           logo_url = $10,
           slug = $11,
           updated_at = NOW()
       WHERE user_id = $12`,
      [
        company_name,
        contact_name,
        contact_email,
        contact_phone?.trim() || null,
        website?.trim() || null,
        company_size?.trim() || null,
        yearsInBusinessInt,
        business_abn || null, 
        about?.trim() || null,
        company_logo_url,
        companySlug,
        userId,
      ]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    const { rows } = await client.query(
      `SELECT user_id, company_name, slug, logo_url, contact_name, contact_email, contact_phone, website, company_size, years_in_business, about,business_abn
       FROM company
       WHERE user_id = $1`,
      [userId]
    );

    return NextResponse.json({
      message: "Company updated successfully",
      company: rows[0],
    });
  } catch (err) {
    console.error("Company PUT error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { isValidABN } from "@/features/onboarding/schema";
import { lookupAbnRegistration } from "@/lib/abn-lookup";

export async function GET(req: NextRequest) {
  const abn = req.nextUrl.searchParams.get("abn")?.replace(/\s/g, "") ?? "";

  if (!isValidABN(abn)) {
    return NextResponse.json(
      { message: "Please enter a valid 11-digit ABN." },
      { status: 400 }
    );
  }

  try {
    const result = await lookupAbnRegistration(abn);

    if (result.message) {
      return NextResponse.json(
        { message: result.message, result },
        { status: 404 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[GET /api/abn/lookup]", error);
    const message =
      error instanceof Error ? error.message : "Unable to verify ABN right now.";

    return NextResponse.json(
      { message },
      { status: message.includes("not configured") ? 500 : 502 }
    );
  }
}

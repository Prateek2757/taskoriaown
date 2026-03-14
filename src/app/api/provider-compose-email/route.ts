import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, messageFromProvider, subject } = body;

    if (!email || !messageFromProvider) {
      return NextResponse.json(
        { error: "Missing required fields: email and messageFromProvider" },
        { status: 400 }
      );
    }

   
    const result = await sendEmail({
      email,
      type: "provider-email-compose",
      messageFromProvider,
      ...(subject ? { subject } : {}),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Email sending failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
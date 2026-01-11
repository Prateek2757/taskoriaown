import { NextRequest, NextResponse } from "next/server";
import { supabaseBrowser } from "@/lib/supabase-server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
  )  {
  try {
const {userId} = await params;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: subscription, error } = await supabaseBrowser
      .from("professional_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .gte("end_date", new Date().toISOString())
      .order("end_date", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Subscription check error:", error);
      return NextResponse.json(
        { error: "Failed to check subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasActiveSubscription: !!subscription,
      subscription: subscription || null,
    });
  } catch (error: any) {
    console.error("Subscription API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
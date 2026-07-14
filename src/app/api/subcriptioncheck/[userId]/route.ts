import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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

    // Defer client creation until request time so builds do not require runtime secrets.
    const { data: subscription, error } = await getSupabaseAdmin()
      .from("professional_subscriptions")
      .select("subscription_id, package_id, status, end_date, cancel_at_period_end")
      .eq("user_id", userId)
      .in("status", ["active","trialing"])
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

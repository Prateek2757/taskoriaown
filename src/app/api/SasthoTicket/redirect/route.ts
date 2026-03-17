import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("ENV check:", {
    hasUsername: !!process.env.NEXT_SASTHOTICKET_USERNAME,
    hasPassword: !!process.env.NEXT_SASTHOTICKET_PASSWORD,
  });

  const authRes = await fetch("https://staging-api.sastotickets.com/api/b2b/v2/get-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.NEXT_SASTHOTICKET_USERNAME,
      password: process.env.NEXT_SASTHOTICKET_PASSWORD,
    }),
  });

  const authData = await authRes.json();
  console.log("SastoTickets full response:", JSON.stringify(authData, null, 2));

  if (!authRes.ok) {
    return Response.json({ error: "SastoTickets auth failed" }, { status: 502 });
  }

  const accessToken = authData.data?.accessToken;

  if (!accessToken) {
    console.error("No token found in response:", authData);
    return Response.json({ error: "Token missing" }, { status: 502 });
  }

  const userData = {
    phone_number: (session.user as any).phone,
    access_token: accessToken,
  };

  const base64Data = Buffer.from(JSON.stringify(userData)).toString("base64");
  const redirectUrl = `https://taskoria-staging.sastotickets.com/?data=${base64Data}`;

  return Response.json({ url: redirectUrl });
}
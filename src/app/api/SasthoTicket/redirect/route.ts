import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const authRes = await fetch("https://staging-api.sastotickets.com/api/b2b/v2/get-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: process.env.NEXT_SASTHOTICKET_USERNAME,
      password: process.env.NEXT_SASTHOTICKET_PASSWORD,
    }),
  });

  const authData = await authRes.json();

  const accessToken = authData.access_token;

  const userData = {
    phone_number: session.user.phone,
    access_token: accessToken,
  };

  const base64Data = Buffer.from(JSON.stringify(userData)).toString("base64");

  const redirectUrl = `https://taskoria-staging.sastotickets.com/?data=${base64Data}`;

  return Response.json({ url: redirectUrl });
}

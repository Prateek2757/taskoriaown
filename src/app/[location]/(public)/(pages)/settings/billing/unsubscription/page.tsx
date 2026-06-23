import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UnsubscribePage from "@/components/unsubscription/Unsubscriotion-billing";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: { absolute: "Cancel Taskoria Pro | Billing Settings" },
  description:
    "Manage cancellation and unsubscription settings for your Taskoria Pro provider plan.",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <UnsubscribePage
      professionalId={String(session?.user.id)}
      packageName="Taskoria Pro"
    />
  );
}

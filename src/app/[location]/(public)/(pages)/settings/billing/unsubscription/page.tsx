import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UnsubscribePage from "@/components/unsubscription/Unsubscriotion-billing";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <UnsubscribePage
      professionalId={String(session?.user.id)}
      packageName="Taskoria Pro"
    />
  );
}

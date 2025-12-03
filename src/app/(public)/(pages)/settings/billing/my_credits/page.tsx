"use client"
import { useState } from "react";
import  { CreditPurchasePage } from "@/components/payments/CreditTopup";
import { useSession } from "next-auth/react";

export default function CreditsPage({ professionalId }: { professionalId: number }) {
  const [open, setOpen] = useState(false);

const {data:session} = useSession()

  return (
    <div className="px-6 min-h-screen">
      <CreditPurchasePage
      professionalId={session?.user.id}  
      onPurchaseSuccess={() => {
      }}
    />
    </div>
  );
}
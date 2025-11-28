"use client"
import { useState } from "react";
import  { CreditPurchasePage } from "@/components/payments/CreditTopup";
import { useSession } from "next-auth/react";

export default function CreditsPage({ professionalId }: { professionalId: number }) {
  const [open, setOpen] = useState(false);

const {data:session} = useSession()

  return (
    <div className="p-6">
      <CreditPurchasePage
      professionalId={session?.user.id}  
      onPurchaseSuccess={() => {
      }}
    />
    </div>
  );
}
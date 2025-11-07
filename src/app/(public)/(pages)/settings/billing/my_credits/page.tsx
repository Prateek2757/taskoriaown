"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import  { CreditPurchasePage } from "@/components/payments/CreditTopup";
import { useSession } from "next-auth/react";
import CheckoutButton from "@/components/stripecheckout";

export default function CreditsPage({ professionalId }: { professionalId: number }) {
  const [open, setOpen] = useState(false);

const {data:session} = useSession()

  return (
    <div className="p-6">
      <CheckoutButton/>
      <CreditPurchasePage
      professionalId={session?.user.id} // Get from session/auth
      onPurchaseSuccess={() => {
      }}
    />
    </div>
  );
}
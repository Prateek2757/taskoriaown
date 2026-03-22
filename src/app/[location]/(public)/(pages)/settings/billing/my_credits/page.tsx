"use client"
import  { CreditPurchasePage } from "@/components/payments/CreditTopup";
import { useSession } from "next-auth/react";

export default function CreditsPage() {

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
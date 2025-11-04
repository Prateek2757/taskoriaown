"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreditTopupDialog from "@/components/payments/CreditTopup";

export default function CreditsPage({ professionalId }: { professionalId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Credits</h1>
      <Button onClick={() => setOpen(true)}>Buy Credits</Button>
      <CreditTopupDialog
        open={open}
        onOpenChange={setOpen}
        professionalId={professionalId}
      />
    </div>
  );
}
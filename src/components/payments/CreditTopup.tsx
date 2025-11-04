"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CreditTopupDialog({
  open,
  onOpenChange,
  professionalId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professionalId: number;
}) {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPackages();
    }
  }, [open]);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/credit-packages");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      toast.error("Failed to load credit packages");
    }
  };

  const handleTopup = async () => {
    if (!selectedPackage) {
      toast.error("Please select a package");
      return;
    }

    setLoading(true);
    try {
      const transactionRef = `TXN-${Date.now()}`;

      const res = await fetch("/api/credit-topups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professional_id: professionalId,
          package_id: selectedPackage,
          payment_method: "Card",
          transaction_ref: transactionRef,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process top-up");

      toast.success("Credit purchase successful!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {packages.map((pkg) => (
            <div
              key={pkg.package_id}
              className={`border p-3 rounded-lg cursor-pointer ${
                selectedPackage === pkg.package_id
                  ? "border-primary bg-primary/10"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedPackage(pkg.package_id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{pkg.package_name}</h4>
                  <p className="text-sm text-gray-500">
                    {pkg.credits} credits — ${pkg.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleTopup} disabled={loading}>
            {loading ? "Processing..." : "Buy Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
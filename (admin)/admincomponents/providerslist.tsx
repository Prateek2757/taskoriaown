"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Loader2 } from "lucide-react";

type Provider = {
  user_profile_id: number;
  display_name: string;
  provider_verified: boolean;
  avg_rating: number;
  total_reviews: number;
  created_at: string;
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/providers")
      .then((res) => res.json())
      .then(setProviders)
      .finally(() => setLoading(false));
  }, []);

//   async function handleApprove(id: number, approved: boolean) {
//     setActionLoading(id);
//     await fetch(`/api/admin/providers/${id}/approve`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ approved }),
//     });
//     setProviders((prev) =>
//       prev.map((p) =>
//         p.user_profile_id === id ? { ...p, provider_verified: approved } : p
//       )
//     );
//     setActionLoading(null);
//   }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {providers.map((p) => (
        <Card key={p.user_profile_id} className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {p.display_name || "Unnamed"}
              {p.provider_verified ? (
                <span className="text-green-600 text-sm font-medium">Verified</span>
              ) : (
                <span className="text-yellow-600 text-sm font-medium">Pending</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              ⭐ {p.avg_rating ?? 0} ({p.total_reviews} reviews)
            </p>
            <div className="flex gap-2">
              {/* <Button
                size="sm"
                onClick={() => handleApprove(p.user_profile_id, true)}
                disabled={actionLoading === p.user_profile_id}
              >
                {actionLoading === p.user_profile_id ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Approve
              </Button> */}
              {/* <Button
                size="sm"
                variant="destructive"
                onClick={() => handleApprove(p.user_profile_id, false)}
                disabled={actionLoading === p.user_profile_id}
              >
                <X className="h-4 w-4" /> Reject
              </Button> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

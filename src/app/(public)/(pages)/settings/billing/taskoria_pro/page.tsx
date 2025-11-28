"use client";

import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useProfessionalPackages } from "@/hooks/useProfessionalPackage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export default function TaskoriaProPage() {
    const router = useRouter();
    const { packages, isLoading, hasError } = useProfessionalPackages();
    const [loading, setLoading] = useState(false);
    const features = [
        { title: "Explore a list of leads", standard: true, pro: true },
        { title: "Two free leads every week", standard: false, pro: true },
        { title: "20% off credit packs", standard: false, pro: true },
        { title: "Taskoria Pro badge & verified status", standard: false, pro: true },
        { title: "Better ROI (avg +26%)", standard: false, pro: true },
        { title: "Seen by more customers", standard: false, pro: true },
        { title: "Dedicated customer service", standard: false, pro: true },
        { title: "One-click lead quality review", standard: false, pro: true },
        { title: "Exclusive invoicing tool", standard: false, pro: true },
    ];
    const { data: session } = useSession();
    console.log(session?.user.id);
    const proPackage = packages?.[0];
console.log(proPackage);

    const handleActivate = async () => {
        if (!proPackage) return;
setLoading(true)
        try {
            const { data } = await axios.post("/api/stripe/stripecheckout", {
                professionalId: session?.user.id,
                packageId: proPackage.package_id,
                amount: proPackage.price,
                packageName: proPackage.name

            })
            toast.success("Redirecting to Payment");
            window.location.href = data.url;

        } catch (error) {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data); 
    console.error(error.response?.status); 
    console.error(error.message); 
  } else {
    console.error(error); 
  }            toast.error("Failed to redirect to payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold dark:text-white">
                    Upgrade to <span className="text-yellow-400">Taskoria Pro</span>
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                    Unlock premium features, weekly free leads, verified badge, and maximize your ROI.
                </p>
            </div>

            <Card className="border rounded-2xl shadow-lg dark:border-white/10 overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-2xl font-semibold dark:text-white text-center">
                        Compare Plans
                    </h2>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    <div className="grid grid-cols-3 border-t border-gray-200 dark:border-white/10 font-medium">
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900">Feature</div>
                        <div className="px-4 py-3 text-center bg-gray-50 dark:bg-gray-900">Standard</div>
                        <div className="px-4 py-3 text-center bg-yellow-50 dark:bg-yellow-900 text-yellow-700 font-semibold">
                            Taskoria Pro
                        </div>
                    </div>

                    {features.map((item, idx) => (
                        <div
                            key={idx}
                            className={`grid grid-cols-3 border-t border-gray-200 dark:border-white/10 ${idx % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"
                                }`}
                        >
                            <div className="px-4 py-3">{item.title}</div>
                            <div className="px-4 py-3 flex justify-center">
                                {item.standard ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                            </div>
                            <div className="px-4 py-3 flex justify-center">
                                {item.pro ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 flex flex-col md:flex-row md:justify-end md:items-center gap-4">
                        {proPackage && (
                            <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full md:w-auto">
                                <div className="text-left md:text-right">
                                    <p className="text-lg font-semibold dark:text-white">{proPackage.name}</p>
                                    <p className="text-yellow-500 font-bold text-xl">
                                        A$ {proPackage.price} / Per Month
                                    </p>
                                </div>

                                <Button
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 px-8 rounded-xl font-semibold hover:scale-105 transition-transform"
                                    onClick={handleActivate}
                                    disabled={loading }
                                >
                                    {loading ? "Redirecting to Payment..."  : "Activate Pro"}
                                </Button>
                            </div>
                        )}

                        {!proPackage && !isLoading && (
                            <p className="text-red-500 font-medium">No Pro package available</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
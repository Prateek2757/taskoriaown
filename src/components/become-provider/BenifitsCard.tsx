"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Award, Users, TrendingUp } from "lucide-react";

const benefits = [
  { icon: Shield, color: "text-green-600", title: "Blockchain Verification", desc: "Build trust with tamper-proof reputation" },
  { icon: Award, color: "text-blue-600", title: "AI-Powered Growth", desc: "Get intelligent job recommendations" },
  { icon: Users, color: "text-purple-600", title: "Community Support", desc: "Network with fellow professionals" },
  { icon: TrendingUp, color: "text-orange-600", title: "Analytics Dashboard", desc: "Track earnings and performance" },
];

export default function BenefitsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Why Join Taskoria?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {benefits.map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className={`w-5 h-5 ${color} mt-1`} />
            <div>
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
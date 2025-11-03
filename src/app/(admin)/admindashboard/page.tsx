"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Layers } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Services", value: "12", icon: Layers },
    { title: "Active Users", value: "458", icon: Users },
    { title: "Total Jobs", value: "134", icon: Briefcase },
  ];

  return (
    <section className="grid md:grid-cols-3 gap-6">
      {stats.map(({ title, value, icon: Icon }) => (
        <Card key={title} className="hover:shadow-lg transition">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>{title}</CardTitle>
            <Icon className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
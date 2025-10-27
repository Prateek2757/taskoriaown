"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface Provider {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  image?: string;
  hourlyRate: number;
  badges?: string[];
}

const providers: Provider[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    service: "Interior Design",
    rating: 4.9,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b12b2134?w=100&h=100&fit=crop&crop=face",
    hourlyRate: 85,
    badges: ["Eco-Friendly", "Top Rated", "Fast Response"],
  },
  {
    id: 2,
    name: "Michael Chen",
    service: "Web Development",
    rating: 4.8,
    reviews: 89,
    // No image
    hourlyRate: 95,
    badges: ["AI Expert", "Blockchain Verified"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    service: "Marketing Consultant",
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    hourlyRate: 75,
    badges: ["Growth Specialist", "Community Leader"],
  },
];

export const FeatureProvider = () => {
  return (
    <section className="bg-muted/30 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-foreground">Featured Providers</h2>
          <Link href="/providers">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {providers.length === 0
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-card border rounded-xl p-6 h-40"
                />
              ))
            : providers.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="bg-card border rounded-xl p-6 shadow-sm hover-lift"
                >
                  <div className="flex items-center gap-4">
                    {/* Profile Image or Initials */}
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                      className="h-12 w-12 rounded-full bg-[linear-gradient(135deg,hsl(160_84%_39%),hsl(220_70%_50%))] 
                                 text-white grid place-content-center font-semibold uppercase shadow-sm"
                    >
                      {p.name
                        ?.split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    )}

                    <div>
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.service}</div>
                    </div>

                    <div className="ml-auto text-right">
                      <div className="text-sm font-semibold text-foreground">
                        ${p.hourlyRate}/hr
                      </div>
                      <div className="text-xs text-muted-foreground">⭐ {p.rating}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.badges?.map((t) => (
                      <span
                        key={t}
                        className="text-xs border px-2.5 py-1 rounded-full text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/providers/${encodeURIComponent(
                      p.name.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                  >
                    <Button  variant="outline" className="w-full hover:bg-blue-500 hover:text-white mt-4">
                      View Profile
                    </Button>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
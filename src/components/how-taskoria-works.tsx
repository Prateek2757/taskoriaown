"use client";

import { Shield, Rocket, Sparkles } from "lucide-react";
import { motion, MotionProps } from "motion/react";

// ✅ Data for "How It Works"
const howItWorks = [
  {
    title: "Post Your Job",
    description:
      "Use our AI assistant to describe your project effortlessly and publish instantly.",
    icon: Rocket,
  },
  {
    title: "Get Matched Instantly",
    description: "AI connects you with top verified providers for your needs.",
    icon: Sparkles,
  },
  {
    title: "Collaborate & Pay Securely",
    description: "Work, chat, and pay via AI‑powered escrow.",
    icon: Shield,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="bg-muted/30 border-y py-16 px-4 text-center"
    >
      <h2 className="text-3xl font-semibold text-foreground">
        How Taskoria Works
      </h2>
      <p className="text-muted-foreground mt-2">
        Start in minutes — find, match, and work securely
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {howItWorks.map(({ title, description, icon: Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-card rounded-2xl border p-6 shadow-sm hover-lift"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-blue-600 grid place-content-center mx-auto">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold  text-foreground">
              {index + 1}. {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
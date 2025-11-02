"use client";

import { motion } from "motion/react";
import { ArrowRight, Rocket, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Post Your Job",
    description:
      "Use our AI assistant to describe your project effortlessly and publish instantly.",
    icon: Rocket,
    image: "/images/jobposting.png",
  },
  {
    id: "automation",
    title: "Get Matched Instantly",
    description: "AI connects you with top verified providers for your needs.",
    icon: Sparkles,

    image: "/images/getmatched.png",
  },
  {
    id: "secure-implementation",
    title: "Collaborate & Pay Securely",
    description: "Work, chat, and pay via AI‑powered escrow.",
    icon: Shield,
    image: "/images/collabratesecure.png",
  },
];

export default function ServicesShowcase() {
  const first = services[0];
  const rest = services.slice(1);
  const FirstIcon = first.icon;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            How Taskoria <span className="text-indigo-600">Works for You</span>
          </h2>
          <p className="text-gray-600 max-w-sm text-sm md:text-base">
            Browse through a wide range of skilled professionals ready to take
            on your tasks. Whether it's a small job or a large project, Taskoria
            connects you with the right expert quickly.
          </p>
          <Link href="/services">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 py-2 text-sm flex items-center">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid gap-4"
        >
          <motion.div
            key={first.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
          >
            <Image
              src={first.image}
              alt={first.title}
              width={800}
              height={400}
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <FirstIcon className="h-5 w-5 text-indigo" />
                <h3 className="font-semibold text-lg">{first.title}</h3>
              </div>
              <p className="text-sm text-gray-200 max-w-sm">
                {first.description}
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {rest.map(({ id, title, description, icon: Icon, image }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition p-4 flex flex-col"
              >
                <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-snug">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

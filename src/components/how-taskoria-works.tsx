"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    id: "job-post",
    title: "Post Your Job",
    description:
      "Use our AI assistant to describe your project effortlessly and publish instantly.",
    icon: Rocket,
    image: "/images/jobpost.png",
  },
  {
    id: "automation",
    title: "Get Matched Instantly",
    description: "AI connects you with top verified providers for your needs.",
    icon: Sparkles,
    image: "/images/getmatch.png",
  },
  {
    id: "secure-implementation",
    title: "Collaborate & Pay Securely",
    description: "Work, chat, and pay via AI-powered escrow.",
    icon: Shield,
    image: "/images/collabratesecure.png",
  },
];

export default function ServicesShowcase() {
  const first = services[0];
  const rest = services.slice(1);
  const FirstIcon = first.icon;

  return (
    <section className="relative py-15 px-6 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            How <span className="text-[#3C7DED]">Taskoria</span> Works for You
          </h2>
          <p className="text-gray-600 max-w-md text-base md:text-lg leading-relaxed">
            Find skilled professionals ready to take on your tasks — from small
            gigs to big projects. Taskoria’s AI connects you instantly with
            verified experts so you can focus on results, not searching.
          </p>
          <Link href="/services">
            <Button className="bg-[#3C7DED] hover:bg-indigo-700 text-white rounded-full px-6 py-3 text-sm md:text-base flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-6"
        >
          <motion.div
            key={first.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
          >
            <Image
              src={first.image}
              alt={first.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-all duration-500 group-hover:from-black/70" />
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <FirstIcon className="h-5 w-5 text-indigo-400" />
                <h3 className="font-semibold text-xl">{first.title}</h3>
              </div>
              <p className="text-sm text-gray-200 max-w-sm leading-relaxed">
                {first.description}
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {rest.map(({ id, title, description, icon: Icon, image }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative w-full h-40 overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900 text-base">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import Link from "next/link";
import { Calendar, MessageCircle, Bot, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialIcon, platformLabel } from "./SocialIcon";

interface BookingPanelProps {
  provider: any;
  socialLinks: any[];
}

export function BookingPanel({ provider, socialLinks }: BookingPanelProps) {
  const hasSocial = socialLinks.length > 0;

  return (
    <div className="bg-white dark:bg-[#0c1220] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
      {/* Pricing header */}
      {provider.hourlyRate != null && (
        <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">${provider.hourlyRate}</span>
            <span className="text-sm text-white/80">/ hour</span>
          </div>
          <p className="text-xs text-white/70 mt-0.5">Starting rate · may vary by job</p>
        </div>
      )}

      {/* Actions */}
      <div className="p-5 space-y-3">
        <Button asChild className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20">
          <Link href="/">
            <Calendar className="w-4 h-4 mr-2" />
            Book Now
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl border-gray-200 dark:border-white/15 font-medium hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
          Send Message
        </Button>
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl border-gray-200 dark:border-white/15 font-medium hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <Bot className="w-4 h-4 mr-2 text-blue-600" />
          Get AI Quote
        </Button>
      </div>

      {/* Social links strip */}
      {hasSocial && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-white/10">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
            Connect
          </p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link: any, idx: number) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={platformLabel(link.platform)}
                className="group w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all duration-150"
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";
import { FaDiscord, FaGithub, FaPinterest, FaWhatsapp } from "react-icons/fa";

export function SocialIcon({ platform, className = "w-4 h-4" }: { platform: string; className?: string }) {
  const p = (platform ?? "").toLowerCase();
  if (p.includes("twitter") || p.includes("x.com") || p === "x")
    return <Twitter className={className} />;
  if (p.includes("instagram")) return <Instagram className={className} />;
  if (p.includes("facebook")) return <Facebook className={className} />;
  if (p.includes("linkedin")) return <Linkedin className={className} />;
  if (p.includes("youtube")) return <Youtube className={className} />;
  if (p.includes("whatsapp")) return <FaWhatsapp className={className} />;
  if (p.includes("pinterest")) return <FaPinterest className={className} />;
  if (p.includes("discord")) return <FaDiscord className={className} />;
  if (p.includes("github")) return <FaGithub className={className} />;
  return <Globe className={className} />;
}

export function platformLabel(platform: string): string {
  const map: Record<string, string> = {
    website: "Website",
    whatsapp: "WhatsApp",
    pinterest: "Pinterest",
    twitter: "Twitter / X",
    discord: "Discord",
    github: "GitHub",
    x: "Twitter / X",
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    youtube: "YouTube",
  };
  return map[(platform ?? "").toLowerCase()] ?? platform;
}

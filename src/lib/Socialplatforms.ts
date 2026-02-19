"use client"

import { Facebook, Github, Globe, Instagram, Linkedin, LucideIcon, Twitter, YoutubeIcon } from "lucide-react";
import { FaDiscord, FaPinterest, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { IconType } from "react-icons/lib";

export interface SocialPlatform {
    id: string;
    name: string;
    icon: LucideIcon |IconType; 
    baseUrl: string;
    placeholder: string;
    validation: RegExp;
    extractUsername?: (url: string) => string | null;
    formatUrl?: (username: string) => string;
    color: string;
  }
  
  export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
    website: {
      id: "website",
      name: "Website",
      icon: Globe,
      baseUrl: "",
      placeholder: "https://example.com",
      validation: /^https?:\/\/.+\..+/,
      color: "#6B7280",
    },
    instagram: {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      baseUrl: "https://instagram.com/",
      placeholder: "username or https://instagram.com/username",
      validation: /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?$|^([a-zA-Z0-9._]+)$/,
      extractUsername: (url) => {
        const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
        if (match) return match[1];
        // If it's just a username
        if (/^[a-zA-Z0-9._]+$/.test(url)) return url;
        return null;
      },
      formatUrl: (username) => `https://instagram.com/${username}`,
      color: "#E4405F",
    },
    linkedin: {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      baseUrl: "https://linkedin.com/",
      placeholder: "https://linkedin.com/in/username or company/name",
      validation: /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(in|company)\/([a-zA-Z0-9-]+)\/?$/,
      extractUsername: (url) => {
        const match = url.match(/linkedin\.com\/(in|company)\/([a-zA-Z0-9-]+)/);
        return match ? `${match[1]}/${match[2]}` : null;
      },
      formatUrl: (username) => `https://linkedin.com/${username}`,
      color: "#0A66C2",
    },
    twitter: {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      baseUrl: "https://x.com/",
      placeholder: "username or https://x.com/username",
      validation: /^(?:https?:\/\/)?(?:www\.)?(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/?$|^@?([a-zA-Z0-9_]+)$/,
      extractUsername: (url) => {
        const match = url.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/);
        if (match) return match[1];
        // If it's just a username with or without @
        const cleanUsername = url.replace(/^@/, "");
        if (/^[a-zA-Z0-9_]+$/.test(cleanUsername)) return cleanUsername;
        return null;
      },
      formatUrl: (username) => `https://x.com/${username}`,
      color: "#000000",
    },
    facebook: {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      baseUrl: "https://facebook.com/",
      placeholder: "username or https://facebook.com/username",
      validation: /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9.]+)\/?$/,
      extractUsername: (url) => {
        const match = url.match(/facebook\.com\/([a-zA-Z0-9.]+)/);
        if (match) return match[1];
        if (/^[a-zA-Z0-9.]+$/.test(url)) return url;
        return null;
      },
      formatUrl: (username) => `https://facebook.com/${username}`,
      color: "#1877F2",
    },
    youtube: {
      id: "youtube",
      name: "YouTube",
      icon: YoutubeIcon,
      baseUrl: "https://youtube.com/",
      placeholder: "https://youtube.com/@channel or channel name",
      validation: /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/([@a-zA-Z0-9_-]+|channel\/[a-zA-Z0-9_-]+)\/?$/,
      extractUsername: (url) => {
        const match = url.match(/youtube\.com\/([@a-zA-Z0-9_-]+|channel\/[a-zA-Z0-9_-]+)/);
        if (match) return match[1];
        if (/^[@a-zA-Z0-9_-]+$/.test(url)) return url;
        return null;
      },
      formatUrl: (username) => `https://youtube.com/${username}`,
      color: "#FF0000",
    },

    github: {
      id: "github",
      name: "GitHub",
      icon: Github,
      baseUrl: "https://github.com/",
      placeholder: "username or https://github.com/username",
      validation: /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/?$/,
      extractUsername: (url) => {
        const match = url.match(/github\.com\/([a-zA-Z0-9-]+)/);
        if (match) return match[1];
        if (/^[a-zA-Z0-9-]+$/.test(url)) return url;
        return null;
      },
      formatUrl: (username) => `https://github.com/${username}`,
      color: "#181717",
    },
    pinterest: {
      id: "pinterest",
      name: "Pinterest",
      icon: FaPinterest,
      baseUrl: "https://pinterest.com/",
      placeholder: "username or https://pinterest.com/username",
      validation: /^(?:https?:\/\/)?(?:www\.)?pinterest\.com\/([a-zA-Z0-9_]+)\/?$/,
      extractUsername: (url) => {
        const match = url.match(/pinterest\.com\/([a-zA-Z0-9_]+)/);
        if (match) return match[1];
        if (/^[a-zA-Z0-9_]+$/.test(url)) return url;
        return null;
      },
      formatUrl: (username) => `https://pinterest.com/${username}`,
      color: "#E60023",
    },
    whatsapp: {
      id: "whatsapp",
      name: "WhatsApp",
      icon: FaWhatsapp,
      baseUrl: "https://wa.me/",
      placeholder: "Phone number with country code (e.g., 1234567890 or +1234567890)",
      validation: /^(?:https?:\/\/)?(?:wa\.me\/)?(\+?[0-9]{10,15})$/,
      extractUsername: (url) => {
        // Extract from wa.me URL or plain number
        const match = url.match(/wa\.me\/(\+?[0-9]+)/);
        if (match) return match[1].replace(/[^0-9]/g, "");
        // If it's just a phone number
        const cleaned = url.replace(/[^0-9]/g, "");
        if (cleaned.length >= 10 && cleaned.length <= 15) return cleaned;
        return null;
      },
      formatUrl: (phone) => `https://wa.me/${phone.replace(/[^0-9]/g, "")}`,
      color: "#25D366",
    },
    telegram: {
      id: "telegram",
      name: "Telegram",
      icon: FaTelegram,
      baseUrl: "https://t.me/",
      placeholder: "username or https://t.me/username",
      validation: /^(?:https?:\/\/)?(?:www\.)?t\.me\/([a-zA-Z0-9_]+)\/?$/,
      extractUsername: (url) => {
        const match = url.match(/t\.me\/([a-zA-Z0-9_]+)/);
        if (match) return match[1];
        if (/^[a-zA-Z0-9_]+$/.test(url)) return url;
        return null;
      },
      formatUrl: (username) => `https://t.me/${username}`,
      color: "#0088CC",
    },
    discord: {
      id: "discord",
      name: "Discord",
      icon: FaDiscord,
      baseUrl: "https://discord.gg/",
      placeholder: "Invite code or full URL",
      validation: /^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9]+)\/?$/,
      extractUsername: (url) => {
        const match = url.match(/(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9]+)/);
        if (match) return match[1];
        if (/^[a-zA-Z0-9]+$/.test(url)) return url;
        return null;
      },
      formatUrl: (code) => `https://discord.gg/${code}`,
      color: "#5865F2",
    },
  };
  
  export function validateAndFormatUrl(
    platform: string,
    input: string
  ): { valid: boolean; url?: string; username?: string; error?: string } {
    const platformConfig = SOCIAL_PLATFORMS[platform];
    
    if (!platformConfig) {
      return { valid: false, error: "Invalid platform" };
    }
  
    const trimmedInput = input.trim();
    
    if (!trimmedInput) {
      return { valid: false, error: "URL cannot be empty" };
    }
  
    if (platform === "website") {
      if (!platformConfig.validation.test(trimmedInput)) {
        return { valid: false, error: "Please enter a valid URL (e.g., https://example.com)" };
      }
      return { valid: true, url: trimmedInput, username: undefined };
    }
  
    const username = platformConfig.extractUsername?.(trimmedInput);
    
    if (!username) {
      return { 
        valid: false, 
        error: `Invalid ${platformConfig.name} URL or username` 
      };
    }
  
    const formattedUrl = platformConfig.formatUrl?.(username) || trimmedInput;
  
    return {
      valid: true,
      url: formattedUrl,
      username,
    };
  }
  
  export function detectPlatform(url: string): string | null {
    for (const [key, platform] of Object.entries(SOCIAL_PLATFORMS)) {
      if (platform.validation.test(url)) {
        return key;
      }
    }
    return null;
  }
  
  export const POPULAR_PLATFORMS = [
    "website",
    "instagram",
    "linkedin",
    "twitter",
    "facebook",
    "youtube",
    "github",
    "whatsapp",
    "telegram",
    "pinterest",
    "discord",
  ];
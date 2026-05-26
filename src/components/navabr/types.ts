
import { Home, HandPlatter, Search, Binoculars, MessageSquare, LayoutDashboard } from "lucide-react";

export type ViewMode = "customer" | "provider";

export type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const NAV_LINKS: Record<"public" | "customer" | "provider", NavLink[]> =
  {
    public: [
      { name: "Home", href: "/", icon: Home },
      { name: "Services", href: "/services", icon: HandPlatter },
    ],
    customer: [
      { name: "Home", href: "/", icon: Home },
      { name: "My Requests", href: "/customer/dashboard", icon: Search },
      { name: "Discover", href: "/services", icon: Binoculars },
      { name: "Messages", href: "/messages/null", icon: MessageSquare },
    ],
    provider: [
      { name: "Home", href: "/", icon: Home },
      { name: "Leads", href: "/provider/leads", icon: Search },
      { name: "Inbox", href: "/messages/null", icon: MessageSquare },      {
        name: "My Responses",
        href: "/provider-responses",
        icon: MessageSquare,
      },
      {
        name: "Dashboard",
        href: "/provider/dashboard",
        icon: LayoutDashboard,
      },
    ],
  };

export const MINIMAL_PAGES = ["/create", "/create-account"];

export const PREFETCH_ROUTES = [
  "/signin",
  "/services",
  "/",
  "/provider/leads",
  "/customer/dashboard",
  "/provider/dashboard",
  "/messages/null",
  "/settings/profile/my-profile",
  "/settings/billing/taskoria_pro",
  "/settings/billing/unsubscription",
  "/affiliate-dashboard-portal",
  "/provider-responses",
];

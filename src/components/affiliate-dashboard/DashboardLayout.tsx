import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BarChart3,
  Link2,
  Wallet,
  BookOpen,
  Settings,
  HelpCircle,
  Bell,
  Menu,
  LogOut,
  ChevronDown,
  Sparkles,
  User,
  Shield,
  Moon,
  MessageSquare,
  Home,
} from "lucide-react";
import { notifications } from "@/lib/mockData";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: any) => void;
}

const navItems = [
  // { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  // { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "referrals", label: "Referrals", icon: Link2 },
  { id: "payouts", label: "Payouts", icon: Wallet },
  // { id: "resources", label: "Resources", icon: BookOpen },
];

const bottomNavItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support", icon: HelpCircle },
];

export function DashboardLayout({
  children,
  activeView,
  onViewChange,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const { data: session } = useSession();
  const user = session?.user;
  const handleGoToHomePAge = () => {
    router.push("/");
  };

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="h-screen">
        <Link
          href="/"
          className={`flex items-center ${isMobile ? "px-4 py-4" : "px-4 py-6"}`}
        >
          <div className="w-10 h-10 rounded-xl shadow-glow flex items-center justify-center ">
            <Image
            title="taskoria logo in affiliate dashbaord"
              src="/images/taskoria_logo.svg"
              alt="taskorialogo"
              height={41}
              width={28}
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900">Taskoria</h1>
            <p className="text-xs text-slate-500">Affiliate Portal</p>
          </div>
        </Link>
        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    if (isMobile) setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                  />
                  {item.label}
                  {/* {item.id === "referrals" && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-xs bg-green-100 text-green-700"
                    >
                      3 new
                    </Badge>
                  )} */}
                </button>
              );
            })}
          </div>

          {/* <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Support
            </p>
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    if (isMobile) setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                  />
                  {item.label}
                </button>
              );
            })}
          </div> */}
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t absolute bottom-0 border-slate-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <Avatar className="w-9 h-9 mr-3">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="gradient-primary text-white text-sm font-medium">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name}
                  </p>
                  {/* <p className="text-xs  text-slate-500 truncate">
                    {user?.email}
                  </p> */}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem onClick={() => onViewChange("settings")}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem>
                <Shield className="w-4 h-4 mr-2" />
                Security
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Moon className="w-4 h-4 mr-2" />
                Dark Mode
              </DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                onClick={handleGoToHomePAge}
                className="text-blue-600"
              >
                <Home className="w-4 h-4 mr-2" />
                GO TO Home Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full z-30">
        <NavContent />
      </aside>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent isMobile />
        </SheetContent>
      </Sheet>

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <NavContent isMobile />
              </SheetContent>
            </Sheet>

            {/* Page Title */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-semibold text-slate-900 capitalize">
                {activeView === "dashboard" ? "Dashboard Overview" : activeView}
              </h2>
            </div>

            {/* <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <Badge variant="secondary" className="text-xs">
                      {unreadNotifications} new
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            notification.type === "success"
                              ? "bg-green-500"
                              : notification.type === "warning"
                                ? "bg-amber-500"
                                : notification.type === "error"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                          }`}
                        />
                        <span className="font-medium text-sm flex-1">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 ml-4">
                        {notification.message}
                      </p>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-blue-600 font-medium">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon">
                <MessageSquare className="w-5 h-5 text-slate-600" />
              </Button>

              <div className="lg:hidden">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="gradient-primary text-white text-xs">
                    {user?.name}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div> */}
          </div>
        </header>

        <div className="p-1 overflow-auto lg:p-8">{children}</div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive ? "text-blue-600" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile padding for bottom nav */}
      <div className="lg:hidden h-16" />
    </div>
  );
}

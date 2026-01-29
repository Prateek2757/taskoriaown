"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Bell, FileText, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-server";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

type NotificationType = "post" | "comment" | "request" | "file" | "system" | "lead_purchased" | "lead_response";

type Notification = {
  notification_id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  type?: NotificationType;
  action_url?: string;
  user_name?: string;
  user_avatar?: string;
  action_buttons?: { label: string; action: string }[];
  attachment?: string;
};

let globalChannelRef: any = null;
let globalUserId: number | null = null;

export default function NotificationBell({ userId }: { userId: number }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "general">("inbox");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const initializedRef = useRef(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNewNotification = useCallback((payload: any) => {
    if (!userId) return;

    const newNotification = payload.new as Notification;

    setNotifications((prev) => {
      if (
        prev.find((n) => n.notification_id === newNotification.notification_id)
      )
        return prev;
      return [newNotification, ...prev];
    });

    if (bellRef.current) {
      bellRef.current.classList.add("animate-bounce");
      setTimeout(
        () => bellRef.current?.classList.remove("animate-bounce"),
        1000
      );
    }

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(newNotification.title, {
        body: newNotification.body,
        icon: "/favicon.ico",
      });
    }

    toast(newNotification.body, {
      description: newNotification.title,
      duration: 5000,
    });

    const audio = new Audio("/notificationsound.wav");
    audio.play().catch();
  }, []);

  const handleUpdateNotification = useCallback((payload: any) => {
    const updatedNotification = payload.new as Notification;

    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === updatedNotification.notification_id
          ? updatedNotification
          : n
      )
    );
  }, []);

  useEffect(() => {
    if (!userId || initializedRef.current) return;
    initializedRef.current = true;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications");
        const data = await res.data;
        setNotifications(
          data.sort(
            (a: Notification, b: Notification) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        );
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    if (!globalChannelRef || globalUserId !== userId) {
      if (globalChannelRef) {
        supabaseBrowser.removeChannel(globalChannelRef);
        globalChannelRef = null;
      }

      globalUserId = userId;

      const channel = supabaseBrowser
        .channel(`notifications:${userId}`, {
          config: {
            broadcast: { self: false },
            presence: { key: "" },
          },
        })
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          handleNewNotification
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          handleUpdateNotification
        )
        .subscribe((status) => {
          // console.log(`📊 Status: ${status}`);

          if (status === "SUBSCRIBED") {
          }
        });

      globalChannelRef = channel;
    }

    return () => {
      // console.log("🔄 Component unmounting");
      initializedRef.current = false;
    };
  }, [userId, handleNewNotification, handleUpdateNotification]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    const diffInMinutes = Math.floor((now - past) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    );

    try {
      await axios.post("/api/notifications", { notificationId: id });
    } catch (err) {
      console.error("Error marking as read:", err);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: false } : n
        )
      );
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.is_read)
      .map((n) => n.notification_id);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      await Promise.all(
        unreadIds.map((id) =>
          axios.post("/api/notifications", { notificationId: id })
        )
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleAction = async (notificationId: number, action: string) => {
    // console.log(`Action: ${action} for notification: ${notificationId}`);
    await markAsRead(notificationId);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-pink-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-blue-100",
      "bg-orange-100",
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={bellRef}
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-[-20px] mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[9999]">
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Notifications
                </h2>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab("inbox")}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "inbox"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  Inbox
                  {unreadCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.notification_id);
                      }
                      if(notification.action_url){
                        router.push(notification.action_url)
                      }
                    }}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      !notification.is_read
                        ? "bg-blue-50/30 dark:bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${getAvatarColor(notification.user_name || "")}`}
                      >
                        {notification.user_avatar || "👤"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                          )}
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {getTimeAgo(notification.created_at)} •{" "}
                          {notification.body}
                        </p>

                        {notification.attachment && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 mb-2 mt-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <FileText className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-medium">
                              {notification.attachment}
                            </span>
                          </div>
                        )}

                        {notification.action_buttons && (
                          <div className="flex gap-2 mt-2">
                            {notification.action_buttons.map((button, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(
                                    notification.notification_id,
                                    button.action
                                  );
                                }}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                  button.action === "accept"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                              >
                                {button.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

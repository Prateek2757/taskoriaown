"use client"
import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { supabaseAdmin } from "@/lib/supabase-admin"

export function useNotificationTitle() {
  const { data: session } = useSession()
  const originalTitle = useRef<string | null>(null)
  const channelRef = useRef<any>(null)
  const unreadCount = useRef<number>(0)
  const lastNotificationName = useRef<string>("")

  useEffect(() => {
    if (originalTitle.current === null) {
      originalTitle.current = document.title
    }
  }, [])

  const updateTitle = () => {
    if (unreadCount.current > 0) {
      if (unreadCount.current === 1) {
        document.title = `💬 ${lastNotificationName.current} sent a message`
      } else {
        document.title = `💬 ${unreadCount.current} new messages`
      }
    } else {
      document.title = originalTitle.current!
    }
  }

  useEffect(() => {
    if (!session?.user?.id) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        unreadCount.current = 0
        lastNotificationName.current = ""
        document.title = originalTitle.current!
      } else {
        updateTitle()
      }
    }

    const readChannel = supabaseAdmin
      .channel("notification-reads")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const notification = payload.new
          
          if (notification.is_read && unreadCount.current > 0) {
            unreadCount.current--
            updateTitle()
          }
        }
      )
      .subscribe()

    channelRef.current = supabaseAdmin
      .channel("notification-inserts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const notification = payload.new

          if (notification.type === "message") {
            unreadCount.current++
            lastNotificationName.current = notification.user_name || "Someone"
            
            if (!document.hasFocus()) {
              updateTitle()
            }
          }
        }
      )
      .subscribe()

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      
      if (channelRef.current) {
        supabaseAdmin.removeChannel(channelRef.current)
      }
      
      if (readChannel) {
        supabaseAdmin.removeChannel(readChannel)
      }
      
      if (originalTitle.current) {
        document.title = originalTitle.current
      }
    }
  }, [session?.user?.id])
}
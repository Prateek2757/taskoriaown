"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const CHAT_SDK_URL =
  "https://www.gstatic.com/chat-messenger/sdk/prod/v1.16/chat-messenger.js";

// Default theme stylesheet for the widget (colors, shape, typography tokens).
// We override the color tokens below with your brand color via CSS variables.
const CHAT_SDK_THEME_URL =
  "https://www.gstatic.com/ces-console/fast/chat-messenger/prod/v1/themes/chat-messenger-default.css";

const DEFAULT_DEPLOYMENT_NAME =
  "projects/942515104650/locations/us/apps/1fd5d94e-afde-4166-8013-b92f55e3aa19/deployments/63a157f1-3537-461f-9165-b5423d6e8175";

const MESSAGE_COOLDOWN_MS = 7000;
const CHAT_WIDGET_RIGHT_OFFSET = "clamp(16px, 4vw, 66px)";
const CHAT_WIDGET_BOTTOM_OFFSET = "max(16px, env(safe-area-inset-bottom))";
const CHAT_WIDGET_WINDOW_WIDTH = "min(400px, calc(100vw - 32px))";
const CHAT_WIDGET_WINDOW_HEIGHT = "min(620px, calc(100dvh - 112px))";

// --- Brand theming ---------------------------------------------------------
// Primary brand color used for the bubble icon, send button, and other
// high-emphasis fills. Derived light-tint and text colors are picked to stay
// readable against #2563EB.
const BRAND_PRIMARY = "#2563EB";
const BRAND_PRIMARY_CONTAINER = "#DCE7FD"; // light tint of primary, used for user message bubbles
const BRAND_ON_PRIMARY = "#FFFFFF"; // text/icons on top of primary
const BRAND_ON_PRIMARY_CONTAINER = "#1E3A8A"; // text on top of primary-container
const BRAND_LINK = "#2563EB";

let registrationStarted = false;
let registrationCompleted = false;

declare global {
  interface Window {
    chatSdk?: {
      registerContext: (context: unknown) => void;
      prebuilts: {
        ces: {
          createContext: (config: {
            deploymentName: string;
            tokenBroker: {
              enableTokenBroker: boolean;
              enableRecaptcha?: boolean;
            };
          }) => unknown;
        };
      };
    };
    __taskoriaAgentRegistered?: boolean;
  }

  namespace JSX {
    interface IntrinsicElements {
      "chat-messenger": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        ref?: React.Ref<HTMLElement>;
        "render-mode"?: string;
        "language-code"?: string;
        "max-query-length"?: string;
        "url-allowlist"?: string;
      };
      // Wraps the chat UI behind a floating bubble icon. The chat box only
      // opens once the bubble is clicked — this replaces
      // <chat-messenger-container>, which renders open by default.
      "chat-messenger-chat-bubble": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "chat-title"?: string;
        "chat-title-icon"?: string;
        "enable-file-upload"?: string;
        "enable-audio-input"?: string;
      };
      "chat-reset-session-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        slot?: string;
        "title-text"?: string;
      };
      "chat-toggle-dialog-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        slot?: string;
        "title-text-expanded"?: string;
        "title-text-collapsed"?: string;
      };
      "chat-messenger-close-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        slot?: string;
        "title-text"?: string;
      };
    }
  }
}

function isChatSdkReady() {
  return (
    typeof window !== "undefined" &&
    !!window.chatSdk &&
    typeof window.chatSdk.registerContext === "function" &&
    typeof window.chatSdk.prebuilts?.ces?.createContext === "function"
  );
}

export default function TaskoriaAgent() {
  const messengerRef = useRef<HTMLElement | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownUntilRef = useRef<number>(0);

  const [isCoolingDown, setIsCoolingDown] = useState(false);

  const startCooldown = useCallback(() => {
    cooldownUntilRef.current = Date.now() + MESSAGE_COOLDOWN_MS;
    setIsCoolingDown(true);

    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
    }

    cooldownTimerRef.current = setTimeout(() => {
      setIsCoolingDown(false);
      cooldownUntilRef.current = 0;
    }, MESSAGE_COOLDOWN_MS);
  }, []);

  const isInsideMessenger = useCallback((event: Event) => {
    const messenger = messengerRef.current;
    if (!messenger) return false;

    const path = event.composedPath?.() ?? [];
    return path.includes(messenger);
  }, []);

  const shouldBlockMessage = useCallback(() => {
    return Date.now() < cooldownUntilRef.current;
  }, []);

  const registerAgent = useCallback(() => {
    if (typeof window === "undefined") return;

    if (
      registrationStarted ||
      registrationCompleted ||
      window.__taskoriaAgentRegistered
    ) {
      return;
    }

    if (!isChatSdkReady()) return;

    registrationStarted = true;

    try {
      const deploymentName =
        process.env.NEXT_PUBLIC_CHAT_DEPLOYMENT_NAME?.trim() ||
        DEFAULT_DEPLOYMENT_NAME;

      const context = window.chatSdk!.prebuilts.ces.createContext({
        deploymentName,
        tokenBroker: {
          enableTokenBroker: true,
          enableRecaptcha: true,
        },
      });

      window.chatSdk!.registerContext(context);

      registrationCompleted = true;
      window.__taskoriaAgentRegistered = true;
    } catch (error) {
      registrationStarted = false;
      console.error("Taskoria Agent registration failed:", error);
    }
  }, []);

  useEffect(() => {
    const messenger = messengerRef.current;

    const handleLoaded = () => {
      registerAgent();
    };

    const handleError = (event: Event) => {
      const detail = (event as CustomEvent).detail;

      console.group("Taskoria Agent Error");
      console.error("Raw detail:", detail);

      try {
        console.error("JSON detail:", JSON.stringify(detail, null, 2));
      } catch {
        console.error("Could not stringify detail");
      }

      console.groupEnd();

      setIsCoolingDown(false);
      cooldownUntilRef.current = 0;

      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isInsideMessenger(event)) return;
      if (event.key !== "Enter") return;
      if (event.shiftKey) return;

      if (shouldBlockMessage()) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      startCooldown();
    };

    const handleClick = (event: MouseEvent) => {
      if (!isInsideMessenger(event)) return;

      if (shouldBlockMessage()) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("chat-messenger-loaded", handleLoaded);
    window.addEventListener("chat-messenger-error", handleError);

    messenger?.addEventListener("chat-messenger-loaded", handleLoaded);
    messenger?.addEventListener("chat-messenger-error", handleError);

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("click", handleClick, true);

    registerAgent();

    return () => {
      window.removeEventListener("chat-messenger-loaded", handleLoaded);
      window.removeEventListener("chat-messenger-error", handleError);

      messenger?.removeEventListener("chat-messenger-loaded", handleLoaded);
      messenger?.removeEventListener("chat-messenger-error", handleError);

      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("click", handleClick, true);

      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, [
    registerAgent,
    isInsideMessenger,
    shouldBlockMessage,
    startCooldown,
  ]);

  return (
    <>
      <Script
        id="taskoria-chat-messenger-sdk"
        src={CHAT_SDK_URL}
        strategy="afterInteractive"
        onReady={registerAgent}
      />

      {/* Next.js hoists <link> tags rendered in components into <head>. */}
      <link rel="stylesheet" href={CHAT_SDK_THEME_URL} />

      {isCoolingDown && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 88,
            zIndex: 9998,
            background: "#111827",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 999,
            fontSize: 13,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          Agent is replying...
        </div>
      )}

      <chat-messenger
        ref={messengerRef}
        render-mode="slide-over"
        language-code="en"
        max-query-length="500"
        url-allowlist="https://taskoria.com,http://localhost:3000"
        style={
          {
            position: "fixed",
            right: CHAT_WIDGET_RIGHT_OFFSET,
            bottom: CHAT_WIDGET_BOTTOM_OFFSET,
            zIndex: 9999,

            display: "block",
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "calc(100dvh - 32px)",
            pointerEvents: isCoolingDown ? "none" : "auto",

            "--chat-messenger-window-width": CHAT_WIDGET_WINDOW_WIDTH,
            "--chat-messenger-window-height": CHAT_WIDGET_WINDOW_HEIGHT,

            // Brand color tokens — see the CSS customization table in
            // Google's chat-messenger docs for the full token list.
            "--chat-messenger-color--primary": BRAND_PRIMARY,
            "--chat-messenger-color--primary-container":
              BRAND_PRIMARY_CONTAINER,
            "--chat-messenger-color--on-primary": BRAND_ON_PRIMARY,
            "--chat-messenger-color--on-primary-container":
              BRAND_ON_PRIMARY_CONTAINER,
            "--chat-messenger-color--link": BRAND_LINK,
          } as React.CSSProperties
        }
      >
        {/*
          chat-messenger-chat-bubble renders a closed floating icon first.
          The box (chat-title, titlebar buttons, message list, input) only
          mounts/opens once the user clicks that bubble.
        */}
        <chat-messenger-chat-bubble
          chat-title="Taskoria Agent"
          chat-title-icon="https://gstatic.com/dialogflow-console/common/assets/ccai-favicons/conversational_agents.png"
          enable-file-upload=""
          enable-audio-input=""
        >
          <chat-reset-session-button
            slot="titlebar-actions"
            title-text="Start new chat"
          />

          <chat-toggle-dialog-button
            slot="titlebar-actions"
            title-text-expanded="Collapse"
            title-text-collapsed="Expand"
          />

          <chat-messenger-close-button
            slot="titlebar-actions"
            title-text="Close"
          />
        </chat-messenger-chat-bubble>
      </chat-messenger>
    </>
  );
}

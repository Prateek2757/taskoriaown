"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const CHAT_SDK_URL =
  "https://www.gstatic.com/chat-messenger/sdk/prod/v1.16/chat-messenger.js";

const DEFAULT_DEPLOYMENT_NAME =
  "projects/942515104650/locations/us/apps/1fd5d94e-afde-4166-8013-b92f55e3aa19/deployments/63a157f1-3537-461f-9165-b5423d6e8175";

const MESSAGE_COOLDOWN_MS = 7000;

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
      "chat-messenger-container": React.DetailedHTMLProps<
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
  style={{
    position: "fixed",
    right: 16,
    bottom: 16,
    zIndex: 9999,

    width: "400px",
    height: "600px",
    maxWidth: "calc(100vw - 32px)",
    maxHeight: "calc(100vh - 32px)",

    display: "block",
    pointerEvents: isCoolingDown ? "none" : "auto",
  }}
>
        <chat-messenger-container
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
        </chat-messenger-container>
      </chat-messenger>
    </>
  );
}
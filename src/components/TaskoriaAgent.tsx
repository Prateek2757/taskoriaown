"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

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

  const [isOpen, setIsOpen] = useState(false);
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
  }, [registerAgent, isInsideMessenger, shouldBlockMessage, startCooldown]);

  return (
    <>
      <Script
        id="taskoria-chat-messenger-sdk"
        src={CHAT_SDK_URL}
        strategy="afterInteractive"
        onReady={registerAgent}
      />

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="taskoria-agent-launcher"
          aria-label="Open Taskoria chat"
        >
          <MessageCircle aria-hidden="true" size={18} />
          <span>Chat with Taskoria</span>
        </button>
      )}

      {isOpen && isCoolingDown && (
        <div className="taskoria-agent-cooldown" role="status">
          Agent is replying...
        </div>
      )}

      <div className="taskoria-agent-panel" data-open={isOpen}>
        <chat-messenger
          ref={messengerRef}
          render-mode="slide-over"
          language-code="en"
          max-query-length="500"
          url-allowlist="https://taskoria.com,http://localhost:3000"
          className="taskoria-agent-messenger"
          data-cooling={isCoolingDown}
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
          </chat-messenger-container>
        </chat-messenger>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="taskoria-agent-close"
          aria-label="Close Taskoria chat"
        >
          <X aria-hidden="true" size={16} />
          <span>Close chat</span>
        </button>
      </div>

      <style>{`
        .taskoria-agent-launcher {
          position: fixed;
          right: 16px;
          bottom: max(16px, env(safe-area-inset-bottom));
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          max-width: calc(100vw - 32px);
          border: none;
          outline: none;
          cursor: pointer;
          border-radius: 999px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
        }

        .taskoria-agent-cooldown {
          position: fixed;
          right: 16px;
          bottom: min(590px, calc(100dvh - 64px));
          z-index: 10001;
          background: #111827;
          color: #fff;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 13px;
          line-height: 1.2;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        }

        .taskoria-agent-panel {
          position: fixed;
          right: 16px;
          bottom: max(16px, env(safe-area-inset-bottom));
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: min(350px, calc(100vw - 32px));
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
          pointer-events: none;
        }

        .taskoria-agent-panel[data-open="true"] {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        .taskoria-agent-messenger {
          display: block;
          width: 100%;
          height: min(550px, calc(100dvh - 90px));
          max-height: calc(100vh - 90px);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.22);
        }

        .taskoria-agent-messenger[data-cooling="true"] {
          pointer-events: none;
        }

        .taskoria-agent-close {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #374151;
          border-radius: 999px;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        }

        @supports not (height: 100dvh) {
          .taskoria-agent-cooldown {
            bottom: min(590px, calc(100vh - 64px));
          }

          .taskoria-agent-messenger {
            height: min(550px, calc(100vh - 90px));
          }
        }

        @media (max-width: 640px) {
          .taskoria-agent-launcher {
            right: 12px;
            bottom: max(12px, env(safe-area-inset-bottom));
            max-width: calc(100vw - 24px);
            padding: 13px 16px;
            font-size: 14px;
          }

          .taskoria-agent-cooldown {
            top: max(12px, env(safe-area-inset-top));
            right: 12px;
            bottom: auto;
            left: 12px;
            text-align: center;
          }

          .taskoria-agent-panel {
            right: 10px;
            bottom: max(10px, env(safe-area-inset-bottom));
            left: 10px;
            width: auto;
          }

          .taskoria-agent-messenger {
            height: calc(100dvh - 20px - env(safe-area-inset-bottom));
            max-height: none;
            border-radius: 18px;
          }

          .taskoria-agent-close {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 2;
            width: 36px;
            height: 36px;
            padding: 0;
            border-color: rgba(209, 213, 219, 0.9);
            background: rgba(255, 255, 255, 0.95);
            color: #111827;
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18);
          }

          .taskoria-agent-close span {
            display: none;
          }
        }

        @media (max-width: 360px) {
          .taskoria-agent-launcher {
            width: calc(100vw - 24px);
          }
        }
      `}</style>
    </>
  );
}

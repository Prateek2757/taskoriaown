import type { DetailedHTMLProps, HTMLAttributes } from "react";

type CustomElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "chat-messenger": CustomElementProps & {
        "render-mode"?: "slide-in" | "slide-over";
        "language-code"?: string;
        "max-query-length"?: string;
        "url-allowlist"?: string;
      };
      "chat-messenger-container": CustomElementProps & {
        "chat-title"?: string;
        "chat-title-icon"?: string;
        "enable-file-upload"?: string;
        "enable-audio-input"?: string;
      };
      "chat-messenger-chat-bubble": CustomElementProps & {
        "chat-title"?: string;
        "chat-title-icon"?: string;
        "enable-file-upload"?: string;
        "enable-audio-input"?: string;
      };
      "chat-reset-session-button": CustomElementProps & {
        slot?: string;
        "title-text"?: string;
      };
      "chat-toggle-dialog-button": CustomElementProps & {
        slot?: string;
        "title-text-expanded"?: string;
        "title-text-collapsed"?: string;
      };
      "chat-messenger-close-button": CustomElementProps & {
        slot?: string;
        "title-text"?: string;
      };
    }
  }
}

export {};

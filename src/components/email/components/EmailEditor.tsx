"use client";

import { useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import dynamic from "next/dynamic";
import { EditorRef } from "react-email-editor";

const EmailEditor = dynamic(() => import("react-email-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <svg className="w-7 h-7 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-sm">Loading editor…</span>
      </div>
    </div>
  ),
});

export interface EmailBuilderHandle {
  exportHtml: () => Promise<string>;
}

interface EmailBuilderProps {
  defaultBody?: string;
}


function buildDesign(plainText: string) {
  const htmlContent = plainText
    .split("\n")
    .map((line) => (line.trim() ? `<p style="margin:0 0 14px 0;">${line}</p>` : `<p style="margin:0 0 14px 0;">&nbsp;</p>`))
    .join("");

  return {
    counters: { u_row: 1, u_column: 1, u_content_text: 1 },
    body: {
      rows: [
        {
          cells: [1],
          columns: [
            {
              contents: [
                {
                  type: "text",
                  values: {
                    text: htmlContent,
                    fontSize: "15px",
                    fontFamily: {
                      label: "Arial",
                      value: "arial,helvetica,sans-serif",
                    },
                    color: "#111827",
                    lineHeight: "1.7",
                    padding: "0px",
                  },
                },
              ],
              values: {
                backgroundColor: "",
                padding: "0px",
                border: {},
              },
            },
          ],
          values: {
            backgroundColor: "#ffffff",
            padding: "0px",
            border: {},
            columnsBackgroundColor: "",
          },
        },
      ],
      values: {
        backgroundColor: "#ffffff",  
        contentWidth: "600px",
        fontFamily: {
          label: "Arial",
          value: "arial,helvetica,sans-serif",
        },
        preheaderText: "",
      },
    },
  };
}

const EmailBuilder = forwardRef<EmailBuilderHandle, EmailBuilderProps>(
  ({ defaultBody = "" }, ref) => {
    const editorRef = useRef<EditorRef>(null);
    const isReadyRef = useRef(false);

    useImperativeHandle(ref, () => ({
      exportHtml: () =>
        new Promise<string>((resolve, reject) => {
          const unlayer = editorRef.current?.editor;
          if (!unlayer || !isReadyRef.current) {
            return reject(new Error("Editor is not ready yet"));
          }
          unlayer.exportHtml(({ html }: { html: string }) => resolve(html));
        }),
    }));

    interface OnReadyCallback {
      (unlayer: EditorRef["editor"]): void;
    }

    const onReady: OnReadyCallback = useCallback(
      (unlayer) => {
      isReadyRef.current = true;
      if (defaultBody) {
        unlayer.loadDesign(buildDesign(defaultBody) as any);
      }
      },
      [defaultBody]
    );

    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <EmailEditor
          ref={editorRef}
          onReady={onReady}
          minHeight="420px"
          options={{
            displayMode: "email",
            appearance: {
              theme: "light",
              panels: { tools: { dock: "right" } },
            },
            features: {
              textEditor: { tables: false, emojis: false },
            },
            tools: {
              image:   { enabled: false },
              video:   { enabled: false },
              timer:   { enabled: false },
              menu:    { enabled: false },
              html:    { enabled: false },
              divider: { enabled: false },
            },
          }}
        />
      </div>
    );
  }
);

EmailBuilder.displayName = "EmailBuilder";
export default EmailBuilder;
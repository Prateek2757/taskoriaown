"use client";

/**
 * ReactQuillEditor
 * ─────────────────────────────────────────────────────────────
 * Drop-in replacement for the CKEditor wrapper.
 * Usage (same API as before):
 *   <ReactQuillEditor value={field.value} onChange={field.onChange} placeholder="…" />
 *
 * Install once:
 *   npm install react-quill-new
 *   # react-quill is unmaintained; react-quill-new is the maintained fork
 *   # that works with React 18/19 without the findDOMNode warning.
 *
 * The component is intentionally client-only. Import it with next/dynamic:
 *   const QuillEditor = dynamic(
 *     () => import("@/components/editor/ReactQuillEditor"),
 *     { ssr: false, loading: () => <div className="h-36 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" /> }
 *   );
 */

import { useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "link"],
  ["clean"],
];

const QUILL_FORMATS = [
  "header",
  "bold", "italic", "underline", "strike",
  "list",
  "blockquote", "link",
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function ReactQuillEditor({
  value,
  onChange,
  placeholder = "Type here…",
  minHeight = 160,
}: Props) {
  const quillRef = useRef<ReactQuill>(null);

 
  useEffect(() => {
    const styleId = "quill-theme-overrides";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .ql-container.ql-snow {
        border: none !important;
        font-family: 'DM Sans', system-ui, sans-serif;
        font-size: 14px;
        color: #18181b;          /* zinc-900 */
      }
      .ql-toolbar.ql-snow {
        border: none !important;
        border-bottom: 1px solid #e4e4e7 !important; /* zinc-200 */
        background: transparent;
        padding: 8px 10px;
      }
      .ql-toolbar.ql-snow .ql-stroke        { stroke:  #71717a; }  /* zinc-500 */
      .ql-toolbar.ql-snow .ql-fill          { fill:   #71717a; }
      .ql-toolbar.ql-snow .ql-picker-label  { color:  #71717a; }

      .ql-toolbar.ql-snow button:hover .ql-stroke,
      .ql-toolbar.ql-snow button.ql-active .ql-stroke { stroke: #2563eb; }   /* blue-600 */
      .ql-toolbar.ql-snow button:hover .ql-fill,
      .ql-toolbar.ql-snow button.ql-active .ql-fill   { fill:  #2563eb; }
      .ql-toolbar.ql-snow .ql-picker-label:hover      { color: #2563eb; }

      .ql-editor { min-height: var(--ql-min-height, 160px); padding: 12px 16px; line-height: 1.65; }
      .ql-editor.ql-blank::before { color: #a1a1aa; font-style: normal; left: 16px; right: 16px; } /* zinc-400 */

      /* ── Dark mode overrides ── */
      .dark .ql-container.ql-snow { color: #f4f4f5; }             /* zinc-100 */
      .dark .ql-toolbar.ql-snow   { border-bottom-color: #3f3f46 !important; } /* zinc-700 */

      .dark .ql-toolbar.ql-snow .ql-stroke       { stroke:  #a1a1aa; }
      .dark .ql-toolbar.ql-snow .ql-fill         { fill:   #a1a1aa; }
      .dark .ql-toolbar.ql-snow .ql-picker-label { color:  #a1a1aa; }
      .dark .ql-toolbar.ql-snow .ql-picker-options {
        background: #27272a;      /* zinc-800 */
        border-color: #3f3f46;
        color: #f4f4f5;
      }
      .dark .ql-toolbar.ql-snow button:hover .ql-stroke,
      .dark .ql-toolbar.ql-snow button.ql-active .ql-stroke { stroke: #60a5fa; } /* blue-400 */
      .dark .ql-toolbar.ql-snow button:hover .ql-fill,
      .dark .ql-toolbar.ql-snow button.ql-active .ql-fill   { fill:  #60a5fa; }
      .dark .ql-toolbar.ql-snow .ql-picker-label:hover      { color: #60a5fa; }

      .dark .ql-editor.ql-blank::before { color: #52525b; }       /* zinc-600 */

      /* Links */
      .ql-editor a { color: #2563eb; }
      .dark .ql-editor a { color: #60a5fa; }

      /* Blockquote */
      .ql-editor blockquote {
        border-left: 3px solid #e4e4e7;
        padding-left: 12px;
        margin-left: 0;
        color: #71717a;
      }
      .dark .ql-editor blockquote { border-left-color: #3f3f46; color: #a1a1aa; }

      /* Tooltip */
      .ql-snow .ql-tooltip {
        background: #fff;
        border-color: #e4e4e7;
        box-shadow: 0 4px 16px rgba(0,0,0,.08);
        border-radius: 8px;
        color: #18181b;
      }
      .dark .ql-snow .ql-tooltip {
        background: #27272a;
        border-color: #3f3f46;
        color: #f4f4f5;
      }
      .ql-snow .ql-tooltip input[type=text] {
        background: #f4f4f5;
        border-color: #e4e4e7;
        border-radius: 6px;
        color: #18181b;
      }
      .dark .ql-snow .ql-tooltip input[type=text] {
        background: #18181b;
        border-color: #3f3f46;
        color: #f4f4f5;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      className="quill-wrapper"
      style={{ "--ql-min-height": `${minHeight}px` } as React.CSSProperties}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={{ toolbar: TOOLBAR_OPTIONS }}
        formats={QUILL_FORMATS}
      />
    </div>
  );
}
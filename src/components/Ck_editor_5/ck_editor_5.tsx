"use client";

import { useEffect, useMemo, useState } from "react";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";

interface CkEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  height?: string;
  placeholder?: string;
}

const LICENSE_KEY = process.env.NEXT_PUBLIC_CK_EDITOR_5!

export default function CkEditor({
  value = "",
  onChange,
  height = "300px",
  placeholder = "Write your content here...",
}: CkEditorProps) {
  const [mounted, setMounted] = useState(false);

  const cloud = useCKEditorCloud({
    version: "48.0.1",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const editorSetup = useMemo(() => {
    if (!mounted || cloud.status !== "success") {
      return null;
    }

    const {
      ClassicEditor,
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Code,
      Subscript,
      Superscript,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Highlight,
      List,
      Link,
      Table,
      TableToolbar,
      Image,
      ImageToolbar,
      ImageUpload,
      BlockQuote,
      Heading,
      Undo,
    } = cloud.CKEditor;

    return {
      ClassicEditor,
      config: {
        licenseKey: LICENSE_KEY,

        placeholder,

        plugins: [
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Code,
          Subscript,
          Superscript,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          Highlight,
          List,
          Link,
          Table,
          TableToolbar,
          Image,
          ImageToolbar,
          ImageUpload,
          BlockQuote,
          Heading,
          Undo,
        ],

        toolbar: {
          shouldNotGroupWhenFull: true,
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "code",
            "|",
            "subscript",
            "superscript",
            "|",
            "highlight",
            "bulletedList",
            "numberedList",
            "|",
            "link",
            "insertTable",
            "blockQuote",
          ],
        },

        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 24, 28, 32],
          supportAllValues: true,
        },

        fontFamily: {
          supportAllValues: true,
        },

        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
          ],
        },
      },
    };
  }, [cloud, mounted, placeholder]);

  if (!editorSetup) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-gray-200 overflow-hidden bg-white">
      <style jsx global>{`
        .ck.ck-editor {
          width: 100%;
        }

        .ck.ck-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 10px !important;
          background: #ffffff !important;
        }

        .ck.ck-editor__main > .ck-editor__editable {
          height: ${height};
          min-height: ${height};
          max-height: ${height};
          overflow-y: auto !important;
          border: none !important;
          padding: 20px !important;
          box-shadow: none !important;
          font-size: 16px;
          line-height: 1.7;
        }

        .ck.ck-editor__editable:focus {
          box-shadow: none !important;
          outline: none !important;
        }

        .ck.ck-content {
          font-family: inherit;
        }
      `}</style>

      <CKEditor
        editor={editorSetup.ClassicEditor}
        config={{
          ...editorSetup.config,
          initialData: value,
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange?.(data);
        }}
      />
    </div>
  );
}
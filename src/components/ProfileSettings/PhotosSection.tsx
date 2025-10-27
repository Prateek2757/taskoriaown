// components/sections/SocialLinksSection.tsx
"use client";

import React, { useState } from "react";

export default function SocialLinksSection({ data = {}, onSave }: { data?: Record<string,string>; onSave?: (d:any)=>Promise<void> }) {
  const [links, setLinks] = useState<Record<string,string>>(data ?? {});
  const [keyName, setKeyName] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const add = () => {
    if (!keyName || !url) return;
    setLinks((l) => ({ ...l, [keyName]: url }));
    setKeyName("");
    setUrl("");
  };

  const remove = (k: string) => {
    const copy = { ...links };
    delete copy[k];
    setLinks(copy);
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave?.(links);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid gap-2">
        {Object.entries(links).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 border rounded-md p-3 bg-white">
            <div>
              <div className="text-sm font-medium">{k}</div>
              <div className="text-sm text-slate-600">{v}</div>
            </div>
            <button onClick={() => remove(k)} className="text-sm text-red-500">Remove</button>
          </div>
        ))}

        <div className="flex gap-2 mt-2">
          <input placeholder="Label e.g. LinkedIn" value={keyName} onChange={(e)=>setKeyName(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
          <input placeholder="URL" value={url} onChange={(e)=>setUrl(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
          <button onClick={add} className="rounded-md border px-3 py-2 text-sm">Add</button>
        </div>

        <div className="mt-2">
          <button onClick={save} disabled={saving} className="rounded-md bg-amber-500 px-3 py-2 text-sm text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save links"}
          </button>
        </div>
      </div>
    </div>
  );
}

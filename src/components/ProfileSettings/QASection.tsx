// components/sections/QASection.tsx
"use client";

import React, { useState } from "react";

export default function QASection({ data = [], onSave }: { data?: {q:string,a:string}[]; onSave?: (d:any)=>Promise<void> }) {
  const [items, setItems] = useState(data ?? []);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [saving, setSaving] = useState(false);

  const add = () => {
    if (!q || !a) return;
    setItems((s) => [...s, { q, a }]);
    setQ("");
    setA("");
  };

  const remove = (i:number) => setItems(s => s.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try { await onSave?.(items); } finally { setSaving(false); }
  };

  return (
    <div>
      {items.map((it, i) => (
        <div key={i} className="border rounded-md p-3 bg-white mb-2">
          <div className="text-sm font-medium">{it.q}</div>
          <div className="text-sm text-slate-600 mt-1">{it.a}</div>
          <div className="mt-2">
            <button onClick={() => remove(i)} className="text-sm text-red-500">Remove</button>
          </div>
        </div>
      ))}

      <div className="grid gap-2 mt-2">
        <input placeholder="Question" value={q} onChange={(e)=>setQ(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
        <input placeholder="Answer" value={a} onChange={(e)=>setA(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <button onClick={add} className="rounded-md border px-3 py-2 text-sm">Add Q&A</button>
          <button onClick={save} disabled={saving} className="rounded-md bg-amber-500 px-3 py-2 text-sm text-white disabled:opacity-60">{saving ? "Saving…" : "Save Q&A"}</button>
        </div>
      </div>
    </div>
  );
}

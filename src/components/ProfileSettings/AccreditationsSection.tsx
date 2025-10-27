// components/sections/AccreditationsSection.tsx
"use client";

import React, { useState } from "react";

export default function AccreditationsSection({ data = [], onSave }: { data?: any[]; onSave?: (d:any)=>Promise<void> }) {
  const [items, setItems] = useState<any[]>(data ?? []);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [saving, setSaving] = useState(false);

  const add = () => {
    if (!name) return;
    setItems((s) => [...s, { name, issuer }]);
    setName("");
    setIssuer("");
  };

  const remove = (i:number) => setItems((s) => s.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      await onSave?.(items);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {items.map((it, i) => (
        <div key={i} className="p-3 border rounded-md mb-2 bg-white">
          <div className="text-sm font-medium">{it.name}</div>
          <div className="text-xs text-slate-500">{it.issuer}</div>
        </div>
      ))}

      <div className="mt-2 grid gap-2">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Accreditation name" className="rounded-md border px-3 py-2 text-sm" />
        <input value={issuer} onChange={(e)=>setIssuer(e.target.value)} placeholder="Issuer" className="rounded-md border px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <button onClick={add} className="rounded-md border px-3 py-2 text-sm">Add</button>
          <button onClick={save} disabled={saving} className="rounded-md bg-amber-500 px-3 py-2 text-sm text-white disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

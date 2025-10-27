// components/sections/ServicesSection.tsx
"use client";

import React, { useState } from "react";

export default function ServicesSection({ data = [], onSave }: { data?: any[]; onSave?: (d: any) => Promise<void> }) {
  const [services, setServices] = useState(data ?? []);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const add = () => {
    if (!newTitle.trim()) return;
    setServices((s) => [...s, { title: newTitle, description: newDesc }]);
    setNewTitle("");
    setNewDesc("");
  };

  const remove = (index: number) => {
    setServices((s) => s.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave?.(services);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="space-y-2">
        {services.map((s, i) => (
          <div key={i} className="flex items-start justify-between gap-3 border rounded-md p-3 bg-white">
            <div>
              <div className="font-medium text-sm">{s.title}</div>
              <div className="text-sm text-slate-600">{s.description}</div>
            </div>
            <button
              onClick={() => remove(i)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mt-2 grid gap-2">
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Service title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Short description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={add} className="rounded-md border px-3 py-2 text-sm">Add</button>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-amber-500 px-3 py-2 text-sm text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save services"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

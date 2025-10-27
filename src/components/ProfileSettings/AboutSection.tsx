
"use client";

import React, { useState } from "react";

type Props = {
  data?: { name?: string; bio?: string; avatarUrl?: string } | null;
  onSave?: (payload: any) => Promise<void>;
};

export default function AboutSection({ data, onSave }: Props) {
  const [name, setName] = useState(data?.name ?? "");
  const [bio, setBio] = useState(data?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(data?.avatarUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await onSave?.({ name, bio, avatarUrl });
      setMsg("Saved");
    } catch (err) {
      setMsg("Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 2500);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Profile photo URL</label>
        <input
          className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
        />
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="avatar preview"
            className="mt-2 h-20 w-20 rounded-full object-cover border"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">About / Bio</label>
        <textarea
          rows={4}
          className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short description of your skills and experience"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>

        <span className="text-sm text-slate-600">{msg}</span>
      </div>
    </div>
  );
}

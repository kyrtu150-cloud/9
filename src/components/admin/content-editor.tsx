"use client";

import { useState } from "react";
import { Save, Check, ChevronDown } from "lucide-react";

type Group = { title: string; keys: string[] };

export function AdminContentEditor({
  groups,
  initial,
}: {
  groups: Group[];
  initial: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(groups[0]?.title ?? null);

  async function saveKey(key: string) {
    setSaving(key);
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key, value: values[key] ?? "" }),
      });
      setSaved(key);
      setTimeout(() => setSaved((s) => (s === key ? null : s)), 1500);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isOpen = openGroup === group.title;
        return (
          <div key={group.title} className="glass-card overflow-hidden">
            <button
              onClick={() => setOpenGroup(isOpen ? null : group.title)}
              className="w-full flex items-center justify-between px-6 py-4"
            >
              <span className="font-display uppercase text-lg text-white">{group.title}</span>
              <ChevronDown className={`h-5 w-5 text-accent transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 space-y-4 border-t border-white/10 pt-4">
                {group.keys.map((key) => {
                  const isLong = (values[key]?.length ?? 0) > 80 || key.includes("tagline") || key.includes("subtitle") || key.includes("text") || key.includes("legal") || key.includes("banner");
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-white/45">{key}</label>
                        <button
                          onClick={() => saveKey(key)}
                          disabled={saving === key}
                          className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover disabled:opacity-50"
                        >
                          {saved === key ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Сохранено
                            </>
                          ) : (
                            <>
                              <Save className="h-3.5 w-3.5" /> {saving === key ? "Сохраняю..." : "Сохранить"}
                            </>
                          )}
                        </button>
                      </div>
                      {isLong ? (
                        <textarea
                          value={values[key] ?? ""}
                          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                          rows={3}
                          className="w-full rounded-xl border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] transition-colors outline-none px-4 py-2.5 text-white text-sm resize-none"
                        />
                      ) : (
                        <input
                          value={values[key] ?? ""}
                          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                          className="w-full rounded-pill border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] transition-colors outline-none px-4 py-2.5 text-white text-sm"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

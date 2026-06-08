import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_app/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — KOSMO" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, username, bio")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name ?? "");
          setUsername(data.username ?? "");
          setBio(data.bio ?? "");
        }
      });
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, username, bio, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setBusy(false);
    setMsg(error ? error.message : "Saved.");
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={save} className="glass-panel rounded-2xl p-6 space-y-5">
        <Field label="Email">
          <input value={user?.email ?? ""} disabled className="input opacity-60" />
        </Field>
        <Field label="Full name">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
        </Field>
        <Field label="Username">
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="input" />
        </Field>
        <Field label="Bio">
          <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="input" />
        </Field>
        {msg && <div className="text-sm text-muted-foreground">{msg}</div>}
        <button
          disabled={busy}
          className="px-5 py-2.5 rounded-xl text-primary-foreground glow-ring"
          style={{ background: "var(--gradient-primary)" }}
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>
      <style>{`
        .input {
          width: 100%;
          background: color-mix(in oklab, var(--surface) 80%, transparent);
          border: 1px solid color-mix(in oklab, white 8%, transparent);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: var(--foreground);
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

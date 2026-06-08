import { createFileRoute, Link, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import logoAsset from "@/assets/kosmo-logo.png.asset.json";

const searchSchema = z.object({
  redirect: fallback(z.string(), "/dashboard").default("/dashboard"),
});

export const Route = createFileRoute("/login")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Login — KOSMO" }] }),
  component: LoginPage,
});

type FormVals = { email: string; password: string };

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = useSearch({ from: "/login" });
  const { user, loading } = useAuth();
  const [err, setErr] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormVals>();

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: (redirectTo as string) || "/dashboard" });
    }
  }, [loading, user, navigate, redirectTo]);

  const onSubmit = async (vals: FormVals) => {
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword(vals);
    if (error) return setErr(error.message);
    void navigate({ to: (redirectTo as string) || "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
         style={{ backgroundImage: "var(--gradient-hero)" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8"
      >
        <Link to="/" className="flex justify-center mb-6">
          <img src={logoAsset.url} alt="KOSMO" className="h-8" />
        </Link>
        <h1 className="text-2xl font-bold text-center">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground text-center">
          Sign in to your KOSMO account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Field label="Email">
            <input
              type="email"
              {...register("email", { required: true })}
              className="input-field"
              placeholder="you@kosmo.app"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input-field"
              placeholder="••••••••"
            />
          </Field>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center px-5 py-3 rounded-xl font-medium text-primary-foreground glow-ring hover:brightness-110 transition disabled:opacity-60"
            style={{ background: "var(--gradient-primary)" }}
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

// Prevent unused import warning
export { redirect };

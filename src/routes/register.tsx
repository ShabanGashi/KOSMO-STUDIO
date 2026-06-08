import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import logoAsset from "@/assets/kosmo-logo.png";

const searchSchema = z.object({
  redirect: fallback(z.string(), "/dashboard").default("/dashboard"),
});

export const Route = createFileRoute("/register")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Create account — KOSMO" }] }),
  component: RegisterPage,
});

type FormVals = { email: string; password: string; username: string; full_name: string };

function RegisterPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { redirect: redirectTo } = useSearch({ from: "/register" });
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormVals>();

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: redirectTo });
    }
  }, [loading, user, navigate, redirectTo]);

  const onSubmit = async (vals: FormVals) => {
    setErr(null); setInfo(null);
    const { data, error } = await supabase.auth.signUp({
      email: vals.email,
      password: vals.password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { username: vals.username, full_name: vals.full_name },
      },
    });
    if (error) return setErr(error.message);
    if (data.session) {
      void navigate({ to: redirectTo });
    } else {
      setInfo("Check your email to confirm your account.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
         style={{ backgroundImage: "var(--gradient-hero)" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8"
      >
        <Link to="/" className="flex justify-center mb-6">
          <img src={logoAsset} alt="KOSMO" className="h-8" />
        </Link>
        <h1 className="text-2xl font-bold text-center">Join KOSMO</h1>
        <p className="mt-1 text-sm text-muted-foreground text-center">
          Create your creator account in seconds
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name">
              <input
                {...register("full_name", { required: true })}
                className="input-field"
                placeholder="Drin K."
              />
            </Field>
            <Field label="Username">
              <input
                {...register("username", { required: true, minLength: 3 })}
                className="input-field"
                placeholder="drin"
              />
            </Field>
          </div>
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
              placeholder="At least 6 characters"
            />
          </Field>

          {err && <p className="text-sm text-destructive">{err}</p>}
          {info && <p className="text-sm text-primary">{info}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center px-5 py-3 rounded-xl font-medium text-primary-foreground glow-ring hover:brightness-110 transition disabled:opacity-60"
            style={{ background: "var(--gradient-primary)" }}
          >
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
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

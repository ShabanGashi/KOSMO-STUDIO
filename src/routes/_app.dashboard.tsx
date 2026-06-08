import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Upload, DollarSign, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — KOSMO" }] }),
  component: Dashboard,
});

const stats = [
  { label: "Total Downloads", value: "25,432", icon: Download },
  { label: "Uploaded Assets", value: "120", icon: Upload },
  { label: "Revenue", value: "$12,500", icon: DollarSign },
  { label: "Favorites", value: "1,200", icon: Heart },
];

function Dashboard() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string) || "Creator";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold"
          >
            Welcome back to KOSMO
          </motion.h1>
          <p className="mt-2 text-muted-foreground">
            Hi {name} — manage your assets, uploads and marketplace performance.
          </p>
        </div>
        <Link
          to="/dashboard/upload"
          className="inline-flex px-5 py-3 rounded-xl font-medium text-primary-foreground glow-ring hover:brightness-110 transition"
          style={{ background: "var(--gradient-primary)" }}
        >
          Upload New Asset
        </Link>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-2xl p-5"
            >
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                {s.label}
                <s.icon className="h-4 w-4" />
              </div>
              <div className="mt-2 text-3xl font-bold tracking-tight">{s.value}</div>
              <Sparkline />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Recent Uploads">
          <p className="text-sm text-muted-foreground">
            Your uploaded assets will appear here. Use the Upload page to publish new work.
          </p>
        </Card>
        <Card title="Trending Marketplace">
          <p className="text-sm text-muted-foreground">
            Most popular assets from the KOSMO community this week.
          </p>
        </Card>
      </div>

      <Outlet />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 100 28" className="mt-3 w-full h-7">
      <defs>
        <linearGradient id="sl" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.16 220)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="oklch(0.78 0.16 220)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0 22 L12 18 L24 20 L36 12 L48 16 L60 8 L72 14 L84 6 L100 10"
        fill="none"
        stroke="url(#sl)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

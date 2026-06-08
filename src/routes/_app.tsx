import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Upload,
  Package,
  BarChart3,
  Settings,
  Home,
  Heart,
  LayoutGrid,
  CreditCard,
  DollarSign,
} from "lucide-react";
import logoAsset from "@/assets/kosmo-logo.png.asset.json";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/marketplace", label: "Marketplace", icon: LayoutGrid },
  { to: "/dashboard/upload", label: "Upload Asset", icon: Upload },
  { to: "/dashboard/my-products", label: "My Products", icon: Package },
  { to: "/dashboard/purchases", label: "Purchases", icon: CreditCard },
  { to: "/dashboard/earnings", label: "Earnings", icon: DollarSign },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, divider: true },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;


function AppLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && router.state.location.pathname.startsWith("/dashboard")) {
      void router.navigate({ to: "/login", search: { redirect: router.state.location.pathname } });
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-white/5 p-5"
             style={{ background: "color-mix(in oklab, var(--surface) 70%, transparent)" }}>
        <Link to="/" className="mb-8 flex items-center">
          <img src={logoAsset.url} alt="KOSMO" className="h-8 w-auto" />
        </Link>
        <nav className="space-y-1 text-sm">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.to}>
                {"divider" in item && item.divider && (
                  <div className="my-3 border-t border-white/5" />
                )}
                <Link
                  to={item.to}
                  activeProps={{ className: "bg-primary/15 text-primary border border-primary/30" }}
                  inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent" }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur"
                style={{ background: "color-mix(in oklab, var(--background) 70%, transparent)" }}>
          <div className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span>
            <span className="text-foreground">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-full border border-white/10"
              style={{ background: "conic-gradient(from 220deg, oklch(0.78 0.16 220), oklch(0.5 0.18 290), oklch(0.78 0.16 220))" }}
            />
            <div className="hidden sm:block text-sm">
              <div className="font-semibold leading-none">
                {user ? ((user.user_metadata?.full_name as string) || "Creator") : "Creator"}
              </div>
              <div className="text-xs text-muted-foreground">{user?.email ?? ""}</div>
            </div>
          </div>
        </header>

        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}

// keep unused-import safe
export { redirect };

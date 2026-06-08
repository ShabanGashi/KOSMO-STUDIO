import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/kosmo-logo.png.asset.json";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/categories", label: "Categories" },
  { to: "/pricing", label: "Pricing" },
  { to: "/become-creator", label: "Become a Creator" },
] as const;

export function Navbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 mt-4">
        <div className="glass-panel rounded-2xl flex items-center justify-between px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoAsset.url} alt="KOSMO" className="h-7 w-auto transition-transform group-hover:scale-105" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard/upload"
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                Upload Asset
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition"
                >
                  <div
                    className="h-7 w-7 rounded-full border border-white/10"
                    style={{ background: "conic-gradient(from 220deg, oklch(0.78 0.16 220), oklch(0.5 0.18 290), oklch(0.78 0.16 220))" }}
                  />
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {(user.user_metadata?.username as string) || user.email}
                  </span>
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl p-1 text-sm">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
                    >
                      <User className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={async () => { setOpen(false); await signOut(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm rounded-xl text-foreground/90 hover:bg-white/5 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex px-4 py-2 text-sm font-medium rounded-xl text-primary-foreground glow-ring hover:brightness-110 transition"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

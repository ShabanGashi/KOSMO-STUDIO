import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Heart } from "lucide-react";

const assets = [
  { tag: "React Dashboard", title: "Astro UI React Dashboard", price: "$49", dl: 10, badge: "Exact Replicant" },
  { tag: "Website Template", title: "Creative Studio Portfolio", price: "$35", dl: 8 },
  { tag: "UI Kit", title: "Fintech UI Design Kit", price: "$79", dl: 14 },
  { tag: "Stock Photography", title: "Urban Creative Pack", price: "$15", dl: 6 },
  { tag: "Football Poster", title: "European Stars Poster", price: "$10", dl: 3 },
  { tag: "Football Poster Pack", title: "European Stars Collection", price: "$19", dl: 4 },
  { tag: "Social Media Pack", title: "SaaS Marketing Visuals", price: "$29", dl: 11 },
  { tag: "Creative Branding", title: "Agency Branding Bundle", price: "$55", dl: 9 },
];

const gradients = [
  "linear-gradient(135deg, oklch(0.32 0.08 250), oklch(0.22 0.05 240))",
  "linear-gradient(135deg, oklch(0.30 0.12 280), oklch(0.20 0.06 260))",
  "linear-gradient(135deg, oklch(0.30 0.10 220), oklch(0.20 0.05 235))",
  "linear-gradient(135deg, oklch(0.28 0.08 200), oklch(0.18 0.04 230))",
];

const MotionLink = motion(Link);

export function Trending() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="flex items-end justify-between mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">Trending Assets</h2>
        <Link to="/marketplace" className="text-sm text-primary hover:underline">Browse all</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {assets.map((a, i) => (
          <MotionLink
            key={a.title + i}
            to="/marketplace"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-2xl overflow-hidden group"
          >
            <div
              className="aspect-[4/3] relative"
              style={{ background: gradients[i % gradients.length] }}
            >
              <div className="absolute inset-0 opacity-40"
                style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 30%, transparent), transparent)" }} />
              {a.badge && (
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-primary/20 text-primary border border-primary/30">
                  {a.badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground">{a.tag}</div>
              <div className="mt-1 font-semibold truncate">{a.title}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-primary font-semibold">{a.price}</span>
                <span className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" />{a.dl}</span>
                  <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{Math.round(a.dl * 1.5)}</span>
                </span>
              </div>
            </div>
          </MotionLink>
        ))}
      </div>
    </section>
  );
}

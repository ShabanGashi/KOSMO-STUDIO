import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutTemplate,
  Atom,
  Layers,
  Brush,
  Camera,
  Share2,
  Smartphone,
  Type,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ALL_ASSETS, CATEGORIES } from "@/lib/mock-assets";

const ICONS: Record<string, typeof LayoutTemplate> = {
  "web-templates": LayoutTemplate,
  "react-templates": Atom,
  "ui-kits": Layers,
  graphics: Brush,
  "stock-photos": Camera,
  "social-packs": Share2,
  mockups: Smartphone,
  "icons-fonts": Type,
};

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — KOSMO" },
      { name: "description", content: "Browse KOSMO categories: web templates, UI kits, graphics, mockups, photos, and more." },
      { property: "og:title", content: "Categories — KOSMO" },
      { property: "og:description", content: "Every premium category on KOSMO in one place." },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Categories</h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Explore every corner of the KOSMO universe.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((c, i) => {
              const Icon = ICONS[c.slug] ?? LayoutTemplate;
              const count = ALL_ASSETS.filter((a) => a.categorySlug === c.slug).length;
              return (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to="/marketplace"
                    search={{ q: "", category: c.slug, sort: "trending" }}
                    className="block glass-panel rounded-2xl p-6 group hover:glow-ring transition"
                  >
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-primary/15 border border-primary/25 mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {count} assets
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

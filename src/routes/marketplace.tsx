import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DbAssetCard } from "@/components/marketplace/DbAssetCard";
import { CATEGORIES } from "@/lib/mock-assets";
import { listAllProducts, type DbProduct } from "@/lib/products";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "all").default("all"),
  sort: fallback(z.enum(["trending", "newest", "price-asc", "price-desc"]), "trending").default("trending"),
});

export const Route = createFileRoute("/marketplace")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Marketplace — KOSMO" },
      { name: "description", content: "Browse premium templates, UI kits, photos, graphics and more on KOSMO." },
      { property: "og:title", content: "Marketplace — KOSMO" },
      { property: "og:description", content: "Premium digital assets for designers and developers." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const { q, category, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/marketplace" });
  const [items, setItems] = useState<DbProduct[] | null>(null);

  useEffect(() => {
    listAllProducts().then(setItems).catch(() => setItems([]));
  }, []);

  const all = items ?? [];
  const filtered = all
    .filter((a) => {
      if (category !== "all" && a.category_slug !== category) return false;
      if (q && !a.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      if (sort === "newest") return b.created_at.localeCompare(a.created_at);
      return (b.downloads ?? 0) - (a.downloads ?? 0);
    });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Marketplace</h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Discover premium digital assets from creators across the cosmos.
            </p>
          </motion.div>

          <div className="mt-8 glass-panel rounded-2xl p-3 flex flex-col md:flex-row gap-3">
            <div className="flex items-center flex-1 gap-2 px-4 rounded-3xl bg-white/5 border border-white/10 shadow-sm shadow-white/10">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => navigate({ search: { q: e.target.value, category, sort } })}
                placeholder="Search templates, photos, assets…"
                className="bg-transparent outline-none text-sm flex-1 py-3 placeholder:text-muted-foreground transition"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => navigate({ search: { q, category, sort: e.target.value as typeof sort } })}
                className="input-field min-w-[180px] text-sm"
              >
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            <CategoryChip label="All" active={category === "all"} onClick={() => navigate({ search: { q, category: "all", sort } })} />
            {CATEGORIES.map((c) => (
              <CategoryChip
                key={c.slug}
                label={c.name}
                active={category === c.slug}
                onClick={() => navigate({ search: { q, category: c.slug, sort } })}
              />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((a, i) => (
              <DbAssetCard key={a.id} product={a} index={i} />
            ))}
          </div>

          {items === null && (
            <div className="mt-16 text-center text-muted-foreground">Loading marketplace…</div>
          )}
          {items !== null && filtered.length === 0 && (
            <div className="mt-16 text-center text-muted-foreground">
              No assets yet. Be the first to <Link to="/dashboard/upload" className="text-primary hover:underline">upload one</Link>.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-xl text-sm border transition ${
        active
          ? "bg-primary/15 border-primary/40 text-primary"
          : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

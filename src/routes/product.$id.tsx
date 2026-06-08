import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Shield, Zap, CheckCircle2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { supabase } from "@/lib/supabase";
import { getSignedDownload, type DbProduct } from "@/lib/products";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/product/$id")({
  head: () => ({ meta: [{ title: "Product — KOSMO" }] }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-muted-foreground">Asset not found.</p>
      <Link to="/marketplace" className="text-primary hover:underline">
        Back to marketplace
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<DbProduct | null | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setAsset((data as DbProduct) ?? null));
  }, [id]);

  async function onDownload() {
    if (!user) return navigate({ to: "/login" });
    if (!asset?.file_url) return;
    setDownloading(true);
    setMsg(null);
    try {
      const url = await getSignedDownload(asset.file_url);
      window.open(url, "_blank");
      await supabase
        .from("products")
        .update({ downloads: (asset.downloads ?? 0) + 1 })
        .eq("id", asset.id);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  if (asset === undefined) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-20 text-center text-muted-foreground">Loading…</main>
      </div>
    );
  }
  if (asset === null) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-20 text-center text-muted-foreground">
          Asset not found. <Link to="/marketplace" className="text-primary">Back to marketplace</Link>
        </main>
      </div>
    );
  }

  const hue = (parseInt(asset.id.replace(/\D/g, "").slice(0, 4) || "0", 10) * 37) % 360;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-7xl px-6">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Link>

          <div className="mt-6 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="aspect-[16/10] rounded-3xl glass-panel relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, oklch(0.32 0.13 ${hue}), oklch(0.18 0.05 ${(hue + 40) % 360}))`,
                }}
              >
                {asset.preview_image && (
                  <img src={asset.preview_image} alt={asset.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel rounded-3xl p-6 h-fit sticky top-28"
            >
              <div className="text-xs text-primary uppercase tracking-wider">{asset.category_slug}</div>
              <h1 className="mt-2 text-3xl font-bold leading-tight">{asset.title}</h1>
              {asset.version && <div className="mt-2 text-sm text-muted-foreground">Version {asset.version}</div>}

              <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {asset.downloads} downloads
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gradient">${Number(asset.price).toFixed(0)}</span>
                <span className="text-xs text-muted-foreground">one-time</span>
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  onClick={onDownload}
                  disabled={downloading || !asset.file_url}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-primary-foreground glow-ring hover:brightness-110 transition disabled:opacity-60"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {downloading ? "Preparing…" : user ? "Download" : "Sign in to download"}
                </button>
                <FavoriteButton productId={asset.id} />
                {msg && <div className="text-xs text-muted-foreground">{msg}</div>}
              </div>

              <ul className="mt-6 space-y-2 text-sm text-muted-foreground pt-5 border-t border-white/10">
                <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Commercial license included</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Instant signed download</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Lifetime updates</li>
              </ul>
            </motion.aside>
          </div>

          <div className="mt-12 glass-panel rounded-3xl p-7">
            <h2 className="text-xl font-semibold">About this asset</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {asset.description || "No description provided."}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

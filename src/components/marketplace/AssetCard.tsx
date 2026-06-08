import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Heart, Star } from "lucide-react";
import type { Asset } from "@/lib/mock-assets";

export function AssetCard({ asset, index = 0 }: { asset: Asset; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.04 }}
      whileHover={{ y: -6 }}
    >
      <Link
        to="/product/$id"
        params={{ id: asset.id }}
        className="block glass-panel rounded-2xl overflow-hidden group hover:glow-ring transition"
      >
        <div
          className="aspect-[4/3] relative"
          style={{
            background: `linear-gradient(135deg, oklch(0.30 0.12 ${asset.hue}), oklch(0.18 0.05 ${(asset.hue + 30) % 360}))`,
          }}
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 25%, transparent), transparent)",
            }}
          />
          {asset.tag && (
            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-primary/20 text-primary border border-primary/30">
              {asset.tag}
            </span>
          )}
          <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-md bg-black/40 border border-white/10 backdrop-blur">
            ${asset.price}
          </span>
        </div>
        <div className="p-4">
          <div className="text-xs text-muted-foreground">{asset.category}</div>
          <div className="mt-1 font-semibold truncate group-hover:text-primary transition">
            {asset.title}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">{asset.creator}</span>
            <span className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-primary" />
                {asset.rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {asset.downloads}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {asset.likes}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

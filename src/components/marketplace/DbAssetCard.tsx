import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Heart } from "lucide-react";
import type { DbProduct } from "@/lib/products";

export function DbAssetCard({ product, index = 0 }: { product: DbProduct; index?: number }) {
  const hue = (parseInt(product.id.replace(/\D/g, "").slice(0, 4) || "0", 10) * 37) % 360;
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
        params={{ id: product.id }}
        className="block glass-panel rounded-2xl overflow-hidden group hover:glow-ring transition"
      >
        <div
          className="aspect-[4/3] relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, oklch(0.30 0.12 ${hue}), oklch(0.18 0.05 ${(hue + 30) % 360}))`,
          }}
        >
          {(product.thumbnail_url || product.preview_image) && (
            <img
              src={product.thumbnail_url ?? product.preview_image ?? ""}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
          <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-md bg-black/40 border border-white/10 backdrop-blur">
            ${Number(product.price).toFixed(0)}
          </span>
        </div>
        <div className="p-4">
          <div className="text-xs text-muted-foreground">{product.category_slug ?? "Asset"}</div>
          <div className="mt-1 font-semibold truncate group-hover:text-primary transition">
            {product.title}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {product.downloads}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {product.likes}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

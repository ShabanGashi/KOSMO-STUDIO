import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

const creators = [
  { name: "Narumd Saoner", followers: "23.1K", featured: false },
  { name: "Youth Allean", followers: "17.5K", featured: true },
  { name: "Licatoral Bopnaton", followers: "12.3K", featured: false },
  { name: "Clarebn Reyn", followers: "9.4K" },
  { name: "Kanattar Kexos", followers: "8.7K" },
  { name: "Cloelia Lisa", followers: "7.2K" },
];

export function Creators() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Featured Creators</h2>
        <p className="mt-2 text-sm text-muted-foreground">Premium creator ecosystem</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {creators.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            whileHover={{ y: -4 }}
            className="glass-panel rounded-2xl p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-full border border-white/10"
                style={{
                  background: `conic-gradient(from 220deg, oklch(0.78 0.16 220), oklch(0.5 0.18 290), oklch(0.78 0.16 220))`,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold truncate">{c.name}</span>
                  {c.featured && <BadgeCheck className="h-4 w-4 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground">{c.followers} followers</div>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-primary/15 text-primary border border-primary/25">
                Featured
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((k) => (
                <div
                  key={k}
                  className="aspect-square rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.30 0.10 ${200 + k * 25}), oklch(0.20 0.05 250))`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

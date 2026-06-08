import { motion } from "framer-motion";
import { Package, Users, Download, LayoutGrid } from "lucide-react";

const stats = [
  { icon: Package, value: "50K+", label: "Assets" },
  { icon: Users, value: "12K+", label: "Creators" },
  { icon: Download, value: "1M+", label: "Downloads" },
  { icon: LayoutGrid, value: "100+", label: "Categories" },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 -mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:glow-ring transition"
          >
            <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

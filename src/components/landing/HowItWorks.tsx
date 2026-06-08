import { motion } from "framer-motion";
import { Search, ShoppingCart, Rocket } from "lucide-react";

const steps = [
  { icon: Search, n: "Step 1", title: "Browse premium digital assets" },
  { icon: ShoppingCart, n: "Step 2", title: "Purchase or download resources" },
  { icon: Rocket, n: "Step 3", title: "Use them in your projects" },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-panel rounded-2xl p-8 text-center"
          >
            <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center bg-primary/15 border border-primary/25 mb-5">
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="text-xs uppercase tracking-wider text-primary">{s.n}</div>
            <div className="mt-1 font-semibold">{s.title}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

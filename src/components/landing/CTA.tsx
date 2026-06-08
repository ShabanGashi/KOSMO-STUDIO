import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl glass-panel p-12 md:p-16 text-center"
      >
        <div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-[120%] rounded-[50%] opacity-60 blur-3xl"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 40%, transparent), transparent)" }}
        />
        <h2 className="text-4xl md:text-5xl font-bold text-gradient">
          Turn your creativity
          <br /> into income.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Upload your work, grow your audience, and start earning through KOSMO.
        </p>
        <a
          href="/register"
          className="relative mt-8 inline-flex px-6 py-3 rounded-xl font-medium text-primary-foreground glow-ring hover:brightness-110 transition"
          style={{ background: "var(--gradient-primary)" }}
        >
          Start Selling on KOSMO
        </a>
      </motion.div>
    </section>
  );
}

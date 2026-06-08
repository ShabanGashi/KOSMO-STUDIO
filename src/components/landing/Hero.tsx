import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-cosmos.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
} as const;

export function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-36 pb-24"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Kosovo's first premium digital marketplace
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold text-gradient leading-[1.05]"
          >
            Discover & Sell
            <br />
            Premium Digital
            <br />
            Assets
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-lg text-base text-muted-foreground"
          >
            Templates, UI kits, photos, graphics and creative resources built
            for designers and developers.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/marketplace"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-primary-foreground glow-ring hover:brightness-110 transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              Explore Marketplace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/become-creator"
              className="inline-flex items-center px-5 py-3 rounded-xl font-medium glass-panel hover:bg-white/5 transition"
            >
              Become a Creator
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-10 -z-10 rounded-full opacity-60 blur-3xl animate-pulse-glow"
               style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 35%, transparent), transparent)" }} />
          <div className="relative rounded-3xl overflow-hidden glass-panel">
            <img
              src={heroImg}
              alt="Floating dashboards and UI mockups in cosmic space"
              className="w-full h-auto animate-float"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
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

const items = [
  { icon: LayoutTemplate, title: "Web Templates", desc: "Sleek modern web templates." },
  { icon: Atom, title: "React Templates", desc: "Modern React starter kits." },
  { icon: Layers, title: "UI Kits", desc: "Design systems, layers & posters." },
  { icon: Brush, title: "Graphics & Posters", desc: "Print, editorial & branding." },
  { icon: Camera, title: "Stock Photos", desc: "Photos, videos & stock packs." },
  { icon: Share2, title: "Social Media Packs", desc: "Templates ready to post." },
  { icon: Smartphone, title: "Mockups", desc: "Device & scene mockups." },
  { icon: Type, title: "Icons & Fonts", desc: "Pixel-perfect icons & type." },
];

const MotionLink = motion(Link);

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">Categories</h2>
        <Link to="/categories" className="text-sm text-primary hover:underline">View all</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((c, i) => (
          <MotionLink
            key={c.title}
            to="/marketplace"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass-panel rounded-2xl p-6 group hover:glow-ring transition"
          >
            <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 mb-4 group-hover:bg-primary/15">
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="font-semibold">{c.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
          </MotionLink>
        ))}
      </div>
    </section>
  );
}

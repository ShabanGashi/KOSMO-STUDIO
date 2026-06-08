import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/kosmo-logo.png.asset.json";

const cols = [
  {
    title: "About",
    links: [
      { label: "About KOSMO", href: "/about" },
      { label: "Premium digital marketplace", href: "/pricing" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { label: "Home", href: "/marketplace" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Browse", href: "/marketplace" },
      { label: "Categories", href: "/categories" },
      { label: "Pricing", href: "/pricing" },
      { label: "Templates", href: "/marketplace" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Support", href: "/support" },
      { label: "Contact us", href: "/contact" },
      { label: "Roomunity", href: "/roomunity" },
    ],
  },
  {
    title: "Terms",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/40">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-sm">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-foreground font-semibold mb-3">{c.title}</div>
              <ul className="space-y-2 text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="hover:text-foreground transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="KOSMO" className="h-5 w-auto" />
            <span>Premium dark footer</span>
          </div>
          <span>© KOSMO · 2026</span>
        </div>
      </div>
    </footer>
  );
}

import logoAsset from "@/assets/kosmo-logo.png.asset.json";

const cols = [
  { title: "About", links: ["About KOSMO", "Premium digital marketplace"] },
  { title: "Marketplace", links: ["Home", "About", "Blog", "Contact"] },
  { title: "Categories", links: ["Browse", "Categories", "Pricing", "Templates"] },
  { title: "Support", links: ["Support", "Contact us", "Roomunity"] },
  { title: "Terms", links: ["Privacy", "Terms", "Cookies"] },
  { title: "Contact", links: ["Privacy", "Contact"] },
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
                  <li key={l}><a href="#" className="hover:text-foreground transition">{l}</a></li>
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

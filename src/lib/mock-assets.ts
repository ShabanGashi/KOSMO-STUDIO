export type Asset = {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  creator: string;
  price: number;
  downloads: number;
  likes: number;
  rating: number;
  tag?: string;
  hue: number;
};

const categories = [
  { slug: "web-templates", name: "Web Templates" },
  { slug: "react-templates", name: "React Templates" },
  { slug: "ui-kits", name: "UI Kits" },
  { slug: "graphics", name: "Graphics & Posters" },
  { slug: "stock-photos", name: "Stock Photos" },
  { slug: "social-packs", name: "Social Media Packs" },
  { slug: "mockups", name: "Mockups" },
  { slug: "icons-fonts", name: "Icons & Fonts" },
] as const;

const titles = [
  "Astro UI React Dashboard",
  "Creative Studio Portfolio",
  "Fintech UI Design Kit",
  "Urban Creative Pack",
  "European Stars Poster",
  "Modern Mobile UI",
  "SaaS Marketing Visuals",
  "Agency Branding Bundle",
  "Nova Icon Set",
  "Isometric 3D Pack",
  "Framer Motion Kit",
  "Sleek SaaS UI Kit",
  "Nordic Photo Pack",
  "Crypto Dashboard Pro",
  "Editorial Magazine Kit",
  "E-commerce Starter",
  "Portfolio Glass Kit",
  "Aurora Gradient Pack",
  "Pixel Perfect Icons",
  "Neon Display Font",
];

const creators = [
  "Drin Krasniqi",
  "Elara Vance",
  "Yll Beqiri",
  "Sara Ahmeti",
  "Modern Athlete",
  "Creator Studio",
  "Inspired by Envato",
  "Inspired by Framer",
];

export const ALL_ASSETS: Asset[] = Array.from({ length: 24 }).map((_, i) => {
  const cat = categories[i % categories.length];
  return {
    id: `asset-${i + 1}`,
    title: titles[i % titles.length],
    category: cat.name,
    categorySlug: cat.slug,
    creator: creators[i % creators.length],
    price: [10, 15, 19, 29, 35, 49, 55, 79][i % 8],
    downloads: 50 + ((i * 37) % 950),
    likes: 5 + ((i * 11) % 200),
    rating: 4 + ((i % 10) / 10),
    tag: i % 5 === 0 ? "Featured" : i % 7 === 0 ? "New" : undefined,
    hue: (200 + i * 17) % 360,
  };
});

export const CATEGORIES = categories;

export function getAsset(id: string) {
  return ALL_ASSETS.find((a) => a.id === id);
}

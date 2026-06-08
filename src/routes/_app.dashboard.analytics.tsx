import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listMyProducts, type DbProduct } from "@/lib/products";

export const Route = createFileRoute("/_app/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — KOSMO" }] }),
  component: Analytics,
});

function Analytics() {
  const { user } = useAuth();
  const [items, setItems] = useState<DbProduct[]>([]);

  useEffect(() => {
    if (!user) return;
    listMyProducts(user.id).then(setItems).catch(() => setItems([]));
  }, [user]);

  const totalDownloads = items.reduce((s, p) => s + (p.downloads ?? 0), 0);
  const totalLikes = items.reduce((s, p) => s + (p.likes ?? 0), 0);
  const revenue = items.reduce((s, p) => s + Number(p.price) * (p.downloads ?? 0), 0);

  const stats = [
    { label: "Assets", value: items.length },
    { label: "Downloads", value: totalDownloads },
    { label: "Likes", value: totalLikes },
    { label: "Est. Revenue", value: `$${revenue.toFixed(0)}` },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel rounded-2xl p-5">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 glass-panel rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Top assets</h2>
        <div className="space-y-3">
          {items
            .slice()
            .sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0))
            .slice(0, 5)
            .map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{p.title}</span>
                <span className="text-muted-foreground">{p.downloads} dl</span>
              </div>
            ))}
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">No data yet — upload an asset.</div>
          )}
        </div>
      </div>
    </div>
  );
}

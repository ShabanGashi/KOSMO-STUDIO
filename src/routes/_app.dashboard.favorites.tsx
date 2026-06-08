import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listMyFavorites, type DbProduct } from "@/lib/products";

export const Route = createFileRoute("/_app/dashboard/favorites")({
  head: () => ({ meta: [{ title: "Favorites — KOSMO" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<DbProduct[] | null>(null);

  useEffect(() => {
    if (!user) return;
    listMyFavorites(user.id).then(setItems).catch(() => setItems([]));
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Favorites</h1>
      {items === null && <div className="text-muted-foreground">Loading…</div>}
      {items?.length === 0 && (
        <div className="glass-panel rounded-2xl p-10 text-center">
          <Heart className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No favorites yet.</p>
          <Link to="/marketplace" className="inline-block mt-3 text-primary hover:underline">
            Explore the marketplace →
          </Link>
        </div>
      )}
      {items && items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <Link
              to="/product/$id"
              params={{ id: p.id }}
              key={p.id}
              className="glass-panel rounded-2xl overflow-hidden hover:scale-[1.01] transition"
            >
              {p.preview_image && (
                <img src={p.preview_image} alt={p.title} className="w-full aspect-video object-cover" />
              )}
              <div className="p-4">
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-muted-foreground">${Number(p.price).toFixed(0)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

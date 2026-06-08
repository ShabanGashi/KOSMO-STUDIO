import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Package, Edit3, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listMyProducts, deleteProduct, type DbProduct } from "@/lib/products";

export const Route = createFileRoute("/_app/dashboard/products")({
  head: () => ({ meta: [{ title: "Products — KOSMO" }] }),
  component: Products,
});

export function Products() {
  const { user } = useAuth();
  const [items, setItems] = useState<DbProduct[] | null>(null);

  useEffect(() => {
    if (!user) return;
    listMyProducts(user.id).then(setItems).catch(() => setItems([]));
  }, [user]);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(productId: string) {
    if (!user) return;
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setItems((current) => current?.filter((item) => item.id !== productId) ?? null);
    } catch (e) {
      console.error("Delete failed", e);
      window.alert("Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">All uploaded assets appear here after publishing.</p>
        </div>
        <Link
          to="/dashboard/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary-foreground glow-ring"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" /> New asset
        </Link>
      </div>

      {items === null && <div className="text-muted-foreground">Loading…</div>}
      {items?.length === 0 && (
        <div className="glass-panel rounded-2xl p-10 text-center">
          <Package className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">You haven't uploaded anything yet.</p>
          <Link to="/dashboard/upload" className="inline-block mt-4 text-primary hover:underline">
            Upload your first asset →
          </Link>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <div key={p.id} className="glass-panel rounded-2xl overflow-hidden">
              {p.preview_image ? (
                <img src={p.preview_image} alt={p.title} className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full aspect-video bg-white/5" />
              )}
              <div className="p-4">
                <div className="font-semibold">{p.title}</div>
                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{p.category_slug}</span>
                  <span className="text-foreground font-medium">${Number(p.price).toFixed(0)}</span>
                </div>
                <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                  <span>{p.downloads} downloads</span>
                  <span>{p.likes} likes</span>
                </div>
                {user?.id === p.creator_id && (
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <Link
                      to={`/dashboard/edit/${p.id}`}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="inline-flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

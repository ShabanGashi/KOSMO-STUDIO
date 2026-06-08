import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toggleFavorite } from "@/lib/products";

export function FavoriteButton({ productId, className }: { productId: string; className?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle()
      .then(({ data }) => setIsFav(!!data));
  }, [user, productId]);

  async function onClick() {
    if (!user) return navigate({ to: "/login" });
    setBusy(true);
    try {
      const next = await toggleFavorite(user.id, productId);
      setIsFav(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={
        className ??
        "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium glass-panel hover:bg-white/5 transition"
      }
    >
      <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : ""}`} />
      {isFav ? "Saved to favorites" : "Add to favorites"}
    </button>
  );
}

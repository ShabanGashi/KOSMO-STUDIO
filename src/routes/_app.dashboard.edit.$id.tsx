import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Save, Tag, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/mock-assets";
import { getProductById, updateProduct, type DbProduct } from "@/lib/products";

export const Route = createFileRoute("/_app/dashboard/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Product — KOSMO" }] }),
  component: EditProductPage,
});

function EditProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [product, setProduct] = useState<DbProduct | null | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [category, setCategory] = useState<string>(CATEGORIES[0].slug);
  const [price, setPrice] = useState("0");
  const [salePrice, setSalePrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((data) => setProduct(data))
      .catch(() => setProduct(null));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setTitle(product.title ?? "");
    setShortDescription(product.short_description ?? "");
    setDescription(product.description ?? "");
    setVersion(product.version ?? "1.0.0");
    setCategory(product.category_slug ?? CATEGORIES[0].slug);
    setSelectedTechs(product.technologies ?? []);
    setTags(product.tags ?? []);
    setPrice(String(product.price ?? 0));
    setSalePrice(product.sale_price != null ? String(product.sale_price) : "");
    setIsFree(product.price === 0);
  }, [product]);

  const techOptions = useMemo(
    () => ["React", "Next.js", "Tailwind", "Figma", "Photoshop", "Illustrator"] as const,
    [],
  );

  function setErrorMessage(message: string) {
    setError(message);
    setTimeout(() => setError(null), 6500);
  }

  function addTag(value: string) {
    const normalized = value.trim();
    if (!normalized) return;
    if (!tags.includes(normalized)) {
      setTags((current) => [...current, normalized]);
    }
    setCustomTag("");
  }

  function removeTag(value: string) {
    setTags((current) => current.filter((tag) => tag !== value));
  }

  function toggleTech(tag: string) {
    setSelectedTechs((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
      event.preventDefault();
      addTag(customTag);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      setError("Authentication is required to save changes.");
      return;
    }
    if (!product) {
      setError("Unable to save changes before the product loads.");
      return;
    }
    if (user.id !== product.creator_id) {
      setError("You are not authorized to edit this product.");
      return;
    }
    if (!title.trim()) {
      return setErrorMessage("Asset title is required.");
    }
    if (!shortDescription.trim()) {
      return setErrorMessage("A short description is required.");
    }
    if (!description.trim()) {
      return setErrorMessage("A full description is required.");
    }
    if (!isFree && (!price || Number(price) < 0)) {
      return setErrorMessage("Set a valid price or mark the asset as free.");
    }
    if (salePrice && Number(salePrice) > Number(price)) {
      return setErrorMessage("Sale price must be less than or equal to the standard price.");
    }

    setBusy(true);
    setError(null);

    try {
      await updateProduct(product.id, {
        title: title.trim(),
        short_description: shortDescription.trim(),
        description: description.trim(),
        version: version.trim() || "1.0.0",
        price: isFree ? 0 : Number(price),
        sale_price: isFree ? null : salePrice ? Number(salePrice) : null,
        category_slug: category,
        tags,
        technologies: selectedTechs,
      });
      setSuccess(true);
      setTimeout(() => navigate({ to: "/dashboard/my-products" }), 800);
    } catch (e) {
      console.error("Save changes failed", e);
      setError(e instanceof Error ? e.message : "Save failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (product === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <p>Product not found.</p>
        <Link to="/dashboard/my-products" className="text-primary hover:underline">
          Back to My Products
        </Link>
      </div>
    );
  }

  if (!user || user.id !== product.creator_id) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <p>You are not authorized to edit this product.</p>
        <Link to="/dashboard/my-products" className="text-primary hover:underline">
          Back to My Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Edit product</h1>
          <p className="text-sm text-muted-foreground">Update details for your uploaded asset.</p>
        </div>
        <Link
          to="/dashboard/my-products"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-muted-foreground hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Products
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Version</label>
            <input
              value={version}
              onChange={(event) => setVersion(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
            >
              {CATEGORIES.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              disabled={isFree}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sale price</label>
            <input
              type="number"
              min="0"
              value={salePrice}
              onChange={(event) => setSalePrice(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              disabled={isFree}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Free asset</label>
            <div className="flex items-center gap-3">
              <input
                id="isFree"
                type="checkbox"
                checked={isFree}
                onChange={(event) => setIsFree(event.target.checked)}
                className="h-4 w-4 rounded border-white/10 bg-surface text-primary"
              />
              <label htmlFor="isFree" className="text-sm text-muted-foreground">
                Mark as free
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Short description</label>
          <textarea
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Technologies</p>
              <p className="text-xs text-muted-foreground">Select the technologies used by this asset.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {techOptions.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={`rounded-full border px-3 py-2 text-sm transition ${selectedTechs.includes(tech) ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted-foreground hover:border-white/20"}`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full border border-white/10 bg-surface px-3 py-2 text-sm text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                #{tag}
              </button>
            ))}
          </div>
          <input
            value={customTag}
            onChange={(event) => setCustomTag(event.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag and press Enter"
            className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-emerald-400">Changes saved. Redirecting...</p>}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}

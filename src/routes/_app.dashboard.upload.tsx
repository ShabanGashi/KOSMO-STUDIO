import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Loader2,
  CheckCircle2,
  Image,
  File,
  Sparkles,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/mock-assets";
import { createProduct, uploadProductAssets } from "@/lib/products";

const TECHNOLOGY_OPTIONS = ["React", "Next.js", "Tailwind", "Figma", "Photoshop", "Illustrator"] as const;
const MAX_GALLERY_IMAGES = 6;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_SIZE = 250 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_FILE_EXTENSIONS = [".zip", ".pdf", ".fig", ".ai", ".sketch", ".xd", ".psd", ".svg", ".json"];

export const Route = createFileRoute("/_app/dashboard/upload")({
  head: () => ({ meta: [{ title: "Upload Asset — KOSMO" }] }),
  component: UploadPage,
});

function slugify(value: string) {
  return `${value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")}-${crypto.randomUUID().slice(0, 6)}`;
}

function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [category, setCategory] = useState<string>(CATEGORIES[0].slug);
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("39");
  const [salePrice, setSalePrice] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [digitalFile, setDigitalFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success">("idle");

  useEffect(() => {
    if (status !== "uploading") return;
    const interval = window.setInterval(() => {
      setUploadProgress((value) => Math.min(95, value + Math.floor(Math.random() * 8) + 3));
    }, 180);
    return () => window.clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const galleryPreviews = useMemo(
    () => galleryFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [galleryFiles],
  );

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [galleryPreviews]);

  function setErrorMessage(message: string) {
    setError(message);
    setTimeout(() => setError(null), 6500);
  }

  function validateImage(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPG, PNG, WEBP, GIF, and SVG images are allowed.";
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return "Each cover or gallery image must be smaller than 10 MB.";
    }
    return null;
  }

  function validateAssetFile(file: File) {
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
      return "Unsupported asset file type. Upload ZIP, PDF, Figma, AI, Sketch, XD, PSD, or SVG.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "The uploaded asset file must be smaller than 250 MB.";
    }
    return null;
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

  function handleCoverSelection(file: File | null) {
    if (!file) {
      setCoverFile(null);
      return;
    }
    const error = validateImage(file);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setCoverFile(file);
  }

  function handleGallerySelection(files: File[]) {
    const validFiles: File[] = [];
    for (const file of files) {
      const error = validateImage(file);
      if (error) {
        setErrorMessage(error);
        continue;
      }
      validFiles.push(file);
    }
    setGalleryFiles((current) => [...current, ...validFiles].slice(0, MAX_GALLERY_IMAGES));
  }

  function handleDigitalSelection(file: File | null) {
    if (!file) {
      setDigitalFile(null);
      return;
    }
    const error = validateAssetFile(file);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setDigitalFile(file);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      setError("Authentication is required to upload assets.");
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
    if (!coverFile) {
      return setErrorMessage("Please upload a cover image.");
    }
    if (!digitalFile) {
      return setErrorMessage("Please upload the asset package.");
    }
    if (!isFree && (!price || Number(price) <= 0)) {
      return setErrorMessage("Set a valid price or mark the asset as free.");
    }
    if (salePrice && Number(salePrice) > Number(price)) {
      return setErrorMessage("Sale price must be less than or equal to the standard price.");
    }

    setBusy(true);
    setError(null);
    setStatus("uploading");
    setUploadProgress(8);

    try {
      const productId = crypto.randomUUID();
      const slug = slugify(title);
      const { thumbnail_url, gallery_urls, preview_image, file_url } = await uploadProductAssets({
        userId: user.id,
        productId,
        thumbnailFile: coverFile,
        galleryFiles,
        digitalFile,
      });

      await createProduct({
        id: productId,
        creator_id: user.id,
        title: title.trim(),
        slug,
        short_description: shortDescription.trim(),
        description: description.trim(),
        version: version.trim() || "1.0.0",
        price: isFree ? 0 : Number(price),
        sale_price: salePrice ? Number(salePrice) : null,
        is_free: isFree,
        category_slug: category,
        tags,
        technologies: selectedTechs,
        thumbnail_url,
        preview_image,
        gallery_urls,
        file_url,
      });

      setStatus("success");
      setUploadProgress(100);
      setDone(true);
      setTimeout(() => router.navigate({ to: "/dashboard/my-products" }), 1100);
    } catch (e) {
      console.error("Upload process failed", e);
      setError((e as Error).message || "Upload failed. Please try again.");
      setStatus("idle");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-panel rounded-3xl p-10 text-center max-w-xl">
          <p className="text-xl font-semibold mb-3">Please sign in to upload assets.</p>
          <p className="text-sm text-muted-foreground mb-6">
            Upload access is available to any logged-in user.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-ring hover:brightness-110 transition"
          >
            Sign in to continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary">
            <Sparkles className="h-4 w-4" /> Creator Studio
          </div>
          <span className="text-sm text-muted-foreground">Responsive, premium upload experience for digital assets.</span>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold">
          Upload new asset
        </motion.h1>
        <p className="max-w-2xl text-muted-foreground">
          Publish a premium marketplace listing with gallery previews, file delivery, pricing, and technology tags.
        </p>
      </div>

      <div className="grid xl:grid-cols-[1.6fr_0.95fr] gap-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <Section title="Asset information" description="Title, descriptions, category, tags and version.">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Title" required>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nebula UI kit"
                  className="input-field"
                />
              </FormField>
              <FormField label="Version" required>
                <input
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="input-field"
                />
              </FormField>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Category" required>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                  {CATEGORIES.map((option) => (
                    <option key={option.slug} value={option.slug}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Short description" required>
                <input
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One-line hook for buyers"
                  className="input-field"
                />
              </FormField>
            </div>
            <FormField label="Full description" required>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Explain the asset features, contents, and licensing details."
                className="input-field resize-none"
              />
            </FormField>
            <FormField label="Tags" description="Add custom tags, then press enter or comma." noMargin>
              <div className="grid gap-3">
                <input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tags like app-ui, marketing, icons"
                  className="input-field"
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => removeTag(tag)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground hover:border-primary"
                    >
                      <span>#{tag}</span>
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>
            </FormField>
          </Section>

          <Section title="Pricing" description="Offer your asset as free or paid with sale pricing.">
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-cyan-400"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                />
                Free asset
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Standard price (USD)" required={!isFree}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isFree}
                  className="input-field"
                />
              </FormField>
              <FormField label="Sale price (USD)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  disabled={isFree}
                  className="input-field"
                />
              </FormField>
            </div>
          </Section>

          <Section title="Preview images" description="Upload a thumbnail and gallery with drag-and-drop support.">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Cover image" required>
                <DropZone
                  label={coverFile ? coverFile.name : "Drop cover image or click to browse"}
                  onSelect={(file) => handleCoverSelection(file)}
                />
                {coverPreview && (
                  <img src={coverPreview} alt="Cover preview" className="mt-3 w-full rounded-3xl border border-white/10 object-cover" style={{ minHeight: 200 }} />
                )}
              </FormField>
              <FormField label="Gallery" description={`Up to ${MAX_GALLERY_IMAGES} images.`}>
                <DropZone
                  label={galleryFiles.length ? `${galleryFiles.length} selected` : "Drag gallery images here"}
                  multiple
                  onFiles={(files) => handleGallerySelection(files)}
                />
                {galleryPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {galleryPreviews.map((preview) => (
                      <img
                        key={preview.url}
                        src={preview.url}
                        alt={preview.file.name}
                        className="h-24 w-full rounded-3xl border border-white/10 object-cover"
                      />
                    ))}
                  </div>
                )}
              </FormField>
            </div>
          </Section>

          <Section title="Asset file upload" description="Upload the downloadable ZIP or asset package.">
            <FormField label="Asset package" required>
              <DropZone
                label={digitalFile ? digitalFile.name : "Drop ZIP or asset package here"}
                accept={ALLOWED_FILE_EXTENSIONS.join(",")}
                onSelect={(file) => handleDigitalSelection(file)}
              />
            </FormField>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Upload progress</p>
              <div className="overflow-hidden rounded-full bg-white/10 h-2.5">
                <div className="h-2.5 rounded-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">{uploadProgress}% complete</div>
            </div>
          </Section>

          <Section title="Technologies" description="Pick the tools used to build this asset.">
            <div className="flex flex-wrap gap-2">
              {TECHNOLOGY_OPTIONS.map((tech) => (
                <button
                  type="button"
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedTechs.includes(tech)
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            <FormField label="Custom tags" description="Add extra tags for discoverability." noMargin>
              <div className="flex flex-wrap gap-2">
                {selectedTechs.map((tech) => (
                  <span key={tech} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                    {tech}
                  </span>
                ))}
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            </FormField>
          </Section>

          {error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={busy || done}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-ring transition disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                </>
              ) : done ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Published
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Publish asset
                </>
              )}
            </button>
            {status === "success" && <span className="text-sm text-emerald-300">Asset uploaded successfully.</span>}
          </div>
        </form>

        <aside className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-[0.22em]">Live preview</p>
                <h2 className="mt-2 text-2xl font-semibold">Product card</h2>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-primary">
                <File className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
              {coverPreview ? (
                <img src={coverPreview} alt="Preview cover" className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Cover preview will appear here.</div>
              )}
              <div className="p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-primary">{category.replace(/-/g, " ")}</div>
                <h3 className="mt-3 text-2xl font-semibold">{title || "New marketplace asset"}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-6">{shortDescription || "A premium digital asset listing with instant preview."}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(selectedTechs.length ? selectedTechs : ["React", "Tailwind"]).map((tech) => (
                    <span key={tech} className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="text-3xl font-bold">{isFree ? "Free" : `$${Number(price || 0).toFixed(2)}`}</div>
                  </div>
                  <div className="rounded-3xl bg-white/5 px-3 py-2 text-sm text-muted-foreground">v{version}</div>
                </div>
                {galleryPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {galleryPreviews.slice(0, 3).map((preview) => (
                      <img key={preview.url} src={preview.url} alt={preview.file.name} className="h-20 w-full rounded-3xl object-cover" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Publishing checklist</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                High-resolution cover, gallery, and asset package ready.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                Marketplace-ready title, short summary, and full description.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                Technology tags, custom search tags, and premium preview card.
              </li>
            </ul>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-2xl bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">Section</div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FormField({
  label,
  description,
  children,
  required = false,
  noMargin = false,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  required?: boolean;
  noMargin?: boolean;
}) {
  return (
    <label className={`${noMargin ? "" : "space-y-2"} block`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        {required && <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Required</span>}
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
    </label>
  );
}

function DropZone({
  label,
  onSelect,
  onFiles,
  accept,
  multiple,
}: {
  label: string;
  onSelect?: (file: File | null) => void;
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}) {
  const prevent = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    prevent(event);
    const files = Array.from(event.dataTransfer.files);
    if (multiple && onFiles) {
      onFiles(files);
    } else if (!multiple && onSelect) {
      onSelect(files[0] ?? null);
    }
  };

  return (
    <div
      onDragEnter={prevent}
      onDragOver={prevent}
      onDrop={handleDrop}
      className="group relative rounded-3xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-center transition hover:border-primary/50 hover:bg-white/10"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-primary transition group-hover:bg-primary/15">
        <Plus className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      {(onSelect || onFiles) && (
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(event) => {
            const files = event.target.files ? Array.from(event.target.files) : [];
            if (multiple && onFiles) {
              onFiles(files);
            } else if (!multiple && onSelect) {
              onSelect(files[0] ?? null);
            }
            event.target.value = "";
          }}
        />
      )}
    </div>
  );
}

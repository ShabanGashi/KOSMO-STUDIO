import { supabase } from "@/lib/supabase";

export type DbProduct = {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  version: string | null;
  price: number;
  sale_price: number | null;
  is_free: boolean;
  category_slug: string | null;
  tags: string[];
  technologies: string[];
  thumbnail_url: string | null;
  preview_image: string | null;
  gallery: string[];
  gallery_urls: string[];
  file_url: string | null;
  downloads: number;
  likes: number;
  created_at: string;
};

export async function becomeCreator() {
  const { error } = await supabase.rpc("become_creator");
  if (error) throw error;
}

export async function hasCreatorRole(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "creator")
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function listMyProducts(userId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbProduct[];
}

export async function listAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) throw error;
  return (data ?? []) as DbProduct[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as DbProduct | null;
}

export async function updateProduct(id: string, input: Partial<Omit<DbProduct, "id" | "creator_id" | "slug" | "created_at" | "downloads" | "likes" | "thumbnail_url" | "preview_image" | "gallery_urls" | "file_url">>) {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as DbProduct;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductAssets(opts: {
  userId: string;
  productId: string;
  thumbnailFile: File;
  galleryFiles?: File[];
  digitalFile: File;
}) {
  const thumbnailPath = `products/${opts.userId}/${opts.productId}/thumbnail-${opts.thumbnailFile.name}`;
  const filePath = `products/${opts.userId}/${opts.productId}/files/${opts.digitalFile.name}`;

  const { error: thumbError } = await supabase.storage
    .from("product-images")
    .upload(thumbnailPath, opts.thumbnailFile, { upsert: true });
  if (thumbError) {
    console.error("Thumbnail upload failed", thumbError);
    throw thumbError;
  }

  const gallery_urls: string[] = [];
  for (const file of opts.galleryFiles ?? []) {
    const galleryPath = `products/${opts.userId}/${opts.productId}/gallery/${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(galleryPath, file, { upsert: true });
    if (error) {
      console.error("Gallery upload failed", { galleryPath, error });
      throw error;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(galleryPath);
    if (!data?.publicUrl) {
      const message = "Failed to create gallery image public URL.";
      console.error(message, galleryPath);
      throw new Error(message);
    }
    gallery_urls.push(data.publicUrl);
  }

  const { error: fileError } = await supabase.storage
    .from("product-files")
    .upload(filePath, opts.digitalFile, { upsert: true });
  if (fileError) {
    console.error("Product file upload failed", fileError);
    throw fileError;
  }

  const { data: thumbnailPublic } = supabase.storage
    .from("product-images")
    .getPublicUrl(thumbnailPath);
  if (!thumbnailPublic?.publicUrl) {
    const message = "Failed to create preview image public URL.";
    console.error(message, thumbnailPath);
    throw new Error(message);
  }

  return {
    thumbnail_url: thumbnailPublic.publicUrl,
    preview_image: thumbnailPublic.publicUrl,
    gallery_urls,
    file_url: filePath,
  };
}

export async function createProduct(input: {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  version: string | null;
  price: number;
  sale_price: number | null;
  is_free: boolean;
  category_slug: string | null;
  tags: string[];
  technologies: string[];
  thumbnail_url: string;
  preview_image: string;
  gallery_urls: string[];
  file_url: string;
}) {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select()
    .single();
  if (error) {
    console.error("Product insert failed", error, input);
    throw error;
  }
  return data as DbProduct;
}

export async function getSignedDownload(filePath: string) {
  const { data, error } = await supabase.storage
    .from("product-files")
    .createSignedUrl(filePath, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}

export async function toggleFavorite(userId: string, productId: string) {
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();
  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return false;
  }
  await supabase.from("favorites").insert({ user_id: userId, product_id: productId });
  return true;
}

export async function listMyFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("product_id, products(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return ((data ?? []) as unknown as Array<{ products: DbProduct | null }>)
    .map((r) => r.products)
    .filter((p): p is DbProduct => !!p);
}


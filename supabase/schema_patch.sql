-- ============================================================
-- KOSMO — RLS hardening patch (run AFTER schema.sql)
-- Safe to re-run. Drops old policies and recreates them.
-- ============================================================

-- ---------- products: enforce creator role + integrity ----------
drop policy if exists "products_creator_insert" on public.products;
drop policy if exists "products_creator_update" on public.products;
drop policy if exists "products_creator_delete" on public.products;
drop policy if exists "products_public_read"    on public.products;

-- Anyone (logged in or not) can browse
create policy "products_public_read"
  on public.products for select
  using (true);

-- Only users with the 'creator' role can insert, and only as themselves
create policy "products_creator_insert"
  on public.products for insert
  to authenticated
  with check (
    auth.uid() = creator_id
    and public.has_role(auth.uid(), 'creator')
  );

-- Only the owning creator can update; cannot reassign creator_id
create policy "products_creator_update"
  on public.products for update
  to authenticated
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

-- Only the owning creator can delete
create policy "products_creator_delete"
  on public.products for delete
  to authenticated
  using (auth.uid() = creator_id);

-- ---------- helper: let users upgrade themselves to creator ----------
-- (so the dashboard "Become a creator" / first upload flow works)
create or replace function public.become_creator()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  insert into public.user_roles (user_id, role)
  values (auth.uid(), 'creator')
  on conflict do nothing;
end; $$;

grant execute on function public.become_creator() to authenticated;

-- ---------- profiles: re-assert ----------
drop policy if exists "profiles_public_read" on public.profiles;
drop policy if exists "profiles_self_insert" on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;

create policy "profiles_public_read"
  on public.profiles for select using (true);
create policy "profiles_self_insert"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);
create policy "profiles_self_update"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- purchases: immutable, self-scoped ----------
drop policy if exists "purchases_self_read"   on public.purchases;
drop policy if exists "purchases_self_insert" on public.purchases;

create policy "purchases_self_read"
  on public.purchases for select to authenticated
  using (auth.uid() = user_id);
create policy "purchases_self_insert"
  on public.purchases for insert to authenticated
  with check (auth.uid() = user_id);

-- ---------- favorites: self-scoped ----------
drop policy if exists "favorites_self_read"   on public.favorites;
drop policy if exists "favorites_self_insert" on public.favorites;
drop policy if exists "favorites_self_delete" on public.favorites;

create policy "favorites_self_read"
  on public.favorites for select to authenticated
  using (auth.uid() = user_id);
create policy "favorites_self_insert"
  on public.favorites for insert to authenticated
  with check (auth.uid() = user_id);
create policy "favorites_self_delete"
  on public.favorites for delete to authenticated
  using (auth.uid() = user_id);

-- ---------- storage: scope writes to the user's own folder ----------
-- Convention: upload paths begin with <auth.uid()>/...
drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_owner_write" on storage.objects;
drop policy if exists "product_images_owner_update" on storage.objects;
drop policy if exists "product_images_owner_delete" on storage.objects;

create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_owner_write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
    and public.has_role(auth.uid(), 'creator')
  );

create policy "product_images_owner_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "product_images_owner_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "product_files_owner_write"  on storage.objects;
drop policy if exists "product_files_owner_update" on storage.objects;
drop policy if exists "product_files_owner_delete" on storage.objects;
drop policy if exists "product_files_owner_read"   on storage.objects;

-- Private bucket: only the uploading creator can read directly.
-- Buyers must download via a server-issued signed URL.
create policy "product_files_owner_read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'product-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "product_files_owner_write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'product-files'
    and auth.uid()::text = (storage.foldername(name))[1]
    and public.has_role(auth.uid(), 'creator')
  );

create policy "product_files_owner_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'product-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "product_files_owner_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'product-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

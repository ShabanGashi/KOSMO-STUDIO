-- ============================================================
-- KOSMO — Supabase schema (run once in Supabase SQL editor)
-- ============================================================

-- Roles
do $$ begin
  create type public.app_role as enum ('buyer', 'creator', 'admin');
exception when duplicate_object then null; end $$;

-- ============ profiles ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_public_read" on public.profiles for select using (true);
create policy "profiles_self_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id);

-- ============ user_roles (separate from profiles to avoid RLS recursion) ============
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user_roles_self_read" on public.user_roles for select using (auth.uid() = user_id);

-- ============ categories ============
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select using (true);

insert into public.categories (name, slug) values
  ('Web Templates','web-templates'),('React Templates','react-templates'),
  ('UI Kits','ui-kits'),('Graphics & Posters','graphics'),
  ('Stock Photos','stock-photos'),('Social Media Packs','social-packs'),
  ('Mockups','mockups'),('Icons & Fonts','icons-fonts')
on conflict (slug) do nothing;

-- ============ products ============
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  slug text unique,
  short_description text,
  description text,
  version text,
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  is_free boolean default false,
  category_slug text references public.categories(slug),
  tags text[] default '{}',
  technologies text[] default '{}',
  thumbnail_url text,
  preview_image text,
  gallery text[] default '{}',
  gallery_urls text[] default '{}',
  file_url text,
  downloads int default 0,
  likes int default 0,
  created_at timestamptz default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products_public_read" on public.products for select using (true);
create policy "products_creator_insert" on public.products for insert with check (auth.uid() = creator_id);
create policy "products_creator_update" on public.products for update using (auth.uid() = creator_id);
create policy "products_creator_delete" on public.products for delete using (auth.uid() = creator_id);

-- ============ purchases ============
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  amount numeric(10,2) not null,
  created_at timestamptz default now()
);
grant select, insert on public.purchases to authenticated;
grant all on public.purchases to service_role;
alter table public.purchases enable row level security;
create policy "purchases_self_read" on public.purchases for select using (auth.uid() = user_id);
create policy "purchases_self_insert" on public.purchases for insert with check (auth.uid() = user_id);

-- ============ favorites ============
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);
grant select, insert, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;
create policy "favorites_self_read" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites_self_insert" on public.favorites for insert with check (auth.uid() = user_id);
create policy "favorites_self_delete" on public.favorites for delete using (auth.uid() = user_id);

-- ============ trigger: auto-create profile + role on signup ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'buyer')
  on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ storage buckets ============
insert into storage.buckets (id, name, public) values
  ('product-files','product-files', false),
  ('product-images','product-images', true),
  ('avatars','avatars', true)
on conflict (id) do nothing;

-- avatars + product-images: public read, owner write
create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_owner_write" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars_owner_update" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "product_images_public_read" on storage.objects for select using (bucket_id = 'product-images');
create policy "product_images_owner_write" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- product-files: only purchasers/creators can read (handle via signed URLs server-side)
create policy "product_files_owner_write" on storage.objects for insert with check (bucket_id = 'product-files' and auth.role() = 'authenticated');

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  phone text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text,
  image text,
  parent_id uuid references public.categories(id) on delete set null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  price numeric(12, 2) not null default 0,
  old_price numeric(12, 2),
  category_slug text not null references public.categories(slug) on update cascade,
  brand text not null,
  image text not null,
  images jsonb not null default '[]'::jsonb,
  stock integer not null default 0 check (stock >= 0),
  rating numeric(3, 2) not null default 0,
  reviews_count integer not null default 0,
  is_new boolean not null default false,
  is_hot boolean not null default false,
  is_sale boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  author text not null,
  category text not null,
  image text not null,
  published_at timestamptz not null default now(),
  read_time integer,
  featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  icon text not null,
  link text not null,
  features jsonb not null default '[]'::jsonb,
  details jsonb not null default '[]'::jsonb,
  related_category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  street text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  country text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists addresses_one_default_per_user
  on public.addresses(user_id)
  where is_default;

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(12, 2) not null default 0,
  shipping_fee numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  payment_method text not null check (payment_method in ('cash', 'vodafone', 'instapay', 'bank')),
  items jsonb not null default '[]'::jsonb,
  shipping_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'open', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  company text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  activity text not null,
  order_size text not null,
  description text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'quoted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.b2b_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  sector text not null,
  expected_monthly_spend text not null,
  requirements text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_slug_idx on public.products(category_slug);
create index if not exists products_active_created_at_idx on public.products(is_active, created_at desc);
create index if not exists categories_active_name_idx on public.categories(is_active, name);
create index if not exists blog_posts_published_at_idx on public.blog_posts(published_at desc);
create index if not exists blog_posts_active_published_idx on public.blog_posts(is_active, published_at desc);
create index if not exists services_related_category_idx on public.services(related_category);
create index if not exists services_active_title_idx on public.services(is_active, title);
create index if not exists orders_user_created_at_idx on public.orders(user_id, created_at desc);
create index if not exists cart_items_user_idx on public.cart_items(user_id);
create index if not exists wishlist_items_user_idx on public.wishlist_items(user_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists addresses_set_updated_at on public.addresses;
create trigger addresses_set_updated_at before update on public.addresses
for each row execute function public.set_updated_at();

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at before update on public.cart_items
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at before update on public.contact_messages
for each row execute function public.set_updated_at();

drop trigger if exists quote_requests_set_updated_at on public.quote_requests;
create trigger quote_requests_set_updated_at before update on public.quote_requests
for each row execute function public.set_updated_at();

drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

drop trigger if exists b2b_registrations_set_updated_at on public.b2b_registrations;
create trigger b2b_registrations_set_updated_at before update on public.b2b_registrations
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.blog_posts enable row level security;
alter table public.services enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.contact_messages enable row level security;
alter table public.quote_requests enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.b2b_registrations enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
for select using (is_active = true or public.is_admin());

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
for select using (is_active = true);

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts
for select using (is_active = true or public.is_admin());

drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services
for select using (is_active = true or public.is_admin());

drop policy if exists categories_admin_manage on public.categories;
create policy categories_admin_manage on public.categories
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists products_admin_manage on public.products;
create policy products_admin_manage on public.products
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists blog_posts_admin_manage on public.blog_posts;
create policy blog_posts_admin_manage on public.blog_posts
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists services_admin_manage on public.services;
create policy services_admin_manage on public.services
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings
for select using (true);

drop policy if exists site_settings_admin_manage on public.site_settings;
create policy site_settings_admin_manage on public.site_settings
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists profiles_own_read on public.profiles;
create policy profiles_own_read on public.profiles
for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_own_insert on public.profiles;
create policy profiles_own_insert on public.profiles
for insert with check (auth.uid() = id or public.is_admin());

drop policy if exists profiles_own_update on public.profiles;
create policy profiles_own_update on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists addresses_owner_all on public.addresses;
create policy addresses_owner_all on public.addresses
for all using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists cart_items_owner_all on public.cart_items;
create policy cart_items_owner_all on public.cart_items
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists wishlist_items_owner_all on public.wishlist_items;
create policy wishlist_items_owner_all on public.wishlist_items
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists orders_owner_read on public.orders;
create policy orders_owner_read on public.orders
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists orders_owner_insert on public.orders;
create policy orders_owner_insert on public.orders
for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
for update using (public.is_admin())
with check (public.is_admin());

drop policy if exists contact_messages_insert_public on public.contact_messages;
create policy contact_messages_insert_public on public.contact_messages
for insert with check (true);

drop policy if exists contact_messages_select_owner_or_admin on public.contact_messages;
create policy contact_messages_select_owner_or_admin on public.contact_messages
for select using (public.is_admin() or auth.uid() = user_id);

drop policy if exists contact_messages_admin_update on public.contact_messages;
create policy contact_messages_admin_update on public.contact_messages
for update using (public.is_admin())
with check (public.is_admin());

drop policy if exists quote_requests_insert_public on public.quote_requests;
create policy quote_requests_insert_public on public.quote_requests
for insert with check (true);

drop policy if exists quote_requests_select_owner_or_admin on public.quote_requests;
create policy quote_requests_select_owner_or_admin on public.quote_requests
for select using (public.is_admin() or auth.uid() = user_id);

drop policy if exists quote_requests_admin_update on public.quote_requests;
create policy quote_requests_admin_update on public.quote_requests
for update using (public.is_admin())
with check (public.is_admin());

drop policy if exists newsletter_insert_public on public.newsletter_subscribers;
create policy newsletter_insert_public on public.newsletter_subscribers
for insert with check (true);

drop policy if exists newsletter_admin_read on public.newsletter_subscribers;
create policy newsletter_admin_read on public.newsletter_subscribers
for select using (public.is_admin());

drop policy if exists b2b_insert_public on public.b2b_registrations;
create policy b2b_insert_public on public.b2b_registrations
for insert with check (true);

drop policy if exists b2b_select_owner_or_admin on public.b2b_registrations;
create policy b2b_select_owner_or_admin on public.b2b_registrations
for select using (public.is_admin() or auth.uid() = user_id);

drop policy if exists b2b_admin_update on public.b2b_registrations;
create policy b2b_admin_update on public.b2b_registrations
for update using (public.is_admin())
with check (public.is_admin());

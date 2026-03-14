-- جدول سجل الصور: ربط كود/مرجع لكل صورة بعنوانها
-- مثال: herot-1 | url="..." ، Cat-1 | url="..."

create table if not exists public.image_registry (
  code text primary key,
  url text not null default '',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists image_registry_code_idx on public.image_registry(code);

drop trigger if exists image_registry_set_updated_at on public.image_registry;
create trigger image_registry_set_updated_at before update on public.image_registry
for each row execute function public.set_updated_at();

alter table public.image_registry enable row level security;

-- القراءة متاحة للجميع
drop policy if exists image_registry_public_read on public.image_registry;
create policy image_registry_public_read on public.image_registry
for select using (true);

-- التعديل للإدمن فقط
drop policy if exists image_registry_admin_manage on public.image_registry;
create policy image_registry_admin_manage on public.image_registry
for all using (public.is_admin())
with check (public.is_admin());

-- بيانات أولية لأكواد الهيرو والفئات
insert into public.image_registry (code, url, description)
values
  ('herot-1', '', 'Hero slide 1 – الصورة الأولى للهيرو'),
  ('herot-2', '', 'Hero slide 2 – الصورة الثانية للهيرو'),
  ('herot-3', '', 'Hero slide 3 – الصورة الثالثة للهيرو'),
  ('Cat-1', '', 'Category 1 – الفئة الأولى'),
  ('Cat-2', '', 'Category 2 – الفئة الثانية'),
  ('Cat-3', '', 'Category 3 – الفئة الثالثة'),
  ('Cat-4', '', 'Category 4 – الفئة الرابعة'),
  ('Cat-5', '', 'Category 5 – الفئة الخامسة'),
  ('Cat-6', '', 'Category 6 – الفئة السادسة'),
  ('Cat-7', '', 'Category 7 – الفئة السابعة'),
  ('Cat-8', '', 'Category 8 – الفئة الثامنة')
on conflict (code) do nothing;

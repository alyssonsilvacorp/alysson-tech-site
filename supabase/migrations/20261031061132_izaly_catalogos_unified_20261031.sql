
-- IZALY Catálogos integrado ao Control Center da Alysson Tech.
-- Produtos permanecem em smart_business_services: fonte única para edição.
-- Rota canônica /p/{slug}/catalogo; aliases independentes /c/AT-C001...100.

alter table public.smart_businesses
  add column if not exists logo_initials text,
  add column if not exists brand_support_color text,
  add column if not exists brand_background_color text,
  add column if not exists brand_highlight_color text;

alter table public.smart_business_services
  add column if not exists catalog_category text,
  add column if not exists catalog_badge text,
  add column if not exists catalog_variants jsonb not null default '[]'::jsonb,
  add column if not exists catalog_images jsonb not null default '[]'::jsonb;

create table if not exists public.smart_catalog_settings (
 business_id uuid primary key references public.smart_businesses(id) on delete cascade,
 status text not null default 'draft' check(status in ('draft','published','paused')),
 headline text,
 subheadline text,
 announcement text,
 delivery_enabled boolean not null default false,
 pickup_enabled boolean not null default true,
 accept_inquiries boolean not null default true,
 updated_at timestamptz not null default now(),
 published_at timestamptz
);
alter table public.smart_catalog_settings enable row level security;
revoke all on public.smart_catalog_settings from public;
grant select on public.smart_catalog_settings to anon;
grant select,insert,update,delete on public.smart_catalog_settings to authenticated;
drop policy if exists at_catalog_public_read on public.smart_catalog_settings;
create policy at_catalog_public_read on public.smart_catalog_settings for select to anon,authenticated
 using(status='published');
drop policy if exists at_catalog_admin on public.smart_catalog_settings;
create policy at_catalog_admin on public.smart_catalog_settings for all to authenticated
 using(public.is_portal_admin()) with check(public.is_portal_admin());
drop policy if exists at_catalog_member_read on public.smart_catalog_settings;
create policy at_catalog_member_read on public.smart_catalog_settings for select to authenticated
 using(public.can_edit_smart_business(business_id,'catalog'));

-- Um catálogo pode ser publicado mesmo que o Multilink correspondente não esteja ativo.
drop policy if exists at_catalog_business_public_read on public.smart_businesses;
create policy at_catalog_business_public_read on public.smart_businesses for select to anon,authenticated
 using(exists(select 1 from public.smart_catalog_settings x where x.business_id=id and x.status='published'));

drop policy if exists at_catalog_products_public_read on public.smart_business_services;
create policy at_catalog_products_public_read on public.smart_business_services for select to anon,authenticated
 using(is_active and exists(select 1 from public.smart_catalog_settings x
  where x.business_id=smart_business_services.business_id and x.status='published'));

create table if not exists public.smart_catalog_delivery_zones (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.smart_businesses(id) on delete cascade,
 label text not null,
 delivery_fee numeric(10,2) not null default 0 check(delivery_fee>=0),
 is_active boolean not null default true,
 sort_order integer not null default 0,
 unique(business_id,label)
);
alter table public.smart_catalog_delivery_zones enable row level security;
revoke all on public.smart_catalog_delivery_zones from public;
grant select on public.smart_catalog_delivery_zones to anon;
grant select,insert,update,delete on public.smart_catalog_delivery_zones to authenticated;
drop policy if exists at_catalog_zones_public on public.smart_catalog_delivery_zones;
create policy at_catalog_zones_public on public.smart_catalog_delivery_zones for select to anon,authenticated
 using(is_active and exists(select 1 from public.smart_catalog_settings x where x.business_id=smart_catalog_delivery_zones.business_id and x.status='published'));
drop policy if exists at_catalog_zones_admin on public.smart_catalog_delivery_zones;
create policy at_catalog_zones_admin on public.smart_catalog_delivery_zones for all to authenticated
 using(public.is_portal_admin()) with check(public.is_portal_admin());
drop policy if exists at_catalog_zones_member on public.smart_catalog_delivery_zones;
create policy at_catalog_zones_member on public.smart_catalog_delivery_zones for select to authenticated
 using(public.can_edit_smart_business(business_id,'catalog'));

create table if not exists public.smart_catalog_routes (
 code text primary key check(code ~ '^AT-C[0-9]{3}$'),
 business_id uuid unique references public.smart_businesses(id) on delete set null,
 status text not null default 'available' check(status in('available','active','disabled')),
 updated_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
alter table public.smart_catalog_routes enable row level security;
revoke all on public.smart_catalog_routes from public;
grant select on public.smart_catalog_routes to anon;
grant select,insert,update on public.smart_catalog_routes to authenticated;
drop policy if exists at_catalog_routes_public on public.smart_catalog_routes;
create policy at_catalog_routes_public on public.smart_catalog_routes for select to anon,authenticated
 using(status='active' and exists(select 1 from public.smart_catalog_settings s
 where s.business_id=smart_catalog_routes.business_id and s.status='published'));
drop policy if exists at_catalog_routes_admin on public.smart_catalog_routes;
create policy at_catalog_routes_admin on public.smart_catalog_routes for all to authenticated
 using(public.is_portal_admin()) with check(public.is_portal_admin());
insert into public.smart_catalog_routes(code)
 select 'AT-C'||lpad(g::text,3,'0') from generate_series(1,100) g
 on conflict(code) do nothing;

create or replace function public.allocate_smart_catalog_code(p_business_id uuid)
returns text language plpgsql security definer set search_path=''
as $$
declare v_code text;
begin
 if (select auth.uid()) is null or not public.is_portal_admin() then
  raise exception 'Apenas o administrador pode reservar códigos' using errcode='42501';
 end if;
 if not exists(select 1 from public.smart_businesses where id=p_business_id) then
  raise exception 'Empresa não encontrada' using errcode='P0002';
 end if;
 select code into v_code from public.smart_catalog_routes where business_id=p_business_id;
 if v_code is not null then return v_code; end if;
 select code into v_code from public.smart_catalog_routes
  where status='available' and business_id is null order by code limit 1 for update skip locked;
 if v_code is null then raise exception 'Sem códigos livres para catálogo'; end if;
 update public.smart_catalog_routes set business_id=p_business_id,status='active',updated_at=now()
 where code=v_code;
 return v_code;
end;
$$;
revoke all on function public.allocate_smart_catalog_code(uuid) from public,anon;
grant execute on function public.allocate_smart_catalog_code(uuid) to authenticated;

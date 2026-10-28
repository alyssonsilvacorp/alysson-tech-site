-- Catálogo comercial da própria Alysson Tech (não confundir com catálogos das empresas clientes).
create table if not exists public.at_service_offerings (
 id uuid primary key default gen_random_uuid(),
 name text not null unique check (length(trim(name)) between 2 and 120),
 category text not null check (length(trim(category)) between 2 and 80),
 description text,
 billing_type text not null default 'one_time' check (billing_type in ('one_time','monthly')),
 reference_price numeric(10,2) check (reference_price is null or reference_price >= 0),
 is_active boolean not null default true,
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists at_service_offerings_status_idx on public.at_service_offerings(is_active,sort_order);
alter table public.at_service_offerings enable row level security;
revoke all on public.at_service_offerings from public,anon;
grant select,insert,update,delete on public.at_service_offerings to authenticated;
drop policy if exists at_service_offerings_admin on public.at_service_offerings;
create policy at_service_offerings_admin on public.at_service_offerings
 for all to authenticated using (public.is_portal_admin()) with check (public.is_portal_admin());

-- Produtos reais do portfólio existente; sem preços presumidos nem assinatura criada.
insert into public.at_service_offerings(name,category,description,billing_type,reference_price,sort_order)
values
 ('Placas inteligentes QR / NFC','Placas inteligentes','Placas com rotas permanentes e destinos editáveis. O painel do cliente é opcional.','one_time',null,10),
 ('Multilinks digitais','Presença digital','Página personalizada para serviços, contatos e catálogos.','monthly',null,20),
 ('Sites e landing pages','Websites','Sites institucionais e páginas de conversão conforme escopo.','one_time',null,30),
 ('Sistemas operacionais','Sistemas','Software sob medida para organizar o fluxo real da empresa.','one_time',null,40),
 ('Automação e integrações','Automações','Integração de ferramentas e rotinas digitais.','one_time',null,50),
 ('Consultoria e suporte de TI','Suporte de TI','Diagnóstico, suporte e manutenção de sistemas e equipamentos.','one_time',null,60)
on conflict(name) do nothing;
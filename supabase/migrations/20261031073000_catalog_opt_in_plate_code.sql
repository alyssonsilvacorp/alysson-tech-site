-- Opt-in comercial por empresa, sem criar catálogo para quem não contratou.
alter table public.smart_businesses
 add column if not exists has_catalog boolean not null default false;

-- Ações explícitas do catálogo são restritas ao administrador, com código preferencial do mesmo número da placa.
create or replace function public.allocate_smart_catalog_code(p_business_id uuid)
returns text language plpgsql security definer set search_path=''
as $$
declare v_code text; v_plate_code text; v_preferred text;
begin
 if (select auth.uid()) is null or not public.is_portal_admin() then
  raise exception 'Apenas administrador pode reservar códigos' using errcode='42501';
 end if;
 if not exists(select 1 from public.smart_businesses b where b.id=p_business_id and b.has_catalog) then
  raise exception 'Habilite o catálogo no cadastro da empresa' using errcode='22023';
 end if;
 select code into v_code from public.smart_catalog_routes where business_id=p_business_id;
 if v_code is not null then return v_code; end if;

 select code into v_plate_code from public.review_plates
 where smart_business_id=p_business_id order by code limit 1;
 if v_plate_code is not null then
  v_preferred='AT-C'||substring(v_plate_code from 5);
  select code into v_code from public.smart_catalog_routes
  where code=v_preferred and status='available' and business_id is null for update skip locked;
 end if;
 if v_code is null then
  select code into v_code from public.smart_catalog_routes
  where status='available' and business_id is null order by code limit 1 for update skip locked;
 end if;
 if v_code is null then raise exception 'Não há códigos de catálogo disponíveis' using errcode='P0002'; end if;
 update public.smart_catalog_routes set business_id=p_business_id,status='active',updated_at=now()
 where code=v_code;
 return v_code;
end;
$$;
revoke all on function public.allocate_smart_catalog_code(uuid) from public,anon;
grant execute on function public.allocate_smart_catalog_code(uuid) to authenticated;

-- Suspender ou excluir somente a configuração do catálogo; nunca excluir empresa, placas ou produtos.
create or replace function public.disable_smart_catalog(p_business_id uuid)
returns void language plpgsql security definer set search_path=''
as $$
begin
 if (select auth.uid()) is null or not public.is_portal_admin() then
  raise exception 'Acesso restrito ao administrador' using errcode='42501';
 end if;
 update public.smart_catalog_settings set status='paused',updated_at=now()
 where business_id=p_business_id;
end;
$$;
revoke all on function public.disable_smart_catalog(uuid) from public,anon;
grant execute on function public.disable_smart_catalog(uuid) to authenticated;

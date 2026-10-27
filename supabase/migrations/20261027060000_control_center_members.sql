-- Control Center multiempresa / Alysson Tech
-- Preparada para revisao em branch antes da aplicacao no ambiente ativo.
create table if not exists public.smart_business_members (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.smart_businesses(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 member_role text not null default 'editor' check (member_role in ('owner','editor','viewer')),
 can_edit_profile boolean not null default true,
 can_edit_catalog boolean not null default true,
 can_edit_payment boolean not null default true,
 is_active boolean not null default true,
 created_at timestamptz not null default now(),
 unique (business_id,user_id)
);
create index if not exists smart_business_members_user_idx on public.smart_business_members(user_id,business_id);
alter table public.smart_business_members enable row level security;
revoke all on public.smart_business_members from anon;
grant select,insert,update,delete on public.smart_business_members to authenticated;
drop policy if exists smart_members_admin on public.smart_business_members;
create policy smart_members_admin on public.smart_business_members for all to authenticated
 using (public.is_portal_admin()) with check (public.is_portal_admin());
drop policy if exists smart_members_read_self on public.smart_business_members;
create policy smart_members_read_self on public.smart_business_members for select to authenticated
 using (user_id=(select auth.uid()) and is_active);

-- Relacoes funcionais sao consultadas pela funcao, nunca por metadata editavel do usuario.
create or replace function public.can_edit_smart_business(p_business_id uuid,p_scope text)
returns boolean language sql stable security definer set search_path=''
as $$
 select (select auth.uid()) is not null and (
   public.is_portal_admin()
   or exists (
     select 1 from public.smart_business_members m
     where m.business_id=p_business_id and m.user_id=(select auth.uid()) and m.is_active
       and m.member_role in ('owner','editor')
       and case p_scope
          when 'profile' then m.can_edit_profile
          when 'catalog' then m.can_edit_catalog
          when 'payment' then m.can_edit_payment
          else false end
   )
 );
$$;
revoke all on function public.can_edit_smart_business(uuid,text) from public,anon;
grant execute on function public.can_edit_smart_business(uuid,text) to authenticated;

-- Leitura de rascunhos apenas pelo usuario associado.
drop policy if exists smart_businesses_member_read on public.smart_businesses;
create policy smart_businesses_member_read on public.smart_businesses for select to authenticated
 using (exists (
   select 1 from public.smart_business_members m
   where m.business_id=public.smart_businesses.id and m.user_id=(select auth.uid()) and m.is_active
 ));
drop policy if exists smart_services_member_read on public.smart_business_services;
create policy smart_services_member_read on public.smart_business_services for select to authenticated
 using (exists (
   select 1 from public.smart_business_members m
   where m.business_id=public.smart_business_services.business_id and m.user_id=(select auth.uid()) and m.is_active
 ));
drop policy if exists smart_services_member_insert on public.smart_business_services;
create policy smart_services_member_insert on public.smart_business_services for insert to authenticated
 with check (public.can_edit_smart_business(business_id,'catalog'));
drop policy if exists smart_services_member_update on public.smart_business_services;
create policy smart_services_member_update on public.smart_business_services for update to authenticated
 using (public.can_edit_smart_business(business_id,'catalog'))
 with check (public.can_edit_smart_business(business_id,'catalog'));
drop policy if exists smart_services_member_delete on public.smart_business_services;
create policy smart_services_member_delete on public.smart_business_services for delete to authenticated
 using (public.can_edit_smart_business(business_id,'catalog'));

-- O cliente deve poder ler suas próprias ações (inclusive Pix) mesmo enquanto o multilink é rascunho.
-- O RLS atual permite leitura pública apenas de ações ativas de empresas publicadas.
drop policy if exists smart_actions_member_read on public.smart_business_actions;
create policy smart_actions_member_read on public.smart_business_actions for select to authenticated
 using (exists (
   select 1 from public.smart_business_members m
   where m.business_id=public.smart_business_actions.business_id
     and m.user_id=(select auth.uid()) and m.is_active
  ));

-- Evitar UPDATE amplo no registro de empresa: apenas campos autorizados via RPC.
create or replace function public.update_smart_business_contact(
 p_business_id uuid,p_whatsapp text,p_instagram text,p_description text
) returns void language plpgsql security definer set search_path=''
as $$
begin
 if (select auth.uid()) is null or not public.can_edit_smart_business(p_business_id,'profile') then
   raise exception 'Acesso negado' using errcode='42501';
 end if;
 if p_instagram is not null and length(trim(p_instagram))>0
    and p_instagram !~* '^https://(www\.)?instagram\.com/' then
   raise exception 'Link do Instagram invalido' using errcode='22023';
 end if;
 update public.smart_businesses
 set whatsapp_number=nullif(regexp_replace(coalesce(p_whatsapp,''),'[^0-9]','','g'),''),
     instagram_url=nullif(trim(p_instagram),''),
     short_description=nullif(trim(p_description),''),
     updated_at=now()
 where id=p_business_id;
 if not found then raise exception 'Empresa nao encontrada' using errcode='P0002'; end if;
end;
$$;
revoke all on function public.update_smart_business_contact(uuid,text,text,text) from public,anon;
grant execute on function public.update_smart_business_contact(uuid,text,text,text) to authenticated;

create or replace function public.update_smart_business_pix(p_business_id uuid,p_pix_key text)
returns void language plpgsql security definer set search_path=''
as $$
begin
 if (select auth.uid()) is null or not public.can_edit_smart_business(p_business_id,'payment') then
   raise exception 'Acesso negado' using errcode='42501';
 end if;
 if length(coalesce(p_pix_key,''))>140 then
   raise exception 'Chave Pix muito longa' using errcode='22023';
 end if;
 update public.smart_business_actions
 set config=(coalesce(config,'{}'::jsonb) - 'pix_copia_e_cola') || jsonb_build_object('pix_key',trim(coalesce(p_pix_key,''))),
     is_active=true,updated_at=now()
 where business_id=p_business_id and action_type='pix';
 if not found then
   insert into public.smart_business_actions(business_id,action_type,label,config,is_active)
   values(p_business_id,'pix','Chave Pix',jsonb_build_object('pix_key',trim(coalesce(p_pix_key,''))),true);
 end if;
end;
$$;
revoke all on function public.update_smart_business_pix(uuid,text) from public,anon;
grant execute on function public.update_smart_business_pix(uuid,text) to authenticated;

-- Arquivos publicos de catalogo: pasta obrigatoria corresponde ao UUID da empresa.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('business-media','business-media',true,3145728,ARRAY['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists at_media_upload on storage.objects;
create policy at_media_upload on storage.objects for insert to authenticated
 with check (
   bucket_id='business-media'
   and public.can_edit_smart_business(((storage.foldername(name))[1])::uuid,'catalog')
 );
drop policy if exists at_media_edit on storage.objects;
create policy at_media_edit on storage.objects for update to authenticated
 using (bucket_id='business-media' and public.can_edit_smart_business(((storage.foldername(name))[1])::uuid,'catalog'))
 with check (bucket_id='business-media' and public.can_edit_smart_business(((storage.foldername(name))[1])::uuid,'catalog'));
drop policy if exists at_media_remove on storage.objects;
create policy at_media_remove on storage.objects for delete to authenticated
 using (bucket_id='business-media' and public.can_edit_smart_business(((storage.foldername(name))[1])::uuid,'catalog'));
drop policy if exists at_media_member_select on storage.objects;
create policy at_media_member_select on storage.objects for select to authenticated
 using (bucket_id='business-media' and public.can_edit_smart_business(((storage.foldername(name))[1])::uuid,'catalog'));

-- Auditoria basica das edicoes principais.
create table if not exists public.smart_business_audit (
 id bigint generated always as identity primary key,
 business_id uuid not null references public.smart_businesses(id) on delete cascade,
 actor_id uuid references auth.users(id) on delete set null,
 action text not null,
 occurred_at timestamptz not null default now()
);
alter table public.smart_business_audit enable row level security;
revoke all on public.smart_business_audit from anon;
grant select on public.smart_business_audit to authenticated;
create policy smart_business_audit_admin_read on public.smart_business_audit for select to authenticated using (public.is_portal_admin());

-- Controle operacional de assinaturas (sem processamento financeiro automatico).
create table if not exists public.smart_business_subscriptions(
 business_id uuid primary key references public.smart_businesses(id) on delete cascade,
 plan_name text not null default 'Manutencao multilink',
 monthly_amount numeric(10,2) not null default 15 check (monthly_amount>=0),
 status text not null default 'pending' check(status in ('pending','active','paused','cancelled')),
 due_day smallint check(due_day between 1 and 28),
 updated_at timestamptz not null default now()
);
alter table public.smart_business_subscriptions enable row level security;
revoke all on public.smart_business_subscriptions from anon;
grant select,insert,update,delete on public.smart_business_subscriptions to authenticated;
drop policy if exists smart_subscriptions_admin on public.smart_business_subscriptions;
create policy smart_subscriptions_admin on public.smart_business_subscriptions for all to authenticated
 using (public.is_portal_admin()) with check (public.is_portal_admin());

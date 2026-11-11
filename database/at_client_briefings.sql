
-- Alysson Tech: isolated client intake; does not modify AI Office's "briefings" table.
create table if not exists public.at_client_briefings (
  id uuid primary key,
  briefing_type text not null default 'filmmaker' check (briefing_type = 'filmmaker'),
  client_name text not null check (char_length(client_name) between 2 and 180),
  client_whatsapp text not null check (char_length(client_whatsapp) between 8 and 32),
  client_studio text not null default '' check (char_length(client_studio) <= 180),
  answers jsonb not null check (jsonb_typeof(answers) = 'object' and pg_column_size(answers) <= 35000),
  attachment_names text[] not null default '{}'::text[] check (cardinality(attachment_names) <= 8),
  status text not null default 'received' check (status in ('received', 'analysis', 'proposal', 'development', 'completed')),
  internal_notes text not null default '' check (char_length(internal_notes) <= 12000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists at_client_briefings_created_idx on public.at_client_briefings (created_at desc);

alter table public.at_client_briefings enable row level security;
revoke all on public.at_client_briefings from anon, authenticated;
grant insert (id, briefing_type, client_name, client_whatsapp, client_studio, answers, attachment_names) on public.at_client_briefings to anon, authenticated;
grant select, update on public.at_client_briefings to authenticated;

create policy at_client_briefings_public_insert on public.at_client_briefings for insert to anon,authenticated
  with check (
    status = 'received'
    and internal_notes = ''
    and created_at between (now() - interval '2 minutes') and (now() + interval '2 minutes')
    and updated_at between (now() - interval '2 minutes') and (now() + interval '2 minutes')
    and char_length(client_name) >= 2
  );

create policy at_client_briefings_admin_select on public.at_client_briefings for select to authenticated
  using (exists (
    select 1 from public.portal_members pm
    where pm.user_id = (select auth.uid()) and pm.role = 'admin' and pm.is_active = true
  ));

create policy at_client_briefings_admin_update on public.at_client_briefings for update to authenticated
  using (exists (
    select 1 from public.portal_members pm
    where pm.user_id = (select auth.uid()) and pm.role = 'admin' and pm.is_active = true
  ))
  with check (exists (
    select 1 from public.portal_members pm
    where pm.user_id = (select auth.uid()) and pm.role = 'admin' and pm.is_active = true
  ));

-- Private uploads. Original files aren't public URLs.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values (
  'at-client-briefings',
  'at-client-briefings',
  false,
  8388608,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']
)
on conflict (id) do nothing;

-- Owner-only permission check used from Storage INSERT RLS.
create schema if not exists at_private;
create or replace function at_private.can_upload_briefing_asset(object_name text)
returns boolean language sql stable security definer set search_path = ''
as $$
  select
    object_name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|heic|heif)$'
    and exists (
      select 1 from public.at_client_briefings b
      where b.id::text = split_part(object_name,'/',1)
        and b.created_at > now() - interval '24 hours'
        and cardinality(b.attachment_names) > 0
    )
    and (
      select count(*) from storage.objects o
      where o.bucket_id = 'at-client-briefings'
      and split_part(o.name, '/', 1) = split_part(object_name, '/', 1)
    ) < 8;
$$;
revoke all on function at_private.can_upload_briefing_asset(text) from public;
grant usage on schema at_private to anon, authenticated;
grant execute on function at_private.can_upload_briefing_asset(text) to anon, authenticated;

create policy at_client_briefing_upload_insert on storage.objects for insert to anon,authenticated
  with check (bucket_id = 'at-client-briefings' and at_private.can_upload_briefing_asset(name));

create policy at_client_briefing_media_admin_select on storage.objects for select to authenticated
  using (
    bucket_id = 'at-client-briefings'
    and exists (
      select 1 from public.portal_members pm
      where pm.user_id = (select auth.uid()) and pm.role = 'admin' and pm.is_active = true
    )
  );

create policy at_client_briefing_media_admin_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'at-client-briefings'
    and exists (
      select 1 from public.portal_members pm
      where pm.user_id = (select auth.uid()) and pm.role = 'admin' and pm.is_active = true
    )
  );

-- Rate-limit repeated submissions with the same contact, guarding accidental double clicks.
create or replace function at_private.check_briefing_submission_rate()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from public.at_client_briefings b
      where b.client_whatsapp = new.client_whatsapp and b.created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Limite temporário de envios para este número.';
  end if;
  return new;
end;
$$;
create trigger at_client_briefing_rate_trigger
  before insert on public.at_client_briefings
  for each row execute function at_private.check_briefing_submission_rate();

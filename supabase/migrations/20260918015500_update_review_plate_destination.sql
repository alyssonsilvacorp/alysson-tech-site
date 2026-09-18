create or replace function public.update_review_plate_destination(
  p_code text,
  p_destination_url text
)
returns table (
  code text,
  business_name text,
  destination_url text,
  status text,
  activated_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text;
  v_destination_url text;
  v_status text;
begin
  v_code := upper(trim(p_code));
  v_destination_url := trim(p_destination_url);

  if auth.uid() is null then
    raise exception 'Usuário não autenticado.'
      using errcode = '42501';
  end if;

  if not public.is_portal_admin() then
    raise exception 'Acesso restrito ao administrador do portal.'
      using errcode = '42501';
  end if;

  if v_code !~ '^AT-R[0-9]{3}$' then
    raise exception 'Código de placa inválido.';
  end if;

  if
    v_destination_url is null
    or v_destination_url = ''
    or v_destination_url !~* '^https://.+'
  then
    raise exception 'O destino precisa ser uma URL HTTPS válida.';
  end if;

  select rp.status
  into v_status
  from public.review_plates as rp
  where rp.code = v_code;

  if not found then
    raise exception 'Placa não encontrada.';
  end if;

  if v_status <> 'active' then
    raise exception 'Somente placas ativas podem ter o destino alterado.';
  end if;

  return query
  update public.review_plates as rp
  set
    destination_url = v_destination_url,
    updated_at = now()
  where rp.code = v_code
  returning
    rp.code,
    rp.business_name,
    rp.destination_url,
    rp.status,
    rp.activated_at,
    rp.created_at,
    rp.updated_at;
end;
$$;

revoke all
on function public.update_review_plate_destination(text, text)
from public;

grant execute
on function public.update_review_plate_destination(text, text)
to authenticated;

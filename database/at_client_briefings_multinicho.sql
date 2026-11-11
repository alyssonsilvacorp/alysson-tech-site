-- Evolução compatível: preserva briefings 'filmmaker' e habilita o briefing geral de sites.
alter table public.at_client_briefings
  drop constraint if exists at_client_briefings_briefing_type_check;
alter table public.at_client_briefings
  add constraint at_client_briefings_briefing_type_check
  check (briefing_type in ('filmmaker', 'website'));

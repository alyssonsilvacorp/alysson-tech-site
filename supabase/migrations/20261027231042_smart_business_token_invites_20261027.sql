
CREATE TABLE IF NOT EXISTS public.smart_business_invites (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
 business_id uuid NOT NULL REFERENCES public.smart_businesses(id) ON DELETE CASCADE,
 invited_email text NOT NULL,
 member_role text NOT NULL CHECK (member_role IN ('owner','editor','viewer')),
 can_edit_profile boolean NOT NULL DEFAULT false,
 can_edit_catalog boolean NOT NULL DEFAULT false,
 can_edit_payment boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT (now()+interval '14 days'),
 accepted_at timestamptz,
 created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS smart_business_invites_business_idx ON public.smart_business_invites(business_id,expires_at);
ALTER TABLE public.smart_business_invites ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.smart_business_invites FROM anon;
GRANT SELECT,INSERT,UPDATE ON public.smart_business_invites TO authenticated;
CREATE POLICY smart_business_invites_admin ON public.smart_business_invites
 FOR ALL TO authenticated USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());
CREATE OR REPLACE FUNCTION public.create_smart_business_invite(
 p_business_id uuid,p_email text,p_member_role text,
 p_can_edit_profile boolean DEFAULT true,p_can_edit_catalog boolean DEFAULT true,p_can_edit_payment boolean DEFAULT true
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_email text:=lower(trim(coalesce(p_email,'')));v_role text:=lower(trim(coalesce(p_member_role,'')));v_token uuid;
BEGIN
 IF (SELECT auth.uid()) IS NULL OR NOT public.is_portal_admin() THEN RAISE EXCEPTION 'Somente administradores podem convidar' USING errcode='42501'; END IF;
 IF v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR length(v_email)>254 THEN RAISE EXCEPTION 'E-mail invalido' USING errcode='22023'; END IF;
 IF v_role NOT IN ('owner','editor','viewer') THEN RAISE EXCEPTION 'Papel invalido' USING errcode='22023'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.smart_businesses WHERE id=p_business_id) THEN RAISE EXCEPTION 'Empresa nao encontrada'; END IF;
 INSERT INTO public.smart_business_invites(business_id,invited_email,member_role,can_edit_profile,can_edit_catalog,can_edit_payment,created_by)
 VALUES (p_business_id,v_email,v_role,v_role<>'viewer' AND coalesce(p_can_edit_profile,false),v_role<>'viewer' AND coalesce(p_can_edit_catalog,false),v_role<>'viewer' AND coalesce(p_can_edit_payment,false),(SELECT auth.uid()))
 RETURNING token INTO v_token;
 RETURN v_token;
END $$;
REVOKE ALL ON FUNCTION public.create_smart_business_invite(uuid,text,text,boolean,boolean,boolean) FROM public,anon;
GRANT EXECUTE ON FUNCTION public.create_smart_business_invite(uuid,text,text,boolean,boolean,boolean) TO authenticated;
CREATE OR REPLACE FUNCTION public.claim_smart_business_invite(p_token uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_uid uuid:=(SELECT auth.uid());v_email text;v_confirmed timestamptz;v_invite record;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Entre com sua conta antes de aceitar'; END IF;
 SELECT lower(u.email),u.email_confirmed_at INTO v_email,v_confirmed FROM auth.users u WHERE u.id=v_uid;
 IF v_confirmed IS NULL THEN RAISE EXCEPTION 'Confirme o e-mail da conta antes de aceitar o convite'; END IF;
 SELECT * INTO v_invite FROM public.smart_business_invites WHERE token=p_token AND accepted_at IS NULL AND expires_at>now() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Convite invalido ou expirado'; END IF;
 IF v_email IS DISTINCT FROM v_invite.invited_email THEN RAISE EXCEPTION 'Entre com o mesmo e-mail que recebeu o convite' USING errcode='42501'; END IF;
 INSERT INTO public.smart_business_members(business_id,user_id,member_role,can_edit_profile,can_edit_catalog,can_edit_payment,is_active)
 VALUES(v_invite.business_id,v_uid,v_invite.member_role,v_invite.can_edit_profile,v_invite.can_edit_catalog,v_invite.can_edit_payment,true)
 ON CONFLICT(business_id,user_id) DO UPDATE SET member_role=excluded.member_role,can_edit_profile=excluded.can_edit_profile,
 can_edit_catalog=excluded.can_edit_catalog,can_edit_payment=excluded.can_edit_payment,is_active=true;
 UPDATE public.smart_business_invites SET accepted_at=now() WHERE id=v_invite.id;
 INSERT INTO public.smart_business_audit(business_id,actor_id,action) VALUES(v_invite.business_id,v_uid,'invitation_accepted');
 RETURN v_invite.business_id;
END $$;
REVOKE ALL ON FUNCTION public.claim_smart_business_invite(uuid) FROM public,anon;
GRANT EXECUTE ON FUNCTION public.claim_smart_business_invite(uuid) TO authenticated;

# Control Center Alysson Tech — liberação segura (27/10/2026)

## Arquitetura e limites
- Site institucional: `/`; entrada administrativa: `/admin/login`.
- Administração interna: `/admin` e `/admin/{empresas,produtos,placas,catalogos,usuarios,assinaturas,configuracoes}`.
- Portal dos clientes: `/portal/login`, `/portal` e `/portal/update-password`.
- Supabase único da Alysson Tech: `nrfheiepvorvxgsjfubo`. O AI Office continua logicamente separado.
- Multilinks públicos existentes: `/p/otica-fenni` e `/p/barbearia-lima`.
- QR e NFC são inalteráveis no acesso do cliente: `/r/AT-R004`, `/r/AT-R007`.

## Permissões
- `portal_members.role = 'admin'`: gestão de clientes, placas, usuários, catálogos e assinaturas.
- `smart_business_members`: owner, editor, viewer, com flags edit_profile, edit_catalog, edit_payment.
- Cliente edita exclusivamente dados autorizados da própria empresa; não pode modificar identidade visual, o código físico, o destino da placa, assinaturas, outras empresas ou administradores.
- Verificar sempre autenticação no servidor, RLS e Storage; ocultar controles no frontend não é autorização.

## Estado atual da PR
- A PR #6 é uma implementação em draft, com novos módulos e uma migração SQL proposta.
- Não aplicar migração em produção sem inspeção de política RLS, backup dos registros e teste negativo entre empresas.
- Convites por e-mail dependem de chave privilegiada **somente no servidor**; jamais usar segredo em `NEXT_PUBLIC_`.
- A URL de redirecionamento `/portal/update-password` precisa ser permitida nas configurações de Auth.
- Mensalidades são registros administrativos; sem cobrança automática, suspensão automática ou cobrança Pix gerada pelo sistema.
- A linha Produtos e serviços é um catálogo institucional de módulos, não um ERP operacional dos outros projetos.

## Homologação obrigatória
1. CI: `npm run typecheck`, `npm run lint`, `npm run build`.
2. Testar login e saída administrativos; impedir usuário cliente e usuário não vinculado em `/admin` e `/admin/placas`.
3. Com duas contas independentes de teste (Fenni e Lima), confirmar que A não visualiza nem altera dados de B, inclusive catálogo desativado, Pix, ações, mídia e assinatura.
4. Como editor, editar contatos, descrição, Pix, itens do catálogo e fotos; confirmar atualização do multilink público.
5. Como viewer, comprovar que nenhuma atualização/exclusão é aceita pelo banco mesmo por chamada manual.
6. Verificar preço `NULL`: item permanece público com “sob consulta”/sem valor explícito; com preço preenchido, aparecer no catálogo.
7. Validar adicionar, editar, ocultar, marcar vendido, reativar e excluir item com confirmação.
8. Testar bloqueio de upload fora do prefixo de pasta UUID da empresa; MIME não permitido e arquivo maior que 3 MB.
9. Validar convite, redefinição de senha, expiração do link, e-mail existente e revogação de acesso.
10. Confirmar que ambas rotas permanentes continuam ativas e que os multilinks usam os dados reais.
11. Conferir responsividade e leitura no iPhone e desktop.
12. Após testes, revisar migração, variáveis do servidor, RLS e somente então integrar a `main` / publicar.

## Dados preservados
- Ótica Fenni: AT-R004, multilink e catálogo original.
- Barbearia Lima: AT-R007, identidade preto/dourado, Pix confirmado, atendimento por ordem de chegada e mídias reais.
- Não regravar QR/NFC nem redesenhar artes físicas já aprovadas.

## Fases comerciais posteriores
- Control Center: cadastro de produtos/serviços, contratos e faturamento recorrente interno, inicialmente manual.
- Integrações: links para IZALY Food/Platform, Prospect, AI Office, LS Log e suporte TI conforme disponibilidade real e permissões; não migrar bases de dados de outros clientes inadvertidamente.

# IZALY Catálogos — integração única ao Control Center

## Escopo e invariantes
- Um cadastro de empresa em `public.smart_businesses` alimenta Multilink e catálogo.
- Identidade visual única: logo, sigla, WhatsApp, categoria e quatro cores extraídas da logo e revisáveis.
- Produtos existentes permanecem em `public.smart_business_services`. Não sincronizar cópias dos mesmos produtos em duas tabelas.
- Status do Multilink e do catálogo são independentes. O Multilink pode não existir ou estar em rascunho enquanto seu catálogo está publicado.
- Rota canônica: `/p/{slug}/catalogo` (sem deploy por cliente); código de redirecionamento opcional `/c/AT-C001` a `/c/AT-C100`. Preservar integralmente `/r/AT-R001..100` para placas físicas.
- O Multilink Fenni muda seu CTA para a rota canônica somente **depois** da publicação aprovada. Até lá continua com catálogo embutido.
- Não usar HTML arbitrário no mesmo domínio que hospeda painel administrativo. HTML exportado permanece somente como backup/artefato opcional.
- Não ativar cobrança automática nem inventar preços, frete, disponibilidade, fotos ou WhatsApp.

## Implementado nesta branch

**Estado do banco:** a migration aditiva foi aplicada ao Supabase Alysson Tech com versão 20261031061132, após validações RLS positivas/negativas em transações revertidas. Todos os 100 códigos de catálogo estão disponíveis e nenhum catálogo está publicado. Código Next.js continua na PR Draft e NÃO foi publicado no domínio oficial.
- Migration aditiva com 100 aliases distintos e RLS por empresa/admin.
- Cadastro de empresa ampliado: logo, paleta derivada, sigla, segmento, WhatsApp.
- Editor de catálogo único: produto, SKU, categoria, preço opcional, descrição, variações, imagem, lista rápida, fotos em lote com compressão, bairros e taxas, entrega/retirada, pré-visualização e publicação.
- Vitrine Next.js com busca, categorias, detalhe, variantes, consulta individual do produto e carrinho com checkout WhatsApp. Sem pagamento nem estoque automático.
- Multilink Fenni e genérico reconhecem catálogo publicado, sem duplicação da galeria da Fenni.
- Aliases AT-C livres/reservados independentemente de AT-R.

## Limites e pendências antes de homologar
- Importação .xlsx/.csv/.pdf assistida do gerador original ainda deve ser portada/validada; não prometer essa função nesta fase (apenas cadastro rápido via lista).
- Upload de lote associa por nome exato de SKU/produto, com revisão das associações não encontradas. O Supabase Fenni já contém 32 URL de imagens, ainda sem confirmação visual de autenticidade neste fluxo.
- Fluxo de carrinho com WhatsApp deve ser testado com número real e produtos de teste; nunca enviar pedidos de demonstração a clientes sem aprovação.
- O gerador atual vive em outro projeto Vercel; **não** redirecionar usuários ou remover projeto antes da substituição validada.
- Homologar visual e funcionalidade em iPhone, Android e desktop, bem como imports maiores, acessibilidade e textos de frete.
- Testar RLS negativa: anônimo não lê rascunhos; cliente Fenni não altera dados Lima; viewer não publica; publicação/pausa respeita status.
- Confirmar comportamento de cache e redirecionamentos e fazer backups antes da migração de produção.
- Não publicar a Fenni até confirmar WhatsApp, imagens reais e identidade; não migrar placeholders do HTML de demonstração.

## Ordem de implantação
1. Validar CI/Next e migração em transação com ROLLBACK.
2. Migração aditiva aplicada com sucesso; validar novamente a integridade antes de uso real.
3. Testar admin e storefront em preview e verificar rotas Fenni/Lima anteriores.
4. Criar catálogo em rascunho Fenni usando os 32 registros existentes, preencher dados reais.
5. Publicar um catálogo piloto validado e verificar o clique no Multilink, checkout e consulta individual por WhatsApp.
6. Migrar importações restantes e aprovar uso do módulo no processo comercial de Black Friday.

A única implantação Next.js está em `alyssonsilvacorp/alysson-tech-site`; o projeto do gerador independente não recebe novo deploy.

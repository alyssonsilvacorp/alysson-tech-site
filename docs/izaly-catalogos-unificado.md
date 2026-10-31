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

**Estado do banco:** as migrations aditivas 20261031061132 e 20261031062838 foram aplicadas ao Supabase Alysson Tech após testes de RLS e correspondência de numeração. Existem 100 códigos AT-C disponíveis, catálogo de demonstração nenhum publicado; Ótica Fenni marcada para preparação, não publicação. Código Next.js ainda está na PR Draft até revisão de CI e smoke.
- Migration aditiva com 100 aliases distintos e RLS por empresa/admin.
- Cadastro de empresa ampliado: logo, paleta derivada, sigla, segmento, WhatsApp.
- Editor de catálogo único: produto, SKU, categoria, preço opcional, descrição, variações, imagem, lista rápida, fotos em lote com compressão, bairros e taxas, entrega/retirada, pré-visualização e publicação.
- Vitrine Next.js com busca, categorias, detalhe, variantes, consulta individual do produto e carrinho com checkout WhatsApp. Sem pagamento nem estoque automático.
- Multilink Fenni e genérico reconhecem catálogo publicado, sem duplicação da galeria da Fenni.
- Aliases AT-C livres/reservados independentemente de AT-R.

## Cadastro opcional e numeração
- Campo **Ter catálogo? Sim/Não** no cadastro da empresa. Não oculta nem altera a publicação do Multilink.
- Ao salvar **Sim**, abrir a edição em `/admin/catalogos?business={id}`. Cadastro de produtos não é necessário com **Não**.
- Atribuição preferencial conforme placa vinculada: `AT-R004` → `AT-C004`, exposto ao público também em `/c/CT-004`. Caso o número já esteja ocupado, usa o primeiro código livre e informa o código efetivamente atribuído.
- Final do fluxo: **Testar catálogo** (prévia admin), **Publicar**, **Visualizar link publicado**, **Pausar** e **Excluir catálogo** (remove configuração; preserva empresa, produtos e placa).
- Importação já disponível: **CSV padrão (compatível com Excel)**, cabeçalho `SKU;Nome;Categoria;Preço;Descrição;Disponibilidade`, até 300 produtos por arquivo; verificação de SKU duplicado. Fotografias até 30 por lote por correspondência de SKU, processadas em JPEG quando suportadas pelo navegador.

## Limites e pendências antes de homologar
- Importação CSV padrão implementada; **.xlsx nativo e PDF** ainda requerem portabilidade do gerador original/QA. No Excel, exportar CSV UTF-8 antes de importar.
- Fotos HEIC/HEIF e outros formatos dependem do decodificador do navegador; quando não decodificados, o usuário precisará convertê-las para JPEG/PNG.
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

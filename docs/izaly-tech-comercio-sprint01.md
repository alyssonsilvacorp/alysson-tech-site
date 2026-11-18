# IZALY TECH — SPRINT 01: CATÁLOGO NO DOMÍNIO ALYSSON TECH

Estado: proposta funcional em branch de Preview. Não há deploy de produção, alteração de banco nem ativação de pagamentos nesta sprint.

## Objetivo aprovado
- Menus públicos: `/p/izaly-tech`; catálogo: `/p/izaly-tech/catalogo`; carrinho: `/p/izaly-tech/carrinho`.
- Gestão: `/admin/izaly-tech`, reutilizando a autenticação Supabase da Alysson Tech e o editor `UnifiedCatalogManager`, restrito a `slug=izaly-tech`.
- Vitrine sem login para clientes; catálogo real e publicado somente após validação de produtos e WhatsApp.
- Atendimento inicial Maceió/AL; retirada/entrega de acordo com configurações verificadas. Não prometer valores de entrega não cadastrados.
- Carrinho no navegador para facilitar navegação; a moeda e os preços exibidos sempre vêm dos produtos da consulta pública, nunca do localStorage.
- Pedido inicial: apenas solicitação via WhatsApp; não significa compra paga nem estoque reservado.

## Reaproveitamento
- Usar **smart_businesses**, **smart_business_services**, **smart_catalog_settings** e **smart_catalog_delivery_zones** da infraestrutura atual.
- Administrador: `portal_members` com role admin e is_active; a proteção definitiva de escrita depende das políticas RLS já existentes no banco.
- Nenhum produto demonstrativo do ZIP da Netlify é migrado como estoque real.
- O site Netlify antigo permanece intacto como arquivo/backup, sem ser o destino do CTA da Tech.

## Pré-condição para ativação do catálogo real
1. Confirmar qual é o Supabase associado às variáveis da Vercel **sem expor as chaves**.
2. Inspecionar as políticas RLS existentes; confirmar que admin consegue editar apenas no contexto autorizado.
3. Conferir se a empresa `izaly-tech` existe. Se não existir, criar em **rascunho** com `has_catalog=true`, imagem logo real, WhatsApp verificado e área Maceió; sem divulgação pública ainda.
4. Validar produto por produto: fotos, preço, SKU, disponibilidade e estoque real se houver controle (a tabela atual não oferece reserva transacional de estoque).
5. Validar o fluxo WhatsApp em uma conversa de teste. Somente após aprovação publicar `smart_catalog_settings.status=published`.
6. Testar login, negação a usuários sem role admin, produtos e RLS por empresa, carrinho, celular e reabertura da sacola.
7. Revisar QR/NFC e demais rotas Fenni/Lima para regressões. Não alterar esses registros.

## Segurança e pagamento (etapas futuras, NÃO implementadas)
- Não usar credenciais estáticas, login no JavaScript ou `localStorage` como sessão administrativa.
- Não expor preço de custo, credenciais ou margens no frontend.
- Não criar status `paid` por retorno de navegador/cliente ou mensagem manual.
- Com Mercado Pago ou InfinitePay, registrar `orders` e `order_items` em servidor, calcular total no backend, gerar link por pedido, validar webhook e idempotência, confirmar identidade da transação e só então liberar `paid`.
- Configurar estoque confiável, retenção de pedidos e dados pessoais antes de habilitar checkout financeiro.
- Nenhum segredo, provedor de cobrança, migration ou banco foram acionados neste trabalho.

## Auditoria do material antigo
- Origem: ZIP exportado do Netlify Tech, preservado no pacote de recuperação 18/11/2026.
- Catálogo antigo: armazenamento local, autenticação insegura no JS e 12 produtos exemplificativos; não reutilizar credenciais legadas.
- A nova gestão será uma área do domínio Alysson Tech com autenticação Supabase e RLS. O acesso administrativo da loja Netlify não será carregado aqui.

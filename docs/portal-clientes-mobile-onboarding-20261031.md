# Portal de clientes, convite e QA mobile — piloto Fenni

## Estado verificado (31/10/2026)
- Duas empresas existentes no Supabase Alysson Tech: Ótica Fenni (Multilink ativo, catálogo habilitado porém **não publicado**) e Barbearia Lima (Multilink ativo, catálogo não contratado/ativado).
- Nenhum acesso de cliente vinculado e nenhum convite pendente no momento da auditoria. Não alegar que login real foi homologado sem convite/e-mail real.
- Placas e destinos não são modificados por este trabalho. A rota pública de catálogo `/p/otica-fenni/catalogo` só passa a funcionar após publicação do catálogo no Control Center.
- Ao publicar um catálogo, o Multilink usará o link independente automaticamente pelo campo `catalogUrl`. Nenhum novo deploy é necessário para alterar produtos, imagens, preço ou Pix.
- Mensalidades de parcerias-piloto permanecem **manuais**, sem criação de recorrência ou valor automático.

## Configuração Auth obrigatória antes do primeiro convite real
No Dashboard Supabase do projeto Alysson Tech: Authentication > URL Configuration.

Site URL: `https://alyssontech.com.br`.

Adicionar à lista de **Redirect URLs** (sem liberar URLs arbitrárias):
- `https://alyssontech.com.br/portal/convite/**`
- `https://alyssontech.com.br/portal/update-password`
- `https://alyssontech.com.br/portal/login`
- Se o domínio www não redirecionar automaticamente: `https://www.alyssontech.com.br/portal/convite/**` e `https://www.alyssontech.com.br/portal/update-password`

Esta ferramenta não fornece uma operação para ler/alterar a URL Configuration. **A configuração não foi comprovadamente salva no Auth**; verificar no dashboard antes de convidar clientes.

## Operação segura (sem convite por API privilegiada)
1. Control Center → Empresas: cadastrar a empresa, configurar identidade e Multilink e habilitar catálogo se contratado.
2. Catálogos: incluir os produtos e definir se serão exibidos; testar em pré-visualização. Só o administrador publica após revisão.
3. Usuários e acessos: selecionar a empresa, informar **e-mail real** do proprietário, conceder papel e escopos, gerar o link exclusivo de 14 dias e preparar e-mail no aplicativo de e-mail. O sistema **não envia e-mails automaticamente** nesta versão.
4. O cliente abre o link, cria senha com no mínimo 10 caracteres, confirma o e-mail e retorna ao link de convite. O vínculo só é concluído com o mesmo endereço confirmado.
5. Depois ele acessa `https://alyssontech.com.br/portal/login` e vê somente os dados da empresa autorizada.
6. Portal: editar contatos e Pix conforme permissões; adicionar produto, trocar foto, preço e SKU, informar público/tipo ou criar um novo; marcar como vendido/oculto sem excluir permanentemente.
7. Quando o catálogo estiver publicado, as alterações de produtos e categorias tornam-se visíveis sem publicar HTML nem executar novo deploy.

## Homologação obrigatória (não foi executada com credenciais reais)
- Enviar **um convite de teste controlado** para um endereço real; confirmar o e-mail, autenticar e aceitar.
- Validar senhas, expiração (14 dias), conta de e-mail diferente e tentativas com link já aceito.
- Testar perfil com apenas catálogo, apenas Pix e perfil de visualização.
- Com duas contas de teste distintas, tentar ler/editar dados da empresa vizinha e confirmar o bloqueio RLS.
- Testar: trocar foto, nome, preço e tipo; criar categoria; marcar esgotado; reativar; conferir o Multilink/catalogo público após publicação.
- Testar redefinição de senha por e-mail e retorno correto ao portal.
- Testar todos os fluxos da sacola, consulta e WhatsApp **sem enviar mensagens reais involuntárias**.

## Matriz de mobile
- iOS Safari: 320 × 568, 375 × 667, 390 × 844 e 430 × 932.
- Android Chrome: 360 × 740, 393 × 851 e 412 × 915.
- Em cada viewport: verificar largura sem rolagem horizontal, logotipo, abas Produtos/Contato, banner completo, categorias, busca, fotos e CTA, sacola, seleção de entrega/retirada, foco do teclado, endereço, subtotal e WhatsApp.
- CSS foi reforçado para responsividade e a CI valida TypeScript/lint/build; **isso não substitui um teste visual no Safari e Chrome reais**.
- Entrega só fica disponível se habilitada e com pelo menos uma área de entrega ativa. A Fenni ainda não possui essas configurações.
- Classificação automática por análise da **foto** ainda não está disponível; público e tipo são informados/confirmados pelo responsável. Integrar IA posteriormente com revisão humana, evitando categorias incorretas.

## Expansão
O catálogo premium da Fenni é o piloto visual. A implantação de outras empresas deve esperar homologação operacional, login real e aprovação do cliente. A escala deve usar o mesmo template e tabelas multiempresa com RLS, sem copiar HTML nem reservar rotas de placa para catálogo.

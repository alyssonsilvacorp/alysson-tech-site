export type SiteField = {
  id: string;
  label: string;
  type?: "text" | "textarea" | "single" | "multi";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  showWhen?: { id: string; equals: string };
};

export type SiteStep = {
  title: string;
  eyebrow: string;
  description: string;
  fields: SiteField[];
};

export const SITE_NICHES = [
  { id: "services", name: "Prestador de serviços", desc: "Negócios locais e profissionais" },
  { id: "beauty", name: "Barbearia e beleza", desc: "Salões, estética e bem-estar" },
  { id: "health", name: "Clínica e saúde", desc: "Clínicas, consultórios e especialidades" },
  { id: "optics", name: "Ótica", desc: "Óculos, lentes e atendimento" },
  { id: "restaurant", name: "Restaurante e delivery", desc: "Cardápios e pedidos" },
  { id: "retail", name: "Loja e comércio", desc: "Vitrines e produtos" },
  { id: "realestate", name: "Imobiliária", desc: "Imóveis e captação" },
  { id: "filmmaker", name: "Filmmaker e fotografia", desc: "Portfólio audiovisual" },
  { id: "events", name: "Eventos e entretenimento", desc: "Cobertura, ingressos e eventos" },
  { id: "education", name: "Cursos e educação", desc: "Treinamentos e matrículas" },
  { id: "other", name: "Outro segmento", desc: "Qualquer atividade ou projeto" },
] as const;

export function siteNicheLabel(niche: string): string {
  return SITE_NICHES.find(item => item.id === niche)?.name ?? "Outro segmento";
}

const industryFields: Record<string, SiteField[]> = {
  services: [
    { id: "niche_services", label: "Quais serviços são mais procurados?", type: "textarea", required: true, placeholder: "Liste os serviços principais e como funcionam." },
    { id: "niche_area", label: "Você atende no estabelecimento, a domicílio ou online?", type: "multi", options: ["No local", "A domicílio", "Online", "Outras cidades"] },
    { id: "niche_quotes", label: "Como recebe pedidos de orçamento hoje?", type: "single", options: ["WhatsApp", "Telefone", "Presencial", "Formulário", "Outros"] },
  ],
  beauty: [
    { id: "niche_services", label: "Quais procedimentos e serviços oferece?", type: "textarea", required: true, placeholder: "Cortes, barba, manicure, tratamentos, estética etc." },
    { id: "niche_booking", label: "Como os clientes agendam?", type: "single", required: true, options: ["WhatsApp", "Agenda online", "Telefone", "Por ordem de chegada", "Ainda não organizo agendamentos"] },
    { id: "niche_team", label: "Deseja mostrar profissionais, horários e valores?", type: "multi", options: ["Equipe", "Horários", "Preços", "Antes e depois", "Avaliações de clientes"] },
  ],
  health: [
    { id: "niche_specialties", label: "Quais serviços ou especialidades a clínica oferece?", type: "textarea", required: true, placeholder: "Informe apenas os serviços oferecidos, sem dados de pacientes." },
    { id: "niche_booking", label: "Como os pacientes devem solicitar agendamento?", type: "single", required: true, options: ["WhatsApp", "Telefone", "Sistema externo", "Formulário de solicitação", "Não desejo agendamento pelo site"] },
    { id: "niche_professionals", label: "Quer mostrar profissionais, convênios e unidades?", type: "multi", options: ["Profissionais e registros", "Convênios aceitos", "Endereços", "Preparos e orientações", "Perguntas frequentes"] },
    { id: "niche_healthnote", label: "Há exigências de comunicação ou revisão profissional?", type: "textarea", placeholder: "Informe orientações da sua área profissional; não envie prontuários ou dados sensíveis." },
  ],
  optics: [
    { id: "niche_products", label: "Quais produtos deseja destacar?", type: "textarea", required: true, placeholder: "Armações, lentes, solares, marcas e categorias." },
    { id: "niche_storemodel", label: "Como será o atendimento para cada produto?", type: "single", required: true, options: ["Vitrine e WhatsApp", "Loja virtual com pagamento", "Reserva para provar na loja", "Orçamento personalizado"] },
    { id: "niche_catalog", label: "Já possui catálogo com fotos e preços?", type: "single", options: ["Sim, completo", "Parcial", "Ainda não"] },
  ],
  restaurant: [
    { id: "niche_foodmodel", label: "Como funciona sua operação?", type: "multi", required: true, options: ["Salão e mesas", "Delivery", "Retirada", "Reservas", "Eventos"] },
    { id: "niche_menu", label: "O que o site deve permitir em relação ao cardápio?", type: "single", required: true, options: ["Apenas mostrar produtos", "Pedidos por WhatsApp", "Pedidos pelo próprio site", "QR Code nas mesas", "Quero orientação"] },
    { id: "niche_payments", label: "Como pretende receber pagamentos?", type: "multi", options: ["Pix", "Cartão online", "Na entrega", "No caixa", "Ainda não sei"] },
  ],
  retail: [
    { id: "niche_products", label: "O que sua loja vende e quais categorias possui?", type: "textarea", required: true, placeholder: "Produtos, linhas, marcas e categorias." },
    { id: "niche_storemodel", label: "Como deseja concluir a venda?", type: "single", required: true, options: ["Catálogo com WhatsApp", "Checkout e pagamento online", "Retirada na loja", "Apenas apresentação dos produtos"] },
    { id: "niche_stock", label: "Você precisa controlar estoque e entrega?", type: "multi", options: ["Estoque", "Frete", "Retirada", "Cupons", "Não preciso"] },
  ],
  realestate: [
    { id: "niche_properties", label: "Quais tipos de imóveis divulga?", type: "multi", required: true, options: ["Venda", "Aluguel", "Temporada", "Comercial", "Lançamentos", "Terrenos"] },
    { id: "niche_filters", label: "Quais filtros devem existir no catálogo?", type: "multi", options: ["Bairro", "Preço", "Quartos", "Tipo", "Vagas", "Finalidade"] },
    { id: "niche_management", label: "Quem adicionará e atualizará os imóveis?", type: "single", options: ["Corretor", "Equipe", "Alysson Tech", "Ainda não sei"] },
  ],
  filmmaker: [
    { id: "niche_films", label: "Que tipos de produção você realiza?", type: "multi", required: true, options: ["Casamentos", "Eventos", "Comerciais", "Videoclipes", "Reels", "Drone", "Fotografia"] },
    { id: "niche_portfolio", label: "Links de 3 a 6 produções para destacar", type: "textarea", placeholder: "YouTube, Vimeo, Instagram ou pasta compartilhada." },
    { id: "niche_visual", label: "Como imagina a apresentação dos vídeos?", type: "single", options: ["Vídeo na abertura", "Galeria por categoria", "Projetos em destaque", "Quero orientação"] },
  ],
  events: [
    { id: "niche_events", label: "Que eventos ou serviços você organiza?", type: "textarea", required: true, placeholder: "Shows, festas, cerimonial, produção, locações etc." },
    { id: "niche_tickets", label: "O site precisa vender ingressos ou receber reservas?", type: "single", options: ["Ingressos", "Reservas", "Solicitações de orçamento", "Somente divulgação"] },
    { id: "niche_calendar", label: "Deseja calendário, atrações ou galeria de eventos passados?", type: "multi", options: ["Agenda", "Atrações", "Galeria", "Patrocinadores", "Mapa do local"] },
  ],
  education: [
    { id: "niche_courses", label: "Quais cursos, aulas ou treinamentos oferece?", type: "textarea", required: true, placeholder: "Cursos, público, duração e modalidades." },
    { id: "niche_enrollment", label: "Como devem funcionar as inscrições?", type: "single", required: true, options: ["WhatsApp", "Formulário de interesse", "Matrícula e pagamento online", "Sistema externo"] },
    { id: "niche_school", label: "Quer apresentar grade, professores e depoimentos?", type: "multi", options: ["Conteúdo programático", "Professores", "Depoimentos", "Turmas", "Certificados"] },
  ],
  other: [
    { id: "niche_other_description", label: "Explique sua atividade e o que o site deve apresentar", type: "textarea", required: true, placeholder: "Conte o que faz, o que deseja destacar e como o cliente compra ou contrata." },
    { id: "niche_other_actions", label: "Qual ação espera do visitante?", type: "multi", options: ["Chamar no WhatsApp", "Solicitar orçamento", "Agendar", "Comprar", "Enviar formulário", "Outra"] },
  ],
};

export function getSiteSteps(niche: string): SiteStep[] {
  return [
    {
      eyebrow: "01 / EMPRESA",
      title: "Vamos conhecer seu negócio.",
      description: "As primeiras respostas ajudam a personalizar as próximas perguntas.",
      fields: [
        { id: "business", label: "Nome da empresa ou marca", required: true, placeholder: "Ex.: Ótica Fenni, Studio Belas, Oficina Central" },
        { id: "contact", label: "Nome da pessoa responsável", required: true, placeholder: "Seu nome" },
        { id: "whatsapp", label: "WhatsApp para contato", required: true, placeholder: "(82) 99999-9999" },
        { id: "niche", label: "Qual é o segmento do negócio?", required: true, type: "single", options: SITE_NICHES.map(item => item.id) },
        { id: "custom_niche", label: "Qual é o segmento?", required: true, showWhen: { id: "niche", equals: "other" }, placeholder: "Descreva seu nicho ou setor" },
        { id: "city", label: "Onde sua empresa atende?", required: true, placeholder: "Cidade, região ou atendimento online" },
        { id: "instagram", label: "Instagram ou rede social profissional", placeholder: "@suaempresa" },
        { id: "current_site", label: "Já possui site ou domínio?", placeholder: "Link ou informe que ainda não possui" },
      ],
    },
    {
      eyebrow: "02 / OBJETIVO",
      title: "O que o site precisa resolver?",
      description: "Vamos definir o resultado esperado e o público-alvo.",
      fields: [
        { id: "main_goal", label: "Qual é o objetivo principal?", required: true, type: "single", options: ["Conseguir clientes e orçamentos", "Fortalecer a marca", "Mostrar produtos ou serviços", "Vender pela internet", "Receber agendamentos", "Mostrar trabalhos e portfólio", "Outro objetivo"] },
        { id: "offers", label: "Quais produtos ou serviços precisam aparecer?", required: true, type: "textarea", placeholder: "Descreva os principais produtos, serviços ou experiências." },
        { id: "audience", label: "Quem é seu cliente ideal?", required: true, placeholder: "Ex.: moradores da região, noivos, pequenas empresas" },
        { id: "differential", label: "O que torna sua empresa diferente?", type: "textarea", placeholder: "Experiência, qualidade, atendimento, localização..." },
        { id: "primary_action", label: "O que o visitante deve fazer no site?", required: true, type: "single", options: ["Chamar no WhatsApp", "Pedir orçamento", "Agendar", "Comprar", "Ver catálogo/portfólio", "Preencher formulário"] },
      ],
    },
    {
      eyebrow: "03 / SEU SEGMENTO",
      title: siteNicheLabel(niche) === "Outro segmento" ? "Conte como funciona seu negócio." : "Perguntas para " + siteNicheLabel(niche).toLowerCase() + ".",
      description: "Aqui as perguntas mudam conforme a área de atuação escolhida.",
      fields: industryFields[niche] ?? industryFields.other,
    },
    {
      eyebrow: "04 / IDENTIDADE",
      title: "Qual aparência combina com sua marca?",
      description: "Agora vamos reunir referências, imagens e conteúdo para criar o visual.",
      fields: [
        { id: "brand_assets", label: "Já possui logotipo e identidade visual?", required: true, type: "single", options: ["Sim, tenho tudo", "Tenho só logotipo", "Ainda não tenho"] },
        { id: "site_style", label: "Qual estilo de site você prefere?", required: true, type: "single", options: ["Moderno e minimalista", "Premium e elegante", "Escuro e impactante", "Claro e acolhedor", "Colorido e criativo", "Quero orientação"] },
        { id: "brand_colors", label: "Quais são as cores da marca?", placeholder: "Ex.: vinho e bege; azul e branco..." },
        { id: "references", label: "Links de sites que você gosta", type: "textarea", placeholder: "Um link por linha (opcional)" },
        { id: "content_links", label: "Links do portfólio, catálogo ou materiais existentes", type: "textarea", placeholder: "Drive, Instagram, vídeos, catálogo, site atual..." },
        { id: "available_media", label: "Que materiais já possui?", type: "multi", options: ["Logotipo", "Fotos da empresa", "Fotos de produtos", "Vídeos", "Depoimentos", "Textos", "Ainda preciso organizar"] },
      ],
    },
    {
      eyebrow: "05 / FUNCIONALIDADES",
      title: "O que o site precisa ter?",
      description: "As respostas definem o escopo, as integrações e a proposta comercial.",
      fields: [
        { id: "pages", label: "Quais páginas ou seções deseja?", type: "multi", required: true, options: ["Início", "Sobre nós", "Serviços", "Produtos / catálogo", "Portfólio", "Depoimentos", "Contato", "Localização", "Blog", "Quero orientação"] },
        { id: "features", label: "Quais funcionalidades são importantes?", type: "multi", required: true, options: ["Botão WhatsApp", "Formulário", "Google Maps", "Agendamento", "Pagamento online", "Pedido / orçamento", "Galeria", "Integração Instagram", "SEO / aparecer no Google", "Outra"] },
        { id: "manage", label: "Quer poder atualizar o conteúdo sozinho?", required: true, type: "single", options: ["Sim, quero painel", "Não, prefiro solicitar alterações", "Quero avaliar o custo"] },
        { id: "manage_items", label: "O que gostaria de editar no painel?", type: "multi", showWhen: { id: "manage", equals: "Sim, quero painel" }, options: ["Fotos", "Produtos", "Preços", "Serviços", "Textos", "Agendamentos", "Pedidos", "Equipe"] },
        { id: "integrations", label: "Já utiliza sistemas que precisam ser integrados?", placeholder: "Ex.: agenda, ERP, CRM, loja virtual, ferramenta de pagamentos..." },
        { id: "deadline", label: "Existe uma data desejada de entrega?", placeholder: "Ex.: antes de dezembro ou sem data definida" },
        { id: "budget", label: "Já tem uma faixa de investimento em mente? (opcional)", type: "single", options: ["Até R$ 500", "R$ 500–1.000", "R$ 1.000–2.000", "Acima de R$ 2.000", "Prefiro receber uma proposta"] },
        { id: "notes", label: "Mais alguma informação importante?", type: "textarea", placeholder: "Requisitos, dúvidas, preferências ou observações..." },
      ],
    },
  ];
}

export type ProjectTone = "food" | "crm" | "tech" | "joias";

export type PortfolioProject = {
  name: string;
  eyebrow: string;
  description: string;
  status: string;
  tone: ProjectTone;
  href?: string;
  linkLabel?: string;
};

export const izalyPlatform = {
  name: "IZALY Platform",
  eyebrow: "Tecnologia própria",
  description:
    "Uma plataforma modular criada pela Alysson Tech para reunir soluções de gestão em um mesmo ecossistema e permitir que diferentes tipos de negócio utilizem apenas os recursos que fazem sentido para sua operação.",
  status: "Plataforma em evolução",
  href: "https://izaly-platform.vercel.app/",
  linkLabel: "Conhecer a plataforma",
  modules: [
    {
      name: "IZALY Food",
      status: "Implantação piloto",
    },
    {
      name: "IZALY CRM",
      status: "Beta em desenvolvimento",
    },
  ],
} as const;

export const clientProjects = [
  {
    client: "LS Log",
    category: "Sistema personalizado",
    title: "Portal de Motoristas e Gestão Operacional",
    status: "Em desenvolvimento",
    description:
      "Projeto desenvolvido a partir das necessidades da operação da LS Log, com áreas e acessos pensados para diferentes perfis envolvidos na rotina da empresa.",
    note: "Projeto em desenvolvimento. O case completo será apresentado após a evolução da implantação.",
  },
] as const;

export const vitalyonProject = {
  name: "VITALYON",
  eyebrow: "Produto digital",
  description:
    "Uma experiência digital voltada ao bem-estar e ao treino, com acesso online e uma jornada simples para o usuário.",
  status: "Publicado e funcional",
  href: "https://vitalyon-app.vercel.app/",
  linkLabel: "Ver projeto",
} as const;

export const ownProjects: PortfolioProject[] = [
  {
    name: "IZALY Food",
    eyebrow: "Gestão para alimentação",
    description:
      "O primeiro módulo lançado da IZALY Platform, criado para apoiar cardápio, pedidos e a rotina de pequenos estabelecimentos.",
    status: "Implantação piloto",
    tone: "food",
    href: "https://izaly-platform.vercel.app/",
    linkLabel: "Conhecer a plataforma",
  },
  {
    name: "IZALY CRM",
    eyebrow: "Relacionamento comercial",
    description:
      "Uma solução para organizar clientes, oportunidades e negociações em um fluxo mais simples, claro e acompanhável.",
    status: "Beta em desenvolvimento",
    tone: "crm",
  },
  {
    name: "IZALY Tech",
    eyebrow: "Site-vitrine",
    description:
      "Presença digital para apresentar tecnologia e eletrônicos com uma comunicação direta e orientada ao contato.",
    status: "Publicado",
    tone: "tech",
    href: "https://izalytech.netlify.app/",
    linkLabel: "Visitar projeto",
  },
  {
    name: "IZALY Joias",
    eyebrow: "Experiência de marca",
    description:
      "Uma vitrine digital que valoriza produtos, identidade visual e o caminho entre descoberta e atendimento.",
    status: "Publicado",
    tone: "joias",
    href: "https://izalyjoias.netlify.app/",
    linkLabel: "Visitar projeto",
  },
];

// Projetos e produtos apresentados publicamente pela Alysson Tech.
// Produtos pausados/antigos não são oferecidos como parte da vitrine comercial.
export const izalyPlatform = {
  name: "IZALY Platform",
  eyebrow: "Ecossistema criado pela Alysson Tech",
  description:
    "A IZALY Platform é o ecossistema de produtos digitais criado pela Alysson Tech. O IZALY Food atende operações de alimentação e o IZALY CRM AI oferece uma experiência própria de atendimento e relacionamento, com páginas independentes e uma marca-mãe em comum.",
  status: "Ecossistema em evolução",
  href: "https://izaly-platform.vercel.app/",
  linkLabel: "Conhecer o ecossistema",
  modules: [
    { name: "IZALY Food", status: "Piloto ativo" },
    { name: "IZALY CRM AI", status: "Em evolução" },
  ],
} as const;

export const izalyCrmAi = {
  name: "IZALY CRM AI",
  href: "https://izaly-crm-ai-piloto.vercel.app/",
  linkLabel: "Conhecer o IZALY CRM AI",
  status: "Piloto em evolução",
} as const;

export const clientProjects = [
  {
    client: "LS Log",
    category: "Sistema personalizado",
    title: "Portal de Motoristas e Gestão Operacional",
    status: "Projeto entregue",
    description:
      "Sistema operacional desenvolvido e entregue para a LS Log, com portal de motoristas e gestão por perfis. A utilização em campo depende do cliente.",
    note: "Entrega realizada. Aguardando retorno do cliente sobre utilização e validação operacional.",
    href: "https://llslog.com.br/",
    linkLabel: "Conhecer a LS Log",
  },
] as const;

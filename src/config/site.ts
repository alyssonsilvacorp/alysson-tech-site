export const siteConfig = {
  company: {
    name: "Alysson Tech",
    founder: "Alysson Silva",
    location: "Maceió, Alagoas",
    email: "alysson.silvacorp@gmail.com",
    instagram: "https://instagram.com/alysson.tech",
    instagramLabel: "@alysson.tech",
    whatsappNumber: "5500000000000",
    whatsappDisplay: "Configurar número",
  },
  seo: {
    title: "Alysson Tech | Sites, Sistemas e Soluções Digitais",
    description:
      "Criação de sites, landing pages, sistemas empresariais e soluções digitais para pequenos negócios em Maceió e atendimento online.",
    canonicalUrl: "https://www.seudominio.com.br",
    shareImage: "/brand/og-alysson-tech.svg",
  },
  hero: {
    title: "Tecnologia para transformar pequenos negócios em empresas mais profissionais.",
    description:
      "Criamos sites, sistemas e soluções digitais para ajudar sua empresa a conquistar credibilidade, organizar processos e gerar mais oportunidades.",
  },
  primaryMessage:
    "Ajudamos pequenos negócios a melhorar sua presença digital, organizar seus canais e transformar visitas em contatos e vendas pelo WhatsApp.",
  pricing: {
    monthlyRange: "R$ 50 a R$ 100",
    domainNote:
      "O domínio próprio poderá ser contratado separadamente ou incluído na proposta.",
  },
  whatsappMessages: {
    general:
      "Olá, Alysson! Conheci a Alysson Tech pelo site e gostaria de conversar sobre uma solução digital para minha empresa.",
    proposal:
      "Olá, Alysson! Gostaria de receber uma proposta personalizada para melhorar a presença digital da minha empresa.",
  },
  projects: [
    {
      slug: "vitalyon",
      name: "VITALYON",
      category: "Aplicação web",
      status: "Publicado / funcional",
      description:
        "Aplicação web de planejamento de treinos e alimentação, com organização de planos, cadastro de usuários e integração de pagamento via Pix.",
      image: "/projects/vitalyon/cover.svg",
      link: "https://vitalyon-app.vercel.app",
      message:
        "Olá, Alysson! Vi o projeto VITALYON e gostaria de saber como uma solução semelhante poderia ajudar meu negócio.",
    },
    {
      slug: "izaly-platform",
      name: "IZALY PLATFORM",
      category: "Plataforma SaaS",
      status: "Plataforma em evolução",
      description:
        "Plataforma SaaS modular e multiempresa criada para atender diferentes tipos de negócios em uma única estrutura tecnológica.",
      image: "/projects/izaly-platform/cover.svg",
      link: "https://izaly-platform.vercel.app",
      message:
        "Olá, Alysson! Vi a IZALY Platform e gostaria de entender como uma solução semelhante poderia atender minha empresa.",
    },
    {
      slug: "izaly-food",
      name: "IZALY FOOD",
      category: "Sistema para alimentação",
      status: "Primeiro módulo lançado e em implantação piloto",
      description:
        "Solução para restaurantes, hamburguerias e negócios alimentícios, com cardápio digital, produtos, pedidos, clientes e acompanhamento da operação.",
      image: "/projects/izaly-food/cover.svg",
      link: "",
      message:
        "Olá, Alysson! Vi o projeto IZALY Food e gostaria de saber como uma solução semelhante poderia ajudar meu negócio.",
    },
    {
      slug: "izaly-crm",
      name: "IZALY CRM",
      category: "Gestão comercial",
      status: "Beta em desenvolvimento",
      description:
        "Sistema em construção para organizar clientes, contatos, atendimentos, oportunidades, tarefas e processos comerciais.",
      image: "/projects/izaly-crm/cover.svg",
      link: "",
      message:
        "Olá, Alysson! Vi o IZALY CRM e gostaria de conversar sobre organização de clientes e processos comerciais.",
    },
    {
      slug: "izaly-tech",
      name: "SITE IZALY TECH",
      category: "Vitrine digital",
      status: "Projeto demonstrável",
      description:
        "Vitrine digital para apresentação e comercialização de produtos eletrônicos, facilitando o contato pelo WhatsApp.",
      image: "/projects/izaly-tech/cover.svg",
      link: "",
      message:
        "Olá, Alysson! Vi o site IZALY Tech e gostaria de criar uma vitrine digital semelhante para meu negócio.",
    },
    {
      slug: "izaly-joias",
      name: "SITE IZALY JOIAS",
      category: "Vitrine digital",
      status: "Projeto demonstrável",
      description:
        "Vitrine digital para apresentação de joias, coleções e produtos, com identidade elegante e contato facilitado.",
      image: "/projects/izaly-joias/cover.svg",
      link: "",
      message:
        "Olá, Alysson! Vi o site IZALY Joias e gostaria de criar uma vitrine digital semelhante para meu negócio.",
    },
  ],
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

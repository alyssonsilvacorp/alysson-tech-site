import Image from "next/image";

const challenges = [
  {
    title: "Empresa sem site",
    text: "A marca depende somente das redes sociais para ser encontrada.",
  },
  {
    title: "Informações espalhadas",
    text: "Contato, localização, produtos e serviços ficam em lugares diferentes.",
  },
  {
    title: "Apresentação improvisada",
    text: "O negócio entrega bem, mas a presença digital ainda não transmite isso.",
  },
  {
    title: "WhatsApp desorganizado",
    text: "Os contatos chegam sem contexto e o atendimento perde tempo.",
  },
  {
    title: "Processos manuais",
    text: "Cadernos e várias planilhas dificultam a visão da operação.",
  },
  {
    title: "Crescimento sem estrutura",
    text: "Toda nova demanda pesa mais quando a rotina não está organizada.",
  },
];

const services = [
  {
    icon: "landing",
    title: "Landing pages",
    text: "Páginas focadas em apresentar a oferta e transformar visitas em contatos.",
  },
  {
    icon: "institutional",
    title: "Sites institucionais",
    text: "Uma presença profissional com serviços, diferenciais, localização e contato.",
  },
  {
    icon: "catalog",
    title: "Catálogos digitais",
    text: "Vitrines de produtos e serviços com imagens, detalhes e atendimento facilitado.",
  },
  {
    icon: "presence",
    title: "Presença digital",
    text: "Organização dos canais para a marca ser encontrada e entendida com clareza.",
  },
  {
    icon: "systems",
    title: "Sistemas empresariais",
    text: "Soluções para organizar clientes, pedidos, estoque, vendas e operação.",
  },
  {
    icon: "support",
    title: "Manutenção e suporte",
    text: "Acompanhamento para manter sites e soluções funcionando e evoluindo.",
  },
];

const projects = [
  {
    name: "IZALY Food",
    eyebrow: "Sistema para alimentação",
    description:
      "Cardápio digital, produtos, pedidos, clientes e acompanhamento da operação em uma experiência integrada.",
    status: "Implantação piloto",
    tone: "food",
    href: "https://izaly-platform.vercel.app/",
    linkLabel: "Conhecer a plataforma",
  },
  {
    name: "IZALY CRM",
    eyebrow: "Gestão comercial",
    description:
      "Clientes, contatos e oportunidades organizados em um fluxo visual para acompanhar cada negociação.",
    status: "Beta em desenvolvimento",
    tone: "crm",
  },
  {
    name: "Site IZALY Tech",
    eyebrow: "Vitrine digital",
    description:
      "Presença digital para apresentar e comercializar eletrônicos com identidade e contato facilitado.",
    status: "Publicado",
    tone: "tech",
    href: "https://izalytech.netlify.app/",
    linkLabel: "Visitar projeto",
  },
  {
    name: "Site IZALY Joias",
    eyebrow: "Experiência de marca",
    description:
      "Vitrine elegante para apresentar joias, coleções e produtos, aproximando descoberta e atendimento.",
    status: "Publicado",
    tone: "joias",
    href: "https://izalyjoias.netlify.app/",
    linkLabel: "Visitar projeto",
  },
];

const process = [
  ["01", "Conhecer", "Entendemos o negócio e o momento atual."],
  ["02", "Identificar", "Mapeamos os problemas e as prioridades."],
  ["03", "Recomendar", "Definimos a solução adequada ao objetivo."],
  ["04", "Criar", "Construímos e personalizamos a experiência."],
  ["05", "Publicar", "Configuramos, validamos e colocamos no ar."],
  ["06", "Evoluir", "Acompanhamos o uso e as próximas melhorias."],
];

const expertise = [
  "Desenvolvimento web",
  "Implantação de sistemas",
  "Suporte técnico",
  "Treinamento de usuários",
  "Manutenção de computadores",
  "Atendimento e operação",
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M7 5H5.8A1.8 1.8 0 0 0 4 6.8v7.4A1.8 1.8 0 0 0 5.8 16h7.4a1.8 1.8 0 0 0 1.8-1.8V13M10 4h6v6M16 4l-7 7" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.48 8.7 8.7 0 0 1-3.2-.8L4 20l1.6-4.2A7.5 7.5 0 1 1 20 11.5Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" fill="none">
      <path d="m4 9 3.1 3L14 5.5" />
    </svg>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark--compact" : "brand-mark"}>
      <Image
        src="/brand/alysson-tech.png"
        alt=""
        fill
        priority
        unoptimized
        sizes={compact ? "44px" : "72px"}
        className="brand-mark__image"
      />
    </span>
  );
}

function ServiceIcon({ type }: { type: string }) {
  const paths: Record<string, React.ReactNode> = {
    landing: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M3 8h18M7 12h5M7 16h9" />
      </>
    ),
    institutional: (
      <>
        <path d="M4 20V8l8-4 8 4v12M8 20v-6h8v6" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </>
    ),
    catalog: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2.5" />
        <path d="M8 3v18M11 8h5M11 12h5M11 16h3" />
      </>
    ),
    presence: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.4 2.3 3.5 5.1 3.5 8.5S14.4 18.2 12 20.5M12 3.5C9.6 5.8 8.5 8.6 8.5 12S9.6 18.2 12 20.5" />
      </>
    ),
    systems: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M7 16v-3M12 16V9M17 16v-6" />
      </>
    ),
    support: (
      <>
        <path d="M14.5 5.1a4 4 0 0 0-5.2 5.2L4 15.6 8.4 20l5.3-5.3a4 4 0 0 0 5.2-5.2l-2.7 2.7-2.4-2.4 2.7-2.7Z" />
      </>
    ),
  };

  return (
    <svg className="service-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {paths[type]}
    </svg>
  );
}

function HeroConsole() {
  return (
    <div className="hero-console" aria-label="Painel visual com exemplos de soluções digitais">
      <div className="console-glow" />
      <div className="console-toolbar">
        <div className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>studio.alysson.tech</span>
        <b>
          <i />
          online
        </b>
      </div>

      <div className="console-layout">
        <aside className="console-nav" aria-hidden="true">
          <BrandMark compact />
          <div className="console-nav__items">
            <i className="active" />
            <i />
            <i />
            <i />
          </div>
          <span>AT</span>
        </aside>

        <div className="console-content">
          <div className="console-heading">
            <div>
              <small>VISÃO DE PRODUTO</small>
              <h2>Presença que trabalha pelo negócio.</h2>
            </div>
            <span>sob medida</span>
          </div>

          <div className="console-products">
            <article className="console-product console-product--food">
              <div>
                <span className="product-icon">IF</span>
                <p>
                  <strong>IZALY Food</strong>
                  <small>Operação e pedidos</small>
                </p>
              </div>
              <div className="order-preview">
                <span>#028</span>
                <i />
                <small>em preparo</small>
              </div>
              <div className="order-preview">
                <span>#029</span>
                <i />
                <small>novo pedido</small>
              </div>
            </article>

            <article className="console-product console-product--crm">
              <div>
                <span className="product-icon">IC</span>
                <p>
                  <strong>IZALY CRM</strong>
                  <small>Pipeline comercial</small>
                </p>
              </div>
              <div className="pipeline-preview" aria-hidden="true">
                <span>
                  <i />
                  <i />
                </span>
                <span>
                  <i />
                  <i />
                </span>
                <span>
                  <i />
                </span>
              </div>
            </article>
          </div>

          <div className="console-progress">
            <div>
              <small>SITE</small>
              <span>
                <i style={{ width: "88%" }} />
              </span>
            </div>
            <div>
              <small>SISTEMA</small>
              <span>
                <i style={{ width: "72%" }} />
              </span>
            </div>
            <div>
              <small>MARCA</small>
              <span>
                <i style={{ width: "94%" }} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="console-stamp">
        <span>ALYSSON TECH</span>
        <small>technology with purpose</small>
      </div>
    </div>
  );
}

function ProjectVisual({ tone }: { tone: string }) {
  if (tone === "food") {
    return (
      <div className="project-screen project-screen--food" aria-hidden="true">
        <div className="screen-bar">
          <span>IZALY Food</span>
          <i />
        </div>
        <div className="food-dashboard">
          <aside>
            <i className="active" />
            <i />
            <i />
            <i />
          </aside>
          <div>
            <small>Pedidos de hoje</small>
            <div className="food-orders">
              <span>
                <b>#028</b>
                <i />
              </span>
              <span>
                <b>#029</b>
                <i />
              </span>
              <span>
                <b>#030</b>
                <i />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tone === "crm") {
    return (
      <div className="project-screen project-screen--crm" aria-hidden="true">
        <div className="screen-bar">
          <span>IZALY CRM</span>
          <i />
        </div>
        <div className="crm-board">
          {["Novos", "Contato", "Proposta"].map((column, index) => (
            <div key={column}>
              <small>{column}</small>
              <i />
              <i />
              {index < 2 && <i />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tone === "tech") {
    return (
      <div className="project-screen project-screen--tech" aria-hidden="true">
        <div className="store-nav">
          <strong>IZALY TECH</strong>
          <span>Produtos</span>
          <span>Contato</span>
        </div>
        <div className="store-hero">
          <small>TECNOLOGIA PARA O DIA A DIA</small>
          <strong>Escolha. Peça. Receba.</strong>
          <i />
        </div>
        <div className="store-products">
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }

  return (
    <div className="project-screen project-screen--joias" aria-hidden="true">
      <div className="jewelry-nav">
        <strong>IZALY</strong>
        <span>JOIAS</span>
      </div>
      <div className="jewelry-stage">
        <span className="jewel jewel--one" />
        <span className="jewel jewel--two" />
        <small>Elegância em cada detalhe</small>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <div className="page-noise" aria-hidden="true" />
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />

      <header className="site-header">
        <a className="brand-lockup" href="#inicio" aria-label="Alysson Tech — início">
          <BrandMark compact />
          <span>
            <strong>ALYSSON</strong>
            <small>TECH</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#solucoes">Soluções</a>
          <a href="#projetos">Projetos</a>
          <a href="#processo">Como funciona</a>
          <a href="#sobre">Sobre</a>
        </nav>

        <a
          className="header-cta"
          href="https://instagram.com/alysson.tech"
          target="_blank"
          rel="noreferrer"
        >
          Solicitar orçamento
          <ArrowIcon />
        </a>
      </header>

      <section className="hero shell" id="inicio">
        <div className="hero__copy">
          <p className="hero__brand">ALYSSON TECH</p>
          <p className="eyebrow">
            <span />
            Tecnologia acessível para negócios reais
          </p>
          <h1>
            Tecnologia que organiza.
            <em> Presença que valoriza.</em>
          </h1>
          <p className="hero__lead">
            Criamos sites, sistemas e produtos digitais para transformar ideias
            em experiências profissionais, úteis e prontas para evoluir.
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#projetos">
              Conhecer projetos
              <ArrowIcon />
            </a>
            <a
              className="button button--ghost"
              href="https://instagram.com/alysson.tech"
              target="_blank"
              rel="noreferrer"
            >
              Conversar sobre uma ideia
            </a>
          </div>

          <div className="hero__facts" aria-label="Informações da Alysson Tech">
            <span>Maceió · AL</span>
            <span>Atendimento próximo</span>
            <span>Soluções sob medida</span>
          </div>
        </div>

        <div className="hero__visual">
          <HeroConsole />
          <span className="orbit-label orbit-label--one">SITES</span>
          <span className="orbit-label orbit-label--two">SISTEMAS</span>
          <span className="orbit-label orbit-label--three">SAAS</span>
        </div>
      </section>

      <section className="trust-strip" aria-label="Áreas de atuação">
        <div className="shell trust-strip__inner">
          <span>Sites profissionais</span>
          <i />
          <span>Sistemas empresariais</span>
          <i />
          <span>Produtos digitais</span>
          <i />
          <span>Suporte e evolução</span>
        </div>
      </section>

      <section className="section section--problems shell">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              <span />
              Problemas reais
            </p>
            <h2>
              Seu negócio não precisa parecer improvisado para começar a crescer.
            </h2>
          </div>
          <p>
            Tecnologia não precisa ser complicada. Ela precisa reduzir atrito,
            transmitir confiança e resolver o que hoje toma tempo do seu negócio.
          </p>
        </div>

        <div className="problems-grid">
          {challenges.map((challenge, index) => (
            <article className="problem-card" key={challenge.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{challenge.title}</h3>
                <p>{challenge.text}</p>
              </div>
              <i />
            </article>
          ))}
        </div>
      </section>

      <section className="section section--services" id="solucoes">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">
                <span />
                Soluções
              </p>
              <h2>Uma estrutura digital conectada ao seu objetivo.</h2>
            </div>
            <p>
              Da apresentação da marca à organização da rotina: cada solução é
              pensada para fazer sentido no uso real.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <div className="service-card__top">
                  <span className="service-card__icon">
                    <ServiceIcon type={service.icon} />
                  </span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <i className="service-card__line" />
              </article>
            ))}
          </div>

          <div className="engagement">
            <div className="engagement__intro">
              <p className="eyebrow">
                <span />
                Criação + continuidade
              </p>
              <h3>O projeto nasce bem e continua evoluindo.</h3>
              <p>
                Estruturamos a entrega inicial e, quando fizer sentido, seguimos
                cuidando da disponibilidade e das pequenas melhorias.
              </p>
            </div>

            <article className="engagement-card">
              <small>IMPLANTAÇÃO</small>
              <h4>Estrutura preparada para o seu negócio</h4>
              <ul>
                {["Análise", "Criação", "Personalização", "Configuração", "Publicação"].map(
                  (item) => (
                    <li key={item}>
                      <CheckIcon />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </article>

            <article className="engagement-card engagement-card--highlight">
              <small>ACOMPANHAMENTO</small>
              <h4>
                R$ 50 a R$ 100 <span>/ mês</span>
              </h4>
              <p>Conforme o projeto e a necessidade de suporte.</p>
              <ul>
                {[
                  "Manter o site no ar",
                  "Pequenas alterações",
                  "Atualização de textos",
                  "Troca de imagens",
                  "Suporte técnico",
                ].map((item) => (
                  <li key={item}>
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section shell" id="projetos">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              <span />
              Portfólio real
            </p>
            <h2>Projetos com identidade, função e caminho de evolução.</h2>
          </div>
          <p>
            Produtos próprios e experiências digitais que mostram diferentes
            formas de transformar tecnologia em algo claro e utilizável.
          </p>
        </div>

        <div className="featured-grid">
          <article className="featured-project featured-project--platform">
            <div className="featured-project__visual">
              <div className="brand-stage">
                <Image
                  src="/brand/izaly-platform.jpeg"
                  alt="Logo IZALY Plataform"
                  fill
                  unoptimized
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="brand-stage__image brand-stage__image--platform"
                />
              </div>
              <div className="platform-panel" aria-hidden="true">
                <div className="platform-panel__top">
                  <span>Visão geral</span>
                  <i />
                </div>
                <div className="platform-module">
                  <b>Food</b>
                  <span>Implantação piloto</span>
                </div>
                <div className="platform-module">
                  <b>CRM</b>
                  <span>Beta em desenvolvimento</span>
                </div>
              </div>
              <span className="project-status">Plataforma em evolução</span>
            </div>
            <div className="featured-project__content">
              <p>Ecossistema de gestão</p>
              <h3>IZALY Plataform</h3>
              <span>
                Uma plataforma modular criada para apoiar diferentes tipos de
                negócio em uma única estrutura tecnológica.
              </span>
              <a
                href="https://izaly-platform.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Ver projeto
                <ExternalIcon />
              </a>
            </div>
          </article>

          <article className="featured-project featured-project--vitalyon">
            <div className="featured-project__visual">
              <div className="brand-stage">
                <Image
                  src="/brand/vitalyon.jpeg"
                  alt="Símbolo VITALYON"
                  fill
                  unoptimized
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="brand-stage__image brand-stage__image--vitalyon"
                />
              </div>
              <div className="vitalyon-panel" aria-hidden="true">
                <span>Seu plano</span>
                <strong>Treino e alimentação</strong>
                <div>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <span className="project-status">Publicado e funcional</span>
            </div>
            <div className="featured-project__content">
              <p>Aplicação web</p>
              <h3>VITALYON</h3>
              <span>
                Planejamento de treinos e alimentação com acesso online, jornada
                simples e pagamento integrado.
              </span>
              <a
                href="https://vitalyon-app.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Ver projeto
                <ExternalIcon />
              </a>
            </div>
          </article>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className={`project-card project-card--${project.tone}`} key={project.name}>
              <ProjectVisual tone={project.tone} />
              <div className="project-card__body">
                <div className="project-card__meta">
                  <p>{project.eyebrow}</p>
                  <span>{project.status}</span>
                </div>
                <h3>{project.name}</h3>
                <p className="project-card__description">{project.description}</p>
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer">
                    {project.linkLabel}
                    <ExternalIcon />
                  </a>
                ) : (
                  <span className="project-card__coming">
                    Em construção
                    <i />
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ecosystem">
        <div className="shell ecosystem__inner">
          <div className="ecosystem__copy">
            <p className="eyebrow">
              <span />
              Ecossistema IZALY
            </p>
            <h2>Alysson Tech é a criadora da IZALY Plataform.</h2>
            <p>
              Uma estrutura modular pensada para crescer conforme as necessidades
              de diferentes operações, começando por Food e avançando com o CRM.
            </p>
          </div>

          <div className="ecosystem__modules">
            <article>
              <span>01</span>
              <div>
                <h3>IZALY Food</h3>
                <p>Primeiro módulo voltado a negócios alimentícios.</p>
              </div>
              <small>Implantação piloto</small>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>IZALY CRM</h3>
                <p>Gestão comercial, relacionamento e acompanhamento.</p>
              </div>
              <small>Beta em desenvolvimento</small>
            </article>
          </div>
        </div>
      </section>

      <section className="section shell" id="processo">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              <span />
              Como funciona
            </p>
            <h2>Um processo simples, próximo e orientado ao seu negócio.</h2>
          </div>
          <p>
            A tecnologia começa pela escuta. Depois, cada etapa transforma a
            necessidade em uma entrega clara e verificável.
          </p>
        </div>

        <div className="process-grid">
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <i />
            </article>
          ))}
        </div>
      </section>

      <section className="section section--about" id="sobre">
        <div className="shell about">
          <div className="about__portrait">
            <div className="portrait-frame">
              <Image
                src="/profile/alysson-silva.jpeg"
                alt="Alysson Silva, fundador da Alysson Tech"
                fill
                priority
                unoptimized
                sizes="(max-width: 900px) 90vw, 38vw"
                className="portrait-image"
              />
              <span className="portrait-code">AT — FOUNDER</span>
            </div>
            <div className="portrait-note">
              <BrandMark compact />
              <p>
                <strong>Alysson Silva</strong>
                <span>Analista de sistemas · Desenvolvedor</span>
              </p>
            </div>
          </div>

          <div className="about__copy">
            <p className="eyebrow">
              <span />
              Quem está por trás
            </p>
            <h2>Tecnologia aplicada com visão prática de atendimento e operação.</h2>
            <p className="about__lead">
              Eu sou Alysson Silva, analista de sistemas, desenvolvedor e criador
              da Alysson Tech e dos produtos IZALY.
            </p>
            <p>
              Minha experiência com tecnologia, suporte, implantação e atendimento
              me ensinou que uma boa solução precisa funcionar para quem vende,
              para quem atende e para quem compra.
            </p>
            <p>
              A Alysson Tech nasceu para aproximar esse conhecimento de pequenos
              negócios, criando presença digital e sistemas que façam sentido na
              rotina real.
            </p>

            <div className="expertise-grid" aria-label="Áreas de experiência">
              {expertise.map((item) => (
                <span key={item}>
                  <CheckIcon />
                  {item}
                </span>
              ))}
            </div>

            <blockquote>
              <span>Minha missão</span>
              Aproximar a tecnologia de quem empreende, criando soluções que
              valorizem o negócio hoje e estejam prontas para crescer amanhã.
            </blockquote>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="closing__grid" aria-hidden="true" />
        <div className="closing__orb" aria-hidden="true" />
        <div className="shell closing__content">
          <span className="closing__icon">
            <BrandMark compact />
          </span>
          <p className="eyebrow">
            <span />
            Vamos construir
          </p>
          <h2>Seu negócio pode parecer mais profissional e funcionar melhor.</h2>
          <p>
            Conte o que precisa ser organizado, apresentado ou transformado. A
            conversa começa pelo problema real.
          </p>
          <a
            className="button button--primary button--large"
            href="https://instagram.com/alysson.tech"
            target="_blank"
            rel="noreferrer"
          >
            Falar com Alysson
            <ArrowIcon />
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell site-footer__main">
          <div className="footer-brand">
            <a className="brand-lockup" href="#inicio" aria-label="Voltar ao início">
              <BrandMark compact />
              <span>
                <strong>ALYSSON</strong>
                <small>TECH</small>
              </span>
            </a>
            <p>Sites, sistemas e soluções digitais para pequenos negócios.</p>
          </div>

          <div className="footer-column">
            <strong>Navegação</strong>
            <a href="#solucoes">Soluções</a>
            <a href="#projetos">Projetos</a>
            <a href="#processo">Como funciona</a>
            <a href="#sobre">Sobre Alysson</a>
          </div>

          <div className="footer-column">
            <strong>Projetos</strong>
            <a href="https://vitalyon-app.vercel.app/" target="_blank" rel="noreferrer">
              VITALYON
            </a>
            <a href="https://izaly-platform.vercel.app/" target="_blank" rel="noreferrer">
              IZALY Plataform
            </a>
            <a href="https://izalytech.netlify.app/" target="_blank" rel="noreferrer">
              IZALY Tech
            </a>
            <a href="https://izalyjoias.netlify.app/" target="_blank" rel="noreferrer">
              IZALY Joias
            </a>
          </div>

          <div className="footer-column">
            <strong>Contato</strong>
            <a href="https://instagram.com/alysson.tech" target="_blank" rel="noreferrer">
              Instagram: @alysson.tech
            </a>
            <span>Maceió, Alagoas</span>
            <span>Atendimento online</span>
          </div>
        </div>

        <div className="shell site-footer__bottom">
          <span>© 2026 Alysson Tech. Todos os direitos reservados.</span>
          <span>Criada por Alysson Silva.</span>
        </div>
      </footer>

      <a
        className="contact-fab"
        href="https://instagram.com/alysson.tech"
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar com Alysson Tech pelo Instagram"
      >
        <ChatIcon />
      </a>
    </main>
  );
}

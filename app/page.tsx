import Image from "next/image";

const whatsappAnalysisUrl =
  "https://wa.me/5582999926146?text=Ol%C3%A1%2C%20Alysson%21%20Vim%20pelo%20site%20da%20Alysson%20Tech%20e%20gostaria%20de%20solicitar%20uma%20an%C3%A1lise%20inicial.";

const projects = [
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

const capabilities = [
  {
    number: "01",
    title: "Sites com identidade",
    text: "Landing pages, sites institucionais e vitrines digitais que apresentam o negócio com clareza e levam o visitante ao próximo passo.",
  },
  {
    number: "02",
    title: "Sistemas que organizam",
    text: "Soluções pensadas a partir da rotina real da operação, reduzindo improvisos e reunindo informações importantes em um só lugar.",
  },
  {
    number: "03",
    title: "Produtos digitais",
    text: "Ideias transformadas em experiências testáveis, evoluindo com uso real, aprendizado contínuo e visão de longo prazo.",
  },
];

const businessProblems = [
  {
    number: "01",
    title: "Quero vender melhor pela internet",
    text: "Site, catálogo, presença digital e uma jornada mais clara até o contato ou a compra.",
  },
  {
    number: "02",
    title: "Meu atendimento está desorganizado",
    text: "Organização dos canais, informações e fluxos para tornar o atendimento mais simples e acompanhável.",
  },
  {
    number: "03",
    title: "Perco tempo com tarefas repetitivas",
    text: "Automação de processos que hoje consomem tempo e dependem de trabalho manual.",
  },
  {
    number: "04",
    title: "Preciso organizar clientes, pedidos ou operação",
    text: "Sistemas, painéis, CRM e ferramentas pensadas a partir da rotina real do negócio.",
  },
  {
    number: "05",
    title: "Tenho uma ideia de sistema",
    text: "Analisamos a ideia, definimos o que realmente precisa existir e começamos por uma versão viável.",
  },
  {
    number: "06",
    title: "Estou começando do zero",
    text: "Presença digital e tecnologia também para quem ainda está estruturando o negócio, sem exigir uma grande operação.",
  },
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="arrow-icon"
    >
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="external-icon"
    >
      <path d="M7 5H5.8A1.8 1.8 0 0 0 4 6.8v7.4A1.8 1.8 0 0 0 5.8 16h7.4a1.8 1.8 0 0 0 1.8-1.8V13M10 4h6v6M16 4l-7 7" />
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

function ProjectVisual({ tone }: { tone: string }) {
  if (tone === "food") {
    return (
      <div className="mini-product mini-product--food" aria-hidden="true">
        <div className="mini-product__top">
          <span>Pedidos</span>
          <span className="live-dot">ao vivo</span>
        </div>
        <div className="order-row">
          <strong>#028</strong>
          <span>Em preparo</span>
          <i />
        </div>
        <div className="order-row">
          <strong>#029</strong>
          <span>Novo pedido</span>
          <i />
        </div>
        <div className="order-progress">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (tone === "crm") {
    return (
      <div className="mini-product mini-product--crm" aria-hidden="true">
        <div className="mini-product__top">
          <span>Pipeline</span>
          <span>+ oportunidade</span>
        </div>
        <div className="pipeline">
          <div>
            <small>NOVOS</small>
            <i />
            <i />
          </div>
          <div>
            <small>CONTATO</small>
            <i />
            <i />
          </div>
          <div>
            <small>PROPOSTA</small>
            <i />
          </div>
        </div>
      </div>
    );
  }

  if (tone === "tech") {
    return (
      <div className="mini-product mini-product--tech" aria-hidden="true">
        <div className="tech-orbit">
          <span className="tech-core">IZ</span>
          <i />
          <i />
          <i />
        </div>
        <div className="tech-caption">
          <small>TECNOLOGIA</small>
          <strong>que acompanha você</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="mini-product mini-product--joias" aria-hidden="true">
      <div className="jewel-stage">
        <span className="jewel-ring jewel-ring--one" />
        <span className="jewel-ring jewel-ring--two" />
        <i>IZ</i>
      </div>
      <p>Detalhes que contam histórias.</p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <header className="site-header">
        <a className="brand-lockup" href="#inicio" aria-label="Alysson Tech — início">
          <BrandMark compact />
          <span>
            <strong>ALYSSON</strong>
            <small>TECH</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#projetos">Projetos</a>
          <a href="#solucoes">Soluções</a>
          <a href="#sobre">Sobre</a>
        </nav>

        <a
          className="header-cta"
          href={whatsappAnalysisUrl}
          target="_blank"
          rel="noreferrer"
        >
          Análise gratuita
          <ArrowIcon />
        </a>
      </header>

      <section className="hero shell" id="inicio">
        <div className="hero__copy">
          <p className="eyebrow">
            <span />
            Tecnologia começa entendendo o problema
          </p>
          <h1>
            O que seu negócio precisa <em>resolver hoje?</em>
          </h1>
          <p className="hero__lead">
            Você não precisa saber qual sistema, site ou tecnologia utilizar.
            Conte o que está acontecendo no seu negócio e vamos encontrar uma
            solução simples, viável e adequada ao momento da sua operação.
          </p>

          <div className="hero__actions">
            <a
              className="button button--primary"
              href={whatsappAnalysisUrl}
              target="_blank"
              rel="noreferrer"
            >
              Solicitar análise gratuita
              <ArrowIcon />
            </a>
            <a className="button button--ghost" href="#projetos">
              Conhecer projetos
            </a>
          </div>

          <div className="hero__facts" aria-label="Informações da Alysson Tech">
            <span>Maceió · AL</span>
            <span>Atendimento humano</span>
            <span>Soluções por etapas</span>
          </div>
        </div>

        <div className="hero__visual" aria-label="Identidade visual Alysson Tech">
          <div className="visual-grid" />
          <div className="visual-scanline" />
          <div className="visual-chip visual-chip--one">SITES</div>
          <div className="visual-chip visual-chip--two">SISTEMAS</div>
          <div className="visual-chip visual-chip--three">SAAS</div>
          <div className="hero-logo">
            <Image
              src="/brand/alysson-tech.png"
              alt="Logo Alysson Tech"
              fill
              priority
              unoptimized
              sizes="(max-width: 900px) 88vw, 42vw"
              className="hero-logo__image"
            />
          </div>
          <div className="visual-footer">
            <span>
              <i />
              BUILDING
            </span>
            <strong>AT / 26</strong>
          </div>
        </div>
      </section>

      <section className="principle-strip" aria-label="Princípios">
        <div className="shell principle-strip__inner">
          <span>Problemas reais</span>
          <i />
          <span>Soluções simples</span>
          <i />
          <span>Identidade própria</span>
          <i />
          <span>Evolução contínua</span>
        </div>
      </section>

      <section
        className="section section--problems"
        aria-labelledby="problems-title"
      >
        <div className="shell">
          <div className="section-heading problems-heading">
            <div>
              <p className="eyebrow">
                <span />
                Comece pelo problema
              </p>
              <h2 id="problems-title">
                O que está dificultando seu negócio hoje?
              </h2>
            </div>
            <p>
              Nem sempre a solução começa com um sistema completo. Primeiro
              entendemos o que está acontecendo para depois escolher a
              tecnologia que realmente faz sentido.
            </p>
          </div>

          <div className="problems-grid">
            {businessProblems.map((problem) => (
              <article className="problem-card" key={problem.number}>
                <span className="problem-card__number">{problem.number}</span>
                <div>
                  <h3>{problem.title}</h3>
                  <p>{problem.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="problems-cta">
            <p>Não encontrou seu caso? Conte o que está acontecendo.</p>
            <a
              className="button button--primary"
              href={whatsappAnalysisUrl}
              target="_blank"
              rel="noreferrer"
            >
              Solicitar análise inicial
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      <section className="section shell" id="projetos">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              Portfólio em movimento
            </p>
            <h2>Projetos que mostram o que estamos construindo.</h2>
          </div>
          <p>
            Produtos próprios e experiências digitais criadas para resolver
            necessidades reais, do primeiro contato à rotina de gestão.
          </p>
        </div>

        <div className="featured-grid">
          <article className="featured-project featured-project--izaly">
            <div className="featured-project__media">
              <div className="media-glow" />
              <Image
                src="/brand/izaly-platform.jpeg"
                alt="Logo IZALY Plataform"
                fill
                unoptimized
                sizes="(max-width: 900px) 100vw, 50vw"
                className="featured-project__image featured-project__image--platform"
              />
              <div className="project-status">Plataforma em evolução</div>
            </div>
            <div className="featured-project__content">
              <p>Ecossistema de gestão</p>
              <h3>IZALY Plataform</h3>
              <span>
                Uma plataforma criada para reunir módulos de gestão e apoiar
                pequenos negócios em diferentes segmentos.
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
            <div className="featured-project__media">
              <div className="pulse-ring pulse-ring--one" />
              <div className="pulse-ring pulse-ring--two" />
              <Image
                src="/brand/vitalyon.jpeg"
                alt="Símbolo VITALYON"
                fill
                unoptimized
                sizes="(max-width: 900px) 100vw, 50vw"
                className="featured-project__image featured-project__image--vitalyon"
              />
              <div className="project-status">Publicado e funcional</div>
            </div>
            <div className="featured-project__content">
              <p>Produto digital</p>
              <h3>VITALYON</h3>
              <span>
                Uma experiência digital voltada ao bem-estar e ao treino, com
                acesso online e uma jornada simples para o usuário.
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

      <section className="section section--capabilities" id="solucoes">
        <div className="shell">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">
                <span />
                O que a Alysson Tech cria
              </p>
              <h2>Tecnologia útil, clara e feita para avançar.</h2>
            </div>
          </div>

          <div className="capabilities-grid">
            {capabilities.map((capability) => (
              <article className="capability-card" key={capability.number}>
                <span>{capability.number}</span>
                <div>
                  <h3>{capability.title}</h3>
                  <p>{capability.text}</p>
                </div>
                <i />
              </article>
            ))}
          </div>

          <div className="method">
            <p>Do problema à solução</p>
            <div className="method__flow">
              <span>Entender</span>
              <i />
              <span>Organizar</span>
              <i />
              <span>Construir</span>
              <i />
              <span>Evoluir</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell about" id="sobre">
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
            <span className="portrait-code">AT — 01</span>
          </div>
          <div className="portrait-note">
            <BrandMark compact />
            <p>
              <strong>Fundador & desenvolvedor</strong>
              <span>Maceió, Alagoas</span>
            </p>
          </div>
        </div>

        <div className="about__copy">
          <p className="eyebrow">
            <span />
            Quem está por trás
          </p>
          <h2>Eu sou Alysson Silva.</h2>
          <p className="about__lead">
            Analista de sistemas, desenvolvedor e criador da Alysson Tech e dos
            produtos IZALY.
          </p>
          <p>
            A Alysson Tech nasceu da vontade de transformar ideias e rotinas de
            pequenos negócios em soluções digitais mais simples, acessíveis e
            próximas da realidade de quem empreende.
          </p>
          <p>
            Cada projeto começa com uma pergunta: o que realmente precisa ser
            organizado, apresentado ou melhorado? A partir dela, tecnologia e
            identidade trabalham juntas para construir algo útil.
          </p>

          <blockquote>
            <span>Minha missão</span>
            Aproximar a tecnologia de quem empreende, criando soluções que
            façam sentido hoje e possam crescer amanhã.
          </blockquote>
        </div>
      </section>

      <section className="closing">
        <div className="closing__grid" />
        <div className="shell closing__content">
          <p className="eyebrow">
            <span />
            Vamos construir
          </p>
          <h2>Tem algo no seu negócio que precisa funcionar melhor?</h2>
          <p>
            Conte o que está acontecendo. A análise inicial é gratuita e começa
            entendendo o problema antes de escolher a solução.
          </p>
          <a
            className="button button--primary button--large"
            href={whatsappAnalysisUrl}
            target="_blank"
            rel="noreferrer"
          >
            Solicitar análise inicial
            <ArrowIcon />
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <a className="brand-lockup" href="#inicio" aria-label="Voltar ao início">
            <BrandMark compact />
            <span>
              <strong>ALYSSON</strong>
              <small>TECH</small>
            </span>
          </a>
          <p>Tecnologia com identidade, propósito e evolução.</p>
          <div>
            <a
              href="https://instagram.com/alysson.tech"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <span>© 2026 Alysson Tech</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

import Image from "next/image";
import DiagnosisForm from "../components/DiagnosisForm";
import {
  clientProjects,
  izalyPlatform,
  ownProjects,
  type ProjectTone,
  vitalyonProject,
} from "../data/projects";

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

const methodSteps = [
  {
    number: "01",
    title: "Conte o problema",
    text: "Você explica o que está acontecendo, o que precisa melhorar ou a ideia que deseja tirar do papel.",
  },
  {
    number: "02",
    title: "Entendemos a operação",
    text: "Analisamos como o negócio funciona hoje, onde estão as dificuldades e o que realmente precisa ser resolvido.",
  },
  {
    number: "03",
    title: "Apresentamos um caminho",
    text: "Definimos uma solução possível: site, automação, sistema, organização digital ou uma combinação dessas alternativas.",
  },
  {
    number: "04",
    title: "Definimos escopo e investimento",
    text: "A solução é organizada em etapas, prioridades e investimento de acordo com a necessidade e o momento do projeto.",
  },
  {
    number: "05",
    title: "Construímos e evoluímos",
    text: "Depois da validação, desenvolvemos a solução e continuamos evoluindo conforme o uso e novas necessidades aparecem.",
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
        src="/brand/alysson-tech-icon.png"
        alt=""
        fill
        unoptimized
        sizes={compact ? "44px" : "72px"}
        className="brand-mark__image"
      />
    </span>
  );
}

function ProjectVisual({ tone }: { tone: ProjectTone }) {
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
          <a href="#projetos">Projetos</a>
          <a href="#solucoes">Soluções</a>
          <a href="#sobre">Sobre</a>
          <a href="#analise">Análise</a>
        </nav>

        <a className="header-cta" href="#analise">
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
              href="#analise"
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
          <Image
            src="/brand/alysson-tech-hero-premium.png"
            alt="Alysson Tech — sites, sistemas e SaaS"
            fill
            priority
            unoptimized
            sizes="(max-width: 900px) 88vw, 42vw"
            className="hero-premium__image"
          />
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
              href="#analise"
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
              Projetos e tecnologia
            </p>
            <h2>
              Soluções construídas para diferentes momentos de um negócio.
            </h2>
          </div>
          <p>
            Produtos próprios, plataformas em evolução e projetos desenvolvidos
            a partir de necessidades reais.
          </p>
        </div>

        <article className="technology-feature">
          <div className="technology-feature__content">
            <div className="technology-feature__topline">
              <p>{izalyPlatform.eyebrow}</p>
              <span>{izalyPlatform.status}</span>
            </div>
            <h3>{izalyPlatform.name}</h3>
            <p className="technology-feature__description">
              {izalyPlatform.description}
            </p>
            <div
              className="technology-modules"
              aria-label="Módulos atuais da IZALY Platform"
            >
              {izalyPlatform.modules.map((module) => (
                <div className="technology-module" key={module.name}>
                  <span>{module.name}</span>
                  <small>{module.status}</small>
                </div>
              ))}
            </div>
            <a
              className="technology-feature__link"
              href={izalyPlatform.href}
              target="_blank"
              rel="noreferrer"
            >
              {izalyPlatform.linkLabel}
              <ExternalIcon />
            </a>
          </div>
          <div className="technology-feature__media">
            <div className="media-glow" />
            <Image
              src="/brand/izaly-platform.jpeg"
              alt="Identidade visual da IZALY Platform"
              fill
              unoptimized
              sizes="(max-width: 900px) 100vw, 46vw"
              className="technology-feature__image"
            />
            <div className="technology-feature__signature">
              <span>AT / TECNOLOGIA</span>
              <i />
              <strong>Ecossistema modular</strong>
            </div>
          </div>
        </article>

        <div className="portfolio-group portfolio-group--clients">
          <div className="portfolio-group__heading">
            <div>
              <p className="portfolio-group__eyebrow">Projetos para clientes</p>
              <h3>Soluções construídas para operações reais.</h3>
            </div>
            <p>
              Soluções desenvolvidas a partir da rotina, das necessidades e dos
              objetivos específicos de cada operação.
            </p>
          </div>

          {clientProjects.map((project) => (
            <article className="client-project" key={project.client}>
              <div className="client-project__content">
                <div className="client-project__topline">
                  <p>{project.client}</p>
                  <span>{project.status}</span>
                </div>
                <small>{project.category}</small>
                <h3>{project.title}</h3>
                <p className="client-project__description">
                  {project.description}
                </p>
                <p className="client-project__note">{project.note}</p>
              </div>
              <div className="client-project__visual" aria-hidden="true">
                <div className="client-visual__label">Visual abstrato</div>
                <div className="client-visual__panel">
                  <div className="client-visual__bar">
                    <i />
                    <i />
                    <i />
                    <span>LS / OPERAÇÃO</span>
                  </div>
                  <div className="client-visual__layout">
                    <div className="client-visual__nav">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="client-visual__workspace">
                      <div className="client-visual__line" />
                      <div className="client-visual__cards">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="client-visual__rows">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="portfolio-group portfolio-group--own">
          <div className="portfolio-group__heading">
            <div>
              <p className="portfolio-group__eyebrow">
                Produtos e projetos próprios
              </p>
              <h3>Ideias que evoluem com uso e aprendizado.</h3>
            </div>
            <p>
              Experimentos, produtos digitais e soluções desenvolvidas pela
              Alysson Tech e pelo ecossistema IZALY.
            </p>
          </div>

          <article className="featured-project featured-project--vitalyon featured-project--standalone">
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
              <div className="project-status">{vitalyonProject.status}</div>
            </div>
            <div className="featured-project__content">
              <p>{vitalyonProject.eyebrow}</p>
              <h3>{vitalyonProject.name}</h3>
              <span>{vitalyonProject.description}</span>
              <a
                href={vitalyonProject.href}
                target="_blank"
                rel="noreferrer"
              >
                {vitalyonProject.linkLabel}
                <ExternalIcon />
              </a>
            </div>
          </article>

          <div className="projects-grid">
            {ownProjects.map((project) => (
              <article
                className={`project-card project-card--${project.tone}`}
                key={project.name}
              >
                <ProjectVisual tone={project.tone} />
                <div className="project-card__body">
                  <div className="project-card__meta">
                    <p>{project.eyebrow}</p>
                    <span>{project.status}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p className="project-card__description">
                    {project.description}
                  </p>
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

        </div>
      </section>

      <section
        className="section section--method"
        aria-labelledby="method-title"
      >
        <div className="shell">
          <div className="section-heading method-heading">
            <div>
              <p className="eyebrow">
                <span />
                Como trabalhamos
              </p>
              <h2 id="method-title">
                Antes de escolher a tecnologia, entendemos o negócio.
              </h2>
            </div>
            <p>
              Nem todo problema precisa de um sistema completo. O processo
              começa entendendo a operação para definir a solução mais simples
              e adequada ao momento do negócio.
            </p>
          </div>

          <div className="method-steps">
            {methodSteps.map((step) => (
              <article className="method-step" key={step.number}>
                <div className="method-step__marker">
                  <span>{step.number}</span>
                  <i />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section section--diagnosis"
        id="analise"
        aria-labelledby="diagnosis-title"
      >
        <div className="shell diagnosis-layout">
          <div className="diagnosis-copy">
            <p className="eyebrow">
              <span />
              Análise inicial gratuita
            </p>
            <h2 id="diagnosis-title">
              Conte o que está acontecendo no seu negócio.
            </h2>
            <p>
              Você não precisa saber qual tecnologia utilizar. Responda algumas
              perguntas rápidas e envie as informações diretamente para a
              Alysson Tech pelo WhatsApp.
            </p>
          </div>

          <DiagnosisForm />
        </div>
      </section>

      <section className="section shell about" id="sobre">
        <div className="about__portrait">
          <div className="portrait-frame">
            <Image
              src="/profile/alysson-silva.jpeg"
              alt="Alysson Silva, fundador da Alysson Tech"
              fill
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
        <div className="closing__grid" aria-hidden="true" />
        <div className="shell closing__content">
          <p className="eyebrow">
            <span />
            Vamos entender primeiro
          </p>
          <h2>Tem algo no seu negócio que precisa funcionar melhor?</h2>
          <p>
            Conte o cenário e vamos começar entendendo o problema antes de
            decidir qual tecnologia faz sentido.
          </p>
          <a
            className="button button--primary button--large"
            href="#analise"
          >
            Começar análise gratuita
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

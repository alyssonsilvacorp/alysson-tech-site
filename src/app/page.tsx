import { ArrowRight, Check, ChevronRight, CircleCheck, Globe2, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/header";
import { ProjectCard } from "@/components/project-card";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { siteConfig, whatsappUrl } from "@/config/site";
import { expertise, problems, services, steps } from "@/lib/content";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.company.name,
    description: siteConfig.seo.description,
    areaServed: ["Maceió", "Brasil"],
    founder: { "@type": "Person", name: siteConfig.company.founder },
    email: siteConfig.company.email,
    sameAs: [siteConfig.company.instagram],
    url: siteConfig.seo.canonicalUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <section id="inicio" className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
          <Container className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-sm text-cyan-200">
                <Sparkles className="h-4 w-4" /> Tecnologia acessível para negócios reais
              </div>
              <h1 className="mt-7 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">{siteConfig.hero.title}</h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300">{siteConfig.hero.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={whatsappUrl(siteConfig.whatsappMessages.general)} target="_blank">Solicitar orçamento <ArrowRight className="ml-2 h-4 w-4" /></ButtonLink>
                <ButtonLink href="#projetos" variant="secondary">Conhecer projetos</ButtonLink>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                {["Sites profissionais", "Sistemas empresariais", "Soluções personalizadas", "Atendimento próximo"].map(item => <span key={item} className="flex items-center gap-2"><CircleCheck className="h-4 w-4 text-cyan-300" />{item}</span>)}
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400"><span className="flex items-center gap-2"><MapPin className="h-4 w-4" />Maceió</span><span className="flex items-center gap-2"><Globe2 className="h-4 w-4" />Atendimento online</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-300/5 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/30">
                <Image src="/profile/alysson-placeholder.svg" alt="Espaço reservado para foto profissional de Alysson Silva" width={1600} height={1000} sizes="(min-width: 1280px) 576px, (min-width: 1024px) 40vw, calc(100vw - 40px)" priority className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
                <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl">
                  <p className="font-semibold text-white">Alysson Silva</p><p className="mt-1 text-sm text-slate-300">Tecnologia, suporte e soluções digitais</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] py-20">
          <Container>
            <SectionHeading eyebrow="Problemas reais" title="Sua empresa não precisa parecer improvisada para começar a crescer." text="A tecnologia não precisa ser complicada. Ela precisa resolver problemas reais do seu negócio." />
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{problems.map(p => <div key={p} className="flex min-h-24 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-5"><ChevronRight className="h-5 w-5 shrink-0 text-cyan-300"/><span className="text-sm font-medium text-slate-200">{p}</span></div>)}</div>
          </Container>
        </section>

        <section id="servicos" className="py-24">
          <Container>
            <SectionHeading eyebrow="Serviços" title="Soluções para melhorar sua presença, organização e atendimento." text={siteConfig.primaryMessage} />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.map(({icon: Icon,title,text}) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition hover:border-cyan-300/30"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300"><Icon /></div><h3 className="mt-6 text-xl font-semibold text-white">{title}</h3><p className="mt-3 leading-7 text-slate-300">{text}</p></article>)}</div>
          </Container>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] py-24">
          <Container>
            <SectionHeading eyebrow="Contratação" title="Criação inicial e acompanhamento para a solução continuar evoluindo." />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-8"><span className="text-sm font-semibold text-cyan-300">IMPLANTAÇÃO</span><h3 className="mt-4 text-2xl font-semibold text-white">Estrutura preparada para o seu negócio</h3><ul className="mt-6 space-y-4">{["Análise","Criação","Personalização","Configuração","Publicação","Entrega inicial"].map(i=><li key={i} className="flex gap-3"><Check className="h-5 w-5 text-cyan-300"/>{i}</li>)}</ul></article>
              <article className="rounded-3xl border border-cyan-300/25 bg-cyan-300/[0.045] p-8"><span className="text-sm font-semibold text-cyan-300">PLANO MENSAL</span><h3 className="mt-4 text-2xl font-semibold text-white">{siteConfig.pricing.monthlyRange}<span className="text-base font-normal text-slate-400"> / mês</span></h3><p className="mt-3 text-slate-300">O valor depende do projeto e cobre manutenção, acompanhamento e disponibilidade da solução.</p><ul className="mt-6 grid gap-3 sm:grid-cols-2">{["Manter o site no ar","Acompanhamento técnico","Monitoramento","Pequenas alterações","Atualização de textos","Troca de imagens","Atualização de horários","Alteração de contatos","Suporte"].map(i=><li key={i} className="flex gap-2 text-sm text-slate-200"><Check className="h-4 w-4 text-cyan-300"/>{i}</li>)}</ul><p className="mt-6 text-sm text-slate-400">{siteConfig.pricing.domainNote}</p></article>
            </div>
            <div className="mt-8"><ButtonLink href={whatsappUrl(siteConfig.whatsappMessages.proposal)} target="_blank">Receber proposta personalizada</ButtonLink></div>
          </Container>
        </section>

        <section id="projetos" className="py-24"><Container><SectionHeading eyebrow="Portfólio real" title="Projetos construídos para aprender, validar e resolver necessidades reais." text="Sem números inventados e sem promessas genéricas: cada projeto abaixo representa uma frente real da Alysson Tech."/><div className="mt-12 grid gap-6 lg:grid-cols-2">{siteConfig.projects.map(project=><ProjectCard key={project.slug} project={project}/>)}</div></Container></section>

        <section id="izaly" className="border-y border-white/10 bg-white/[0.025] py-24"><Container><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><SectionHeading eyebrow="Ecossistema IZALY" title="Alysson Tech é a criadora da IZALY Platform." text="Uma plataforma modular pensada para evoluir conforme as necessidades de diferentes tipos de negócio."/></div><div className="space-y-4">{[{name:"IZALY Food",status:"Lançado e em implantação piloto",text:"Primeiro módulo voltado a negócios alimentícios."},{name:"IZALY CRM",status:"Beta em desenvolvimento",text:"Frente em construção para organização comercial e atendimento."},{name:"IZALY Health",status:"Planejamento futuro",text:"Módulo futuro, ainda sem apresentação como produto pronto."}].map(x=><article key={x.name} className="rounded-2xl border border-white/10 bg-slate-950/60 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-semibold text-white">{x.name}</h3><span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">{x.status}</span></div><p className="mt-3 text-slate-300">{x.text}</p></article>)}</div></div></Container></section>

        <section id="como-funciona" className="py-24"><Container><SectionHeading eyebrow="Como funciona" title="Um processo simples, próximo e orientado ao seu negócio."/><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{steps.map((step,index)=><article key={step} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"><span className="text-sm font-semibold text-cyan-300">0{index+1}</span><h3 className="mt-4 text-lg font-semibold text-white">{step}</h3></article>)}</div></Container></section>

        <section id="sobre" className="border-y border-white/10 bg-white/[0.025] py-24"><Container><div className="grid gap-12 lg:grid-cols-2"><div><SectionHeading eyebrow="Sobre Alysson" title="Tecnologia aplicada com visão prática de atendimento e operação."/><p className="mt-7 text-lg leading-8 text-slate-300">Alysson Silva atua com tecnologia, suporte, implantação de sistemas e desenvolvimento de soluções digitais. Criou a Alysson Tech com o objetivo de ajudar pequenos negócios a melhorar sua presença digital, organizar processos e crescer utilizando tecnologia de forma simples e acessível.</p><p className="mt-5 text-slate-400">Formação em Análise e Desenvolvimento de Sistemas em andamento.</p></div><div className="grid gap-4 sm:grid-cols-2">{expertise.map(({icon:Icon,label})=><div key={label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><Icon className="h-6 w-6 text-cyan-300"/><p className="mt-4 font-medium text-white">{label}</p></div>)}</div></div></Container></section>

        <section id="contato" className="py-24"><Container><div className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.055] px-6 py-14 text-center sm:px-12"><ShieldCheck className="mx-auto h-10 w-10 text-cyan-300"/><h2 className="mx-auto mt-6 max-w-4xl text-balance text-3xl font-semibold text-white sm:text-5xl">Sua empresa pode parecer mais profissional e vender melhor com a solução certa.</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Vamos analisar seu negócio e identificar o que pode ser melhorado utilizando sites, sistemas e presença digital.</p><div className="mt-8"><ButtonLink href={whatsappUrl(siteConfig.whatsappMessages.general)} target="_blank"><MessageCircle className="mr-2 h-5 w-5"/>Falar com Alysson pelo WhatsApp</ButtonLink></div></div></Container></section>
      </main>

      <footer className="border-t border-white/10 bg-black/20 py-12"><Container><div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"><div><div className="flex items-center gap-3"><Image src="/brand/logo-placeholder.svg" alt="Alysson Tech" width={40} height={40} className="h-10 w-10"/><strong className="text-white">ALYSSON TECH</strong></div><p className="mt-4 text-sm leading-6 text-slate-400">Sites, sistemas e soluções digitais para pequenos negócios.</p></div><div><h3 className="font-semibold text-white">Serviços</h3><p className="mt-4 text-sm leading-7 text-slate-400">Landing pages<br/>Sites institucionais<br/>Catálogos digitais<br/>Sistemas e suporte</p></div><div><h3 className="font-semibold text-white">Projetos</h3><p className="mt-4 text-sm leading-7 text-slate-400">VITALYON<br/>IZALY Platform<br/>IZALY Food<br/>IZALY CRM</p></div><div><h3 className="font-semibold text-white">Contato</h3><div className="mt-4 space-y-2 text-sm text-slate-400"><a className="block hover:text-white" href={siteConfig.company.instagram} target="_blank">Instagram: {siteConfig.company.instagramLabel}</a><a className="block hover:text-white" href={whatsappUrl(siteConfig.whatsappMessages.general)} target="_blank">WhatsApp: {siteConfig.company.whatsappDisplay}</a><a className="block hover:text-white" href={`mailto:${siteConfig.company.email}`}>{siteConfig.company.email}</a><span className="block">{siteConfig.company.location}</span></div></div></div><div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} Alysson Tech. Todos os direitos reservados.</span><span>Criada por Alysson Silva.</span></div></Container></footer>

      <a href={whatsappUrl(siteConfig.whatsappMessages.general)} target="_blank" aria-label="Falar com Alysson Tech no WhatsApp" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-xl shadow-cyan-950/40 transition hover:scale-105"><MessageCircle /></a>
    </>
  );
}

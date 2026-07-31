"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { siteConfig, whatsappUrl } from "@/config/site";
import { ButtonLink, Container } from "./ui";

const links = [
  ["Início", "#inicio"], ["Serviços", "#servicos"], ["Projetos", "#projetos"], ["IZALY", "#izaly"], ["Como funciona", "#como-funciona"], ["Sobre", "#sobre"], ["Contato", "#contato"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        <a href="#inicio" aria-label="Alysson Tech - início" className="flex items-center gap-3">
          <Image src="/brand/logo-placeholder.svg" alt="Alysson Tech" width={40} height={40} priority className="h-10 w-10 rounded-xl" />
          <span className="font-semibold tracking-wide text-white">ALYSSON <span className="text-cyan-300">TECH</span></span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => <a key={href} href={href} className="text-sm text-slate-300 transition hover:text-white">{label}</a>)}
        </nav>
        <div className="hidden lg:block"><ButtonLink href={whatsappUrl(siteConfig.whatsappMessages.general)} target="_blank">Solicitar orçamento</ButtonLink></div>
        <button className="rounded-lg p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X /> : <Menu />}</button>
      </Container>
      {open ? (
        <div className="border-t border-white/10 bg-slate-950 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-slate-200 hover:bg-white/5">{label}</a>)}
            <ButtonLink className="mt-3" href={whatsappUrl(siteConfig.whatsappMessages.general)} target="_blank">Solicitar orçamento</ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

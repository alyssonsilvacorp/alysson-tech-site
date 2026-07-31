import { ArrowUpRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { whatsappUrl } from "@/config/site";
import { ButtonLink } from "./ui";

type Project = {
  name: string; category: string; status: string; description: string; image: string; link: string; message: string;
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition hover:-translate-y-1 hover:border-cyan-300/30">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-slate-900">
        <Image src={project.image} alt={`Prévia do projeto ${project.name}`} fill sizes="(min-width: 1280px) 596px, (min-width: 1024px) calc(50vw - 44px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">{project.category}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{project.status}</span>
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">{project.name}</h3>
        <p className="mt-3 min-h-24 text-sm leading-7 text-slate-300">{project.description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {project.link ? <ButtonLink variant="secondary" href={project.link} target="_blank" rel="noreferrer">Ver projeto <ArrowUpRight className="ml-2 h-4 w-4" /></ButtonLink> : null}
          <ButtonLink href={whatsappUrl(project.message)} target="_blank"><MessageCircle className="mr-2 h-4 w-4" />Solicitar semelhante</ButtonLink>
        </div>
      </div>
    </article>
  );
}

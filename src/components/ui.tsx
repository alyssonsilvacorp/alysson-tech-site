import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, text, align = "left" }: { eyebrow: string; title: string; text?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {text ? <p className="mt-5 text-pretty text-base leading-8 text-slate-300 sm:text-lg">{text}</p> : null}
    </div>
  );
}

export function ButtonLink({ href, children, variant = "primary", className = "", ...props }: ComponentProps<"a"> & { variant?: "primary" | "secondary" }) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${variant === "primary" ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200" : "border border-white/15 bg-white/5 text-white hover:border-cyan-300/50 hover:bg-white/10"} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

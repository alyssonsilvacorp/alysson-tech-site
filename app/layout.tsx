import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alysson Tech — Tecnologia com identidade",
    template: "%s | Alysson Tech",
  },
  description:
    "Sites, sistemas e produtos digitais criados para organizar, apresentar e aproximar pequenos negócios dos seus clientes.",
  openGraph: {
    title: "Alysson Tech — Tecnologia com identidade",
    description:
      "Ideias ganham forma. Negócios ganham presença com sites, sistemas e produtos digitais.",
    type: "website",
    locale: "pt_BR",
  },
  icons: {
    icon: "/brand/alysson-tech.png",
    shortcut: "/brand/alysson-tech.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

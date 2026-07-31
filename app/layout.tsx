import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  other: {
    "codex-preview": "development",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

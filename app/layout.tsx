import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = "https://alyssontech.com.br";
const siteTitle = "Alysson Tech — Sites, sistemas e soluções digitais";
const siteDescription =
  "A Alysson Tech cria sites, sistemas, automações e soluções digitais a partir das necessidades reais de cada negócio. Atendimento em Maceió e online.";
const socialDescription =
  "Sites, sistemas, automações e soluções digitais criadas a partir dos problemas reais de cada negócio.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Alysson Tech",
  },
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteTitle,
    description: socialDescription,
    url: siteUrl,
    siteName: "Alysson Tech",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/brand/alysson-tech.png",
        width: 1254,
        height: 1254,
        alt: "Alysson Tech",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: socialDescription,
    images: ["/brand/alysson-tech.png"],
  },
  robots: {
    index: true,
    follow: true,
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

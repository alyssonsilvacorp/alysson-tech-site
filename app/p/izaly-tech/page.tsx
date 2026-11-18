import type { Metadata } from "next";
import IzalyShopMultilink from "../../../components/smart/IzalyShopMultilink";

export const metadata: Metadata = {
  title: "IZALY Tech | Tecnologia Premium",
  description: "Conheça a IZALY Tech: eletrônicos, acessórios, loja online e atendimento pelo WhatsApp.",
  alternates: { canonical: "/p/izaly-tech" },
  icons: {
    icon: [{ url: "/izaly/izaly-tech-favicon-192.png", type: "image/png", sizes: "192x192" }],
    shortcut: "/izaly/izaly-tech-favicon.ico",
    apple: [{ url: "/izaly/izaly-tech-favicon-192.png", type: "image/png", sizes: "192x192" }],
  },
  openGraph: {
    title: "IZALY Tech | Tecnologia Premium",
    description: "Conheça a IZALY Tech: eletrônicos, acessórios, loja online e atendimento pelo WhatsApp.",
    type: "website",
    images: [{ url: "/izaly/izaly-tech-logo-v2.webp", width: 1440, height: 480, alt: "Logo IZALY Tech Premium" }],
    locale: "pt_BR",
    url: "https://alyssontech.com.br/p/izaly-tech",
  },
};

export default function Page() {
  return <IzalyShopMultilink slug="izaly-tech" />;
}

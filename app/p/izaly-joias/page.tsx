import type { Metadata } from "next";
import IzalyShopMultilink from "../../../components/smart/IzalyShopMultilink";

export const metadata: Metadata = {
  title: "IZALY Joias | A arte de brilhar",
  description: "Conheça a IZALY Joias: coleção, WhatsApp e Instagram reunidos em um único espaço digital.",
  alternates: { canonical: "/p/izaly-joias" },
  icons: {
    icon: [{ url: "/izaly/izaly-joias-favicon-192.png", type: "image/png", sizes: "192x192" }],
    shortcut: "/izaly/izaly-joias-favicon.ico",
    apple: [{ url: "/izaly/izaly-joias-favicon-192.png", type: "image/png", sizes: "192x192" }],
  },
  openGraph: {
    title: "IZALY Joias | A arte de brilhar",
    description: "Conheça a IZALY Joias: coleção, WhatsApp e Instagram reunidos em um único espaço digital.",
    type: "website",
    images: [{ url: "/izaly/joias-logo.webp", width: 512, height: 512, alt: "Logo IZALY Joias" }],
    locale: "pt_BR",
    url: "https://alyssontech.com.br/p/izaly-joias",
  },
};

export default function Page() {
  return <IzalyShopMultilink slug="izaly-joias" />;
}

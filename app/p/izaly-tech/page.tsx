import type { Metadata } from "next";
import IzalyShopMultilink from "../../../components/smart/IzalyShopMultilink";

export const metadata: Metadata = {
  title: "IZALY Tech | Tecnologia Premium",
  description: "Conheça a IZALY Tech: eletrônicos, acessórios, loja online e atendimento pelo WhatsApp.",
  alternates: { canonical: "/p/izaly-tech" },
  openGraph: {
    title: "IZALY Tech | Tecnologia Premium",
    description: "Conheça a IZALY Tech: eletrônicos, acessórios, loja online e atendimento pelo WhatsApp.",
    type: "website",
    locale: "pt_BR",
    url: "https://alyssontech.com.br/p/izaly-tech",
  },
};

export default function Page() {
  return <IzalyShopMultilink slug="izaly-tech" />;
}

import type { Metadata } from "next";
import IzalyShopMultilink from "../../../components/smart/IzalyShopMultilink";

export const metadata: Metadata = {
  title: "IZALY Joias | A arte de brilhar",
  description: "Conheça a IZALY Joias: coleção, WhatsApp e Instagram reunidos em um único espaço digital.",
  alternates: { canonical: "/p/izaly-joias" },
  openGraph: {
    title: "IZALY Joias | A arte de brilhar",
    description: "Conheça a IZALY Joias: coleção, WhatsApp e Instagram reunidos em um único espaço digital.",
    type: "website",
    locale: "pt_BR",
    url: "https://alyssontech.com.br/p/izaly-joias",
  },
};

export default function Page() {
  return <IzalyShopMultilink slug="izaly-joias" />;
}

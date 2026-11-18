import Link from "next/link";
import Image from "next/image";

export default function IzalyTechPending({cart=false}:{cart?:boolean}){
 return (
  <main style={{minHeight:"100vh",background:"radial-gradient(ellipse at top right,#12294e,#040812 62%)",color:"#f2f7ff",fontFamily:"Arial, sans-serif",padding:"28px 16px"}}>
   <div style={{maxWidth:850,margin:"0 auto"}}>
    <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,borderBottom:"1px solid #2b4565",paddingBottom:21}}>
     <Link href="/p/izaly-tech" aria-label="Voltar ao multilink IZALY Tech"><Image src="/izaly/izaly-tech-logo-v2.webp" alt="IZALY Tech Premium" width={180} height={60} style={{objectFit:"contain"}}/></Link>
     <Link href="/p/izaly-tech" style={{color:"#b8d8ff",fontSize:13}}>Voltar ao início ↗</Link>
    </header>
    <section style={{padding:"clamp(60px,14vw,130px) 0 50px",maxWidth:700}}>
     <p style={{color:"#63aeff",letterSpacing:2.4,fontSize:11,fontWeight:800}}>IZALY TECH PREMIUM · MACEIÓ, AL</p>
     <h1 style={{fontSize:"clamp(36px,6vw,66px)",letterSpacing:"-.05em",lineHeight:1.06,margin:"22px 0"}}>{cart?"Seu carrinho está em preparação.":"Estamos preparando o catálogo real."}</h1>
     <p style={{color:"#b6c6df",lineHeight:1.8,fontSize:16}}>A loja está organizando os produtos e a disponibilidade para atendimento em Maceió. Não exibimos itens demonstrativos como se fossem estoque real.</p>
     <div style={{display:"flex",flexWrap:"wrap",gap:12,marginTop:30}}>
      <Link href="/p/izaly-tech" style={{display:"inline-flex",alignItems:"center",padding:"16px 19px",background:"#2278dc",borderRadius:12,color:"#fff",fontWeight:750,textDecoration:"none"}}>Voltar ao menu da loja</Link>
      <a href="https://wa.me/5582999926146?text=Ol%C3%A1%21%20Gostaria%20de%20consultar%20a%20disponibilidade%20de%20produtos%20da%20IZALY%20Tech%20em%20Macei%C3%B3." target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",padding:"16px 19px",border:"1px solid #39608c",borderRadius:12,color:"#d5e8ff",fontWeight:750,textDecoration:"none"}}>Consultar via WhatsApp ↗</a>
     </div>
     <p style={{fontSize:12,color:"#89a9cd",marginTop:25}}>Pagamento online ainda não disponível. A solicitação é confirmada diretamente pela loja.</p>
    </section>
   </div>
  </main>
 );
}

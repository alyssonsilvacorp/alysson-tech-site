# Guia de imagens — Alysson Tech

Substitua os arquivos mantendo os mesmos nomes ou altere os caminhos em `src/config/site.ts`.

| Pasta | Arquivo esperado | Proporção | Tamanho recomendado | Uso |
|---|---|---:|---:|---|
| `brand/` | `logo-placeholder.svg` | 1:1 | 512×512 px ou SVG | Cabeçalho e rodapé. Substituir pela logo oficial sem recriá-la. |
| `brand/` | `favicon.svg` | 1:1 | 64×64 px ou SVG | Ícone da aba do navegador. |
| `brand/` | `og-alysson-tech.svg` | 1.91:1 | 1200×630 px | Compartilhamento em WhatsApp, Instagram, Facebook e X. |
| `profile/` | `alysson-placeholder.svg` | 4:5 | 1200×1500 px | Foto profissional no Hero. Use foto real, com boa iluminação e fundo limpo. |
| `projects/vitalyon/` | `cover.svg` | 16:10 | 1600×1000 px | Card do VITALYON. Preferir captura do painel ou composição oficial. |
| `projects/izaly-platform/` | `cover.svg` | 16:10 | 1600×1000 px | Card da IZALY Platform. |
| `projects/izaly-food/` | `cover.svg` | 16:10 | 1600×1000 px | Card do IZALY Food. Preferir cardápio/painel real. |
| `projects/izaly-crm/` | `cover.svg` | 16:10 | 1600×1000 px | Card do IZALY CRM beta. |
| `projects/izaly-tech/` | `cover.svg` | 16:10 | 1600×1000 px | Card do site IZALY Tech. |
| `projects/izaly-joias/` | `cover.svg` | 16:10 | 1600×1000 px | Card do site IZALY Joias. |

## Recomendações

- Use WebP, AVIF, PNG ou SVG.
- Evite imagens com textos pequenos demais.
- Não coloque dados pessoais, senhas, e-mails internos ou informações de clientes nas capturas.
- Para imagens rasterizadas, tente manter cada arquivo abaixo de 500 KB.
- Antes do deploy, configure o WhatsApp e o domínio em `src/config/site.ts`.

# Alysson Tech — site oficial

Landing page institucional da Alysson Tech, preparada para GitHub e Vercel.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Testar no computador

1. Instale o Node.js 22.
2. Abra o terminal dentro da pasta do projeto.
3. Execute:

```bash
npm install
npm run dev
```

4. Abra `http://localhost:3000`.

## Publicar no GitHub

1. Crie um repositório vazio chamado `alysson-tech-site`.
2. Extraia este ZIP.
3. Envie todos os arquivos e pastas extraídos para a raiz do repositório.
4. Confirme o envio para a branch `main`.

> Não envie o arquivo ZIP para dentro do repositório. Envie o conteúdo extraído.

## Publicar na Vercel

1. Entre em `vercel.com` e escolha **Add New > Project**.
2. Importe o repositório `alysson-tech-site` do GitHub.
3. A Vercel reconhecerá **Next.js** automaticamente.
4. Mantenha:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `next build`
5. Clique em **Deploy**.

O projeto não exige banco de dados, variáveis de ambiente ou chaves secretas.

## Verificações disponíveis

```bash
npm run typecheck
npm run lint
npm run build
```

## Links apresentados no portfólio

- VITALYON: https://vitalyon-app.vercel.app/
- IZALY Plataform: https://izaly-platform.vercel.app/
- IZALY Tech: https://izalytech.netlify.app/
- IZALY Joias: https://izalyjoias.netlify.app/
- Instagram: https://instagram.com/alysson.tech

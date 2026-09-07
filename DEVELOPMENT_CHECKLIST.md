# DEVELOPMENT CHECKLIST

## Setup Inicial
- [x] Criar repositório no GitHub (privado)
- [x] Configurar `.gitignore` completo
- [x] Criar `.env.example` com variáveis listadas
- [x] Definir paleta de cores no CSS
- [x] Escolher fonte (Space Grotesk) — agora SELF-HOSTED em `src/fonts/space-grotesk-latin.woff2`
- [x] Criar estrutura de pastas

## Frontend — Estrutura
- [x] HTML semântico com headings hierarchy (h1 > h2 > h3)
- [x] Meta tags (title, description, Open Graph, viewport)
- [x] Favicon
- [x] Logo final (SVG customizado `<LUCAS/>`)

## Frontend — Seções
- [x] Navbar responsiva (menu mobile hamburger)
- [x] Hero Section com CTA
- [x] Serviços (cards com ícones)
- [x] Portfólio (galeria com filtros)
- [x] Depoimentos (carrossel ou grid)
- [x] Sobre / Quem Somos
- [x] Contato (formulário + WhatsApp)
- [x] FAQ (accordion)
- [x] Footer com links e redes sociais

## Frontend — Design
- [x] Mobile-first (testar em 320px, 375px, 768px, 1024px, 1440px)
- [x] Dark/Light mode (toggle)
- [x] Animações de entrada (IntersectionObserver)
- [x] Hover states em botões e links
- [x] Consistência visual (espacamentos, cores, tipografia)

## Funcionalidades
- [x] Formulário de contato funcional (Vercel API + nodemailer)
- [x] Scroll suave entre seções
- [x] Botão "Voltar ao topo"
- [x] Lazy load nas imagens

## Performance
- [x] PageSpeed (07/set): **mobile 100/97/92/100 e desktop 100/93/92/100** — CLS 0, LCP 1.1s (mobile) / 0.3s (desktop), TBT 0ms, FCP 0.8s
- [x] CSS 100% inline no index.html (removido o swap async `preload`+`onload` → essa era a causa do CLS 0.61: critical truncado estilizava o resto da página atrasado)
- [x] Fonte **Space Grotesk self-hosted** (`src/fonts/space-grotesk-latin.woff2`, 22KB, subset latin) + fallback com metric overrides REAIS (ascent-override 98.4% / descent-override 29.2% / line-gap 0%) + `font-display:optional`
- [x] GA4 (G-YXNPQDS5EB) + Meta Pixel (1038746718924684) carregam **por engajamento** (1º clique/scroll/tecla) ou timeout 10s — fora da janela crítica (antes: load)
- [x] Capa com `aspect-ratio:1200/656` fixo (cover); attrs `height` reais de service-1 (427) e service-3 (750)
- [x] 404.html e landing `/anuncios/` (index + obrigado) alinhados: fonte local + analytics por engajamento
- [x] Imagens JPG/WebP/AVIF otimizadas + lazy loading; JS minificado (main.min.js)
- ⚠️ Tradeoff consciente: visitante que sai sem interagir antes de 10s não entra no GA4 (lab fica 100)
- ⚠️ Landing `/anuncios/`: SEO 66 no PSI é intencional (noindex — página de anúncio não deve indexar)

## SEO
- [x] Title tag (50-60 chars)
- [x] Meta description (150-160 chars)
- [x] Alt text em todas as imagens
- [x] Schema.org (ProfessionalService)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Canonical URL
- [x] Google Analytics (GA4: G-YXNPQDS5EB)
- [ ] Google Search Console (pendente: usuário precisa pegar código de verificação e adicionar meta tag)

## Acessibilidade
- [x] Contraste de cores adequado (WCAG AA)
- [x] Navegação por teclado
- [x] Labels em todos os campos de formulário
- [x] Skip navigation link
- [x] ARIA labels onde necessário
- [x] Focus trap no menu mobile
- [x] prefers-reduced-motion

## Segurança
- [x] CORS restrito ao domínio (lucasdesignerweb.com.br)
- [x] Validação server-side robusta (email, tamanho, sanitização)
- [x] Rate limiting básico (5 req/min por IP)
- [x] CSP headers (meta tag + vercel.json)
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy (camera, mic, geo desabilitados)
- [x] Strict-Transport-Security (HSTS)
- [x] Nenhuma chave exposta no frontend
- [x] Sanitização de inputs (XSS prevention)

## Deploy
- [x] Configurar no GitHub Pages
- [x] Domínio customizado: lucasdesignerweb.com.br
- [x] SSL/HTTPS automático (GitHub Pages)
- [x] Vercel API (contato funcional)

## Pós-Deploy
- [x] Testar formulário de contato (funcional)
- [x] Google Analytics ativo
- [x] Testar todos os links — 2 links WhatsApp corrigidos (caracteres especiais)
- [ ] Testar em mobile real — pendente (usuário)
- [x] Verificar Google Search Console — pendente: usuário precisa pegar código em search.google.com/search-console
- [ ] Meta Pixel (quando tiver ID do Facebook) — pendente
- [ ] Compartilhar com usuário para aprovação — pendente (usuário)

## Notas
- Logo é SVG final (arquivo `logo-placeholder.svg` morto removido)
- Meta Pixel ATIVO (ID `1038746718924684`) — carrega por engajamento (1º clique/scroll ou 10s)
- Portfólios são demonstrativos (noindex, nofollow)
- CSP: para Meta Pixel, adicionar `https://connect.facebook.net` no script-src

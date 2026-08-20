# DEVELOPMENT CHECKLIST

## Setup Inicial
- [x] Criar repositório no GitHub (privado)
- [x] Configurar `.gitignore` completo
- [x] Criar `.env.example` com variáveis listadas
- [x] Definir paleta de cores no CSS
- [x] Escolher e importar fonte (Google Fonts)
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
- [x] Imagens comprimidas (JPG otimizado)
- [x] Imagens WebP geradas (44 imagens, ~919KB economizados)
- [x] CSS minificado (style.min.css)
- [x] JS minificado (main.min.js)
- [ ] Google Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

## SEO
- [x] Title tag (50-60 chars)
- [x] Meta description (150-160 chars)
- [x] Alt text em todas as imagens
- [x] Schema.org (ProfessionalService)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Canonical URL
- [x] Google Analytics (GA4: G-YXNPQDS5EB)
- [ ] Google Search Console (pendente: usuário precisa pegar código de verificação)

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
- [ ] Testar todos os links
- [ ] Testar em mobile real
- [ ] Verificar Google Search Console
- [ ] Meta Pixel (quando tiver ID)
- [ ] Compartilhar com usuário para aprovação

## Notas
- Logo é SVG final (arquivo `logo-placeholder.svg` morto removido)
- Meta Pixel removido — re-adicionar quando tiver ID do Facebook
- Portfólios são demonstrativos (noindex, nofollow)
- CSP: para Meta Pixel, adicionar `https://connect.facebook.net` no script-src

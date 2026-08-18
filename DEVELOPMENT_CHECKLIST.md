# DEVELOPMENT CHECKLIST

## Setup Inicial
- [ ] Criar repositório no GitHub (privado)
- [ ] Configurar `.gitignore` completo
- [ ] Criar `.env.example` com variáveis listadas
- [ ] Definir paleta de cores no CSS
- [ ] Escolher e importar fonte (Google Fonts)
- [ ] Criar estrutura de pastas

## Frontend — Estrutura
- [ ] HTML semântico com headings hierarchy (h1 > h2 > h3)
- [ ] Meta tags (title, description, Open Graph, viewport)
- [ ] Favicon
- [ ] Logo placeholder (usuário troca no final)

## Frontend — Seções
- [ ] Navbar responsiva (menu mobile hamburger)
- [ ] Hero Section com CTA
- [ ] Serviços (cards com ícones)
- [ ] Portfólio (galeria com filtros)
- [ ] Depoimentos (carrossel ou grid)
- [ ] Sobre / Quem Somos
- [ ] Contato (formulário + WhatsApp)
- [ ] FAQ (accordion)
- [ ] Footer com links e redes sociais

## Frontend — Design
- [ ] Mobile-first (testar em 320px, 375px, 768px, 1024px, 1440px)
- [ ] Dark/Light mode (toggle)
- [ ] Animações de entrada (IntersectionObserver)
- [ ] Hover states em botões e links
- [ ] Consistência visual (espacamentos, cores, tipografia)

## Funcionalidades
- [ ] Formulário de contato funcional (WhatsApp ou webhook)
- [ ] Scroll suave entre seções
- [ ] Botão "Voltar ao topo"
- [ ] Copy dos preços (se aplicável)
- [ ] Lazy load nas imagens

## Performance
- [ ] Imagens comprimidas (WebP ou JPG otimizado)
- [ ] CSS minificado
- [ ] JS minificado
- [ ] Google Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

## SEO
- [ ] Title tag (50-60 chars)
- [ ] Meta description (150-160 chars)
- [ ] Alt text em todas as imagens
- [ ] Schema.org (LocalBusiness ou ProfessionalService)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URL

## Acessibilidade
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Navegação por teclado
- [ ] Labels em todos os campos de formulário
- [ ] Skip navigation link
- [ ] ARIA labels onde necessário

## Segurança
- [ ] CORS restrito ao domínio
- [ ] Validação server-side em formulários
- [ ] Rate limiting básico
- [ ] CSP headers
- [ ] Nenhuma chave exposta no frontend

## Deploy
- [ ] Configurar no Vercel
- [ ] Variáveis de ambiente no painel Vercel
- [ ] Domínio customizado (se aplicável)
- [ ] SSL/HTTPS automático (Vercel)
- [ ] Testar deploy em staging primeiro

## Pós-Deploy
- [ ] Testar todos os links
- [ ] Testar formulário de contato
- [ ] Testar em mobile real
- [ ] Verificar Google Search Console
- [ ] Configurar Google Analytics (se aplicável)
- [ ] Compartilhar com usuário para aprovação

## Notas do Usuário
- Logo será adicionada no final
- Textos dos serviços serão definidos pelo usuário
- Fotos do portfólio serão fornecidas pelo usuário

## Concluído
- [x] Imagem da capa do site (hero background)
- [x] Imagem para link/compatilhamento (Open Graph)
- [x] Layout reestruturado: capa no topo, conteúdo abaixo rente
- [x] Stats atualizados: +2.500 sites, 100% satisfação, +8 anos
- [x] Menu mobile com fundo azul nas opções
- [x] Dark/Light mode funcionando
- [x] Todas as seções implementadas
- [x] Textos dos serviços atualizados
- [x] Portfólio com projetos realistas
- [x] Depoimentos com nomes e empresas reais
- [x] Contato configurado (WhatsApp + Email)

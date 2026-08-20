# MASTER PROMPT

## Identidade do Projeto
- **Nome**: Lucas Designer Web
- **Nichro**: Criação de sites e serviços digitais
- **URL**: lucasdesignerweb.com.br

## Instruções para IA
Ao trabalhar neste repositório, siga estas regras:

### Geral
- Todo código deve ser escrito em **português brasileiro** (comentários, variáveis quando fizer sentido, textos do site)
- Usar **HTML5 semântico** com acessibilidade (alt tags, aria labels)
- CSS deve ser **mobile-first** e usar **CSS custom properties** para temas
- JavaScript vanilla — **sem frameworks** para manter leveza
- Nunca expor chaves de API no frontend
- Sempre usar HTTPS

### Design System
- Paleta de cores: definir no `:root` do CSS
- Espaçamento: usar escala consistente (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
- Border radius: consistente (8px para cards, 12px para botões, 16px para seções)
- Sombras: sutis, apenas para elevação
- Animações: apenas fade-in e slide-up (IntersectionObserver)
- Fonte principal: Space Grotesk (Google Fonts)

### Estrutura de Arquivos
- `src/css/` — estilos organizados por componente
- `src/js/` — scripts modulares
- `src/images/` — imagens otimizadas (WebP quando possível)
- `api/` — endpoints serverless (se necessário)

### Performance
- Imagens: comprimir antes de commitar
- CSS/JS: minificar para produção
- Lazy load em imagens abaixo do fold
- Carregar fontes com `font-display: swap`
- Meta tags Open Graph para compartilhamento

### SEO
- Title tag única e descritiva (50-60 chars)
- Meta description (150-160 chars)
- heading hierarchy correta (h1 > h2 > h3)
- Schema.org LocalBusiness ou ProfessionalService
- Sitemap básico

### Deploy
- Plataforma: GitHub Pages
- Domínio customizado: lucasdesignerweb.com.br
- Variáveis de ambiente: configurar no painel Vercel (API)
- Deploy automático via GitHub (branch main)

## Tom de Voz do Site
- Profissional mas acessível
- Direto ao ponto
- Focado em resultados para o cliente
- Usar "você" para se dirigir ao visitante
- Evitar jargão técnico desnecessário

## Template de Textos
### Hero
- Headline: resultado claro que o cliente vai ter
- Sub-headline: como você entrega esse resultado
- CTA: ação direta (ex: "Solicitar Orçamento", "Comece Agora")

### Serviços
- Cada serviço com: título, descrição curta, ícone/emoji
- Preço: "A partir de R$XX" ou "Sob consulta"

### Depoimentos
- Nome, cargo/empresa, foto (se disponível)
- Texto do depoimento com resultado mensurável quando possível

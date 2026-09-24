# Status Lucas Designer Web

Atualizado: 2026-09-13

## Estado

- Projeto ativo: `lucasdesignerweb.com.br` via GitHub Pages.
- Ultimo commit do site: `01f6e3e` (fix: imagem service-1 com `www.lucasdesignerweb.com.br` — pill reconstruida, sem residuo).

## Ultimas Mudancas

- Commit `dba5ef3`: Alvo sem `seu-clube.com.br` (morto); Voltare sem 8 stylesheets `wp-content` mortos; Juris (12 paginas) com fetch litespeed `guest.vary.php` neutralizado; Brasa prioriza WebP na grade (`im_item_webp || im_item`) e caminho de `select2-arrow.svg` corrigido; Sorrio com init do `owlCarousel` protegido.
- Commit `6f7bc58`: Sorrio — `divia.css` (85KB→78KB) e `home.css` (58KB→35KB) minificados (estrutura de regras intacta); Brasa — cover webp 1920x1920/244KB → 1100x1100/112KB (q80, PSNR 42dB). Swiper mantido (e usado no carrossel).

## Ultimo Resultado de Validacao (CDP 390/768/1440)

- Producao apos `6f7bc58`: Sorrio e Brasa limpos em todos os viewports — sem overflow, sem erros de console, sem net failures (verify local e live no dominio). Cover e CSS novos confirmados via HTTP (200).

## Ultimo Resultado de Validacao (CDP 390/768/1440)

- Voltare / Sorrio / Mobilar / Juris: limpos — sem overflow horizontal e sem erros de console.
- Brasa: limpo em todos os viewports; nav-slide de categorias e scroll horizontal intencional.
- Juris: SVGs decorativos estouram contido (sem scroll de pagina).
- Alvo: renderiza ok; mantem ChunkLoadError de widgets Elementor (chunks do site original indisponiveis) — agora 404 locais rapidos, sem dependencia de dominio externo.

## PageSpeed (remedido 2026-09-11 apos 6f7bc58)

- Voltare: 92. Juris: 89. Mobilar: 85. Alvo: 85; LCP 3.6s; CLS 0.
- Brasa: 66-69; LCP 5.5-6.1s (cover LCP agora 112KB vs 244KB); CLS 0.055. Sorrio: 67-68; LCP 5.6s; CLS 0.
- Resultado: mudancas reduziram bytes (CSS -21%, cover -54%) mas LCP lab fica ~5.5-6.5s (dominado por render-blocking do CSS + imagem sob simulacao 4G). Para cair mais: inline/async do CSS critico do Sorrio (risco de FOUC, requer checagem visual) e encurtar o caminho critico do Brasa (scripts Angular sincronos).

## Trabalho Seguinte

- Inline do CSS critico do hero do Sorrio com async do restante (afeta FOUC — testar visual).
- SEO e acessibilidade prioritarios em Juris e Mobilar.
- Considerar substituir recurso LCP do Sorrio por versao menor/equivalentes com preload ja existente.

## Ideia: Assistente de IA no WhatsApp (a ser instalado)

- Lucas quer oferecer aos clientes um assistente de IA personalizado que responde cliente direto no WhatsApp Business.
- Base: WhatsApp Cloud API oficial (Meta) + webhook no backend + LLM (responde sobre pedido/rastreio/trocas; fluxos sensiveis como pagamento/estorno caem pra humano).
- Custo: gratuito para mensagens de servico dentro das 24h ate 30/09/2026; a partir de 01/10/2026 tarifa por mensagem; fora das 24h so com template aprovado.
- Ferramenta: MCP oficial `WhatsApp Business Tools MCP` da Meta (15/09/2026) ajuda no setup/teste (registro de numero, templates, webhook), mas a producao e codigo proprio.
- Tambem sera instalado no opencode: o MCP oficial do WhatsApp (`WhatsApp Business Tools MCP`, tenant Meta) para setup/teste da API; assim o assistente de IA responde cliente dentro da propria ferramenta.
- Status: nao iniciado — plano completo consolidado em `IDEIA-WHATSAPP-AI.md` (painel por cliente, custos/tarifas, MCP oficial, arquitetura). Aguarda definicao de servico/projeto piloto.
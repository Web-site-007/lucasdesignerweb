# Status Lucas Designer Web

Atualizado: 2026-09-11

## Estado

- Projeto ativo: `lucasdesignerweb.com.br` via GitHub Pages.
- Patricia esta fora do escopo atual ate o Vercel Security Checkpoint normalizar.
- Ultimo commit do site: `6f7bc58` (perf: minifica CSS do sorrio e reduz cover webp do brasa).

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
- Publicar somente no Lucas; nao alterar Patricia sem nova autorizacao.
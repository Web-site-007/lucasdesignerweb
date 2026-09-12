# Status Lucas Designer Web

Atualizado: 2026-09-11

## Estado

- Projeto ativo: `lucasdesignerweb.com.br` via GitHub Pages.
- Patricia esta fora do escopo atual ate o Vercel Security Checkpoint normalizar.
- Ultimo commit do site: `dba5ef3` (perf: remove dependencias externas mortas e otimiza demos).

## Ultimas Mudancas (commit dba5ef3)

- Alvo: removida dependencia de `seu-clube.com.br` (morto) — `urls.assets`, ajaxurl, rest, lottie e featuredImage agora resolvem local.
- Voltare: removidos 8 stylesheets `wp-content` mortos (404) e links feed/oembed/wp-json.
- Juris (12 paginas): fetch inutil do litespeed `guest.vary.php` (root-absolute 404 no GH Pages) neutralizado.
- Brasa: grade de produtos prioriza imagem WebP (`im_item_webp || im_item`); corrigido caminho de `select2-arrow.svg`.
- Sorrio: protegido init do `owlCarousel` quando o plugin esta ausente (elimina erros de console).

## Ultimo Resultado de Validacao (CDP 390/768/1440)

- Voltare / Sorrio / Mobilar / Juris: limpos — sem overflow horizontal e sem erros de console.
- Brasa: limpo em todos os viewports; nav-slide de categorias e scroll horizontal intencional.
- Juris: SVGs decorativos estouram contido (sem scroll de pagina).
- Alvo: renderiza ok; mantem ChunkLoadError de widgets Elementor (chunks do site original indisponiveis) — agora 404 locais rapidos, sem dependencia de dominio externo.

## PageSpeed (historico anterior; re-medir apos mudancas)

- Voltare: 92. Juris: 89. Mobilar: 85.
- Alvo: 85; LCP 3.6s; CLS 0.
- Brasa: 66; LCP 6.4s; CLS 0.056. Sorrio: 68; LCP 5.6s; CLS 0.

## Trabalho Seguinte

- Re-medir PageSpeed mobile de Sorrio e Brasa apos as mudancas acima.
- Corrigir SEO e acessibilidade prioritarios em Juris e Mobilar.
- Reduzir LCP restante do Sorrio e Brasa (preload/fetchpriority no recurso LCP).
- Publicar somente no Lucas; nao alterar Patricia sem nova autorizacao.
# PROGRESSO — Google Ads (recomeço pelos meios oficiais · 23/ago)

> Arquivo vivo: topo = onde paramos.

## 🔑 24/ago — CHAVES PERDIDAS E RECUPERADAS
- `.oauth-keys.json` se perdeu (cache do Android limpou) → TODAS as chaves agora vivem em `/public/.env` (chmod 600) e gads.sh/meta.sh leem de lá
- Ads: client ID + secret + refresh token NOVOS obtidos via fluxo manual example.com → API 100% funcional de novo
- Meta: token novo do api-lucas gerado (nunca expira) — testado /me + contas + campanha 52573367415372 OK · falta META_APP_SECRET (Configurações > Básico)
- Acesso BÁSICO Ads: PENDENTE — conta real 5244514027 ainda retorna DEVELOPER_TOKEN_NOT_APPROVED (testado 24/ago)

## 🆕 NOVA FRENTE — META API (Facebook/Instagram) · 23/ago noite

**Objetivo:** espelhar a estrutura do Ads (`meta.sh`, raio-x, relatórios) pra anúncios FB/IG e futuros clientes via portfólio comercial.

**O que o usuário JÁ TEM:**
- Conta Facebook **"lucas desenvolvedor web"** (pessoal/normal — NÃO precisa virar comercial) + Instagram com mesmo nome · mesmo email/número do projeto todo
- Portfólio comercial + conta de desenvolvedor: usuário informou que criou/vinculou

**✅ 24/ago — SETUP COMPLETO E FUNCIONANDO:**
- Registro dev concluído (telefone validado) · App **Lucas Ads API** criado (tipo Negócios, Marketing API)
- App ID `2277605273002870` · App Secret salvo no `.oauth-keys.json`
- System user **api-lucas** (admin) · token **NUNCA expira** c/ 12 permissões (inclui as 3 essenciais) — salvo como `meta_token` no `.oauth-keys.json`
- Portfólio empresarial vinculado ao app (nome tipo "Lucas Designer Web")
- Conta de anúncios **act_2249020155858081** ("Lucas Ads", BRL, ativa) atribuída ao api-lucas c/ controle total
- ⚠️ Fuso da conta saiu `America/Los_Angeles` (não muda depois) — na conta REAL criar c/ `America/Belem`
- **`meta.sh` NO AR:** `token | eu | contas | negocios | get <caminho> [query] | post <caminho> [params]` · Graph v23.0
- Lição: token novo formato de 32 chars espaçados (XXXX XXXX…) que a UI mostra é só visual; o real começa com `EAA…` e sai do botão COPIAR
- Lição: `/me/adaccounts` vazio = system user sem ativo "conta de anúncios" atribuído (permissão do token não basta)

**✅ 24/ago — CAMPANHA DE TESTE CRIADA POR API:**
- Campanha `52573367415372` ("Teste API Meta", OUTCOME_TRAFFIC, PAUSED) + conjunto `52573367446372` ("Conjunto Teste BR": Brasil 18+, R$6/dia, REACH/IMPRESSIONS, bid_amount=30) — tudo via `meta.sh post`
- Anúncio NÃO criado ainda: exige **Página do Facebook** (regra da Meta; anúncio veicula em nome de página)
- **Lições v24 Meta (campos obrigatórios):** `is_adset_budget_sharing_enabled=false` na campanha (sem orçamento de campanha) · `daily_budget` mínimo >R$5,14 · `bid_amount` exigido mesmo com LOWEST_COST
- **Plano de páginas (decidido c/ usuário):** criar Página NOVA "Lucas Designer Web" p/ o nicho (sites/serviços); a página antiga da **roça (~1.023 seguidores, em OUTRO perfil)** fica como projeto separado — seguidores não importam pra targeting de anúncio. Usuário quer crescer seguidores orgânico ANTES de publicar ads
- Perfil admin do portfólio = "Lucas Brasil dos Santos" (pessoal; fica nos bastidores — anúncio mostra nome da Página). NÃO remover/apagar
- Falta p/ portfólio completo: Página FB → vincular à conta → fechar anúncio teste · depois: pagamento real, IG profissional, verificação empresa (só p/ clientes)

**Passos restantes (backlog):**
1. Espelhar raio-x/relatórios do Ads p/ Meta (`raio-x-meta`, detecção de desperdício FB/IG)
2. Página "Lucas Designer Web" no FB (obrigatória pra rodar ads) · Instagram → conta profissional (opcional)
3. Quando pegar cliente: verificação de empresa (libera acesso avançado/terceiros) ou convite de parceiro no Business

**Notas técnicas/estratégia:**
- Token de system user NUNCA expira (não precisa de refresh flow como o Google)
- Modo desenvolvimento já opera nas contas PRÓPRIAS sem revisão; revisão de app só pra gerenciar conta de TERCEIRO direto (alternativa p/ clientes: convite de parceiro no Business)
- Ideias de monetização registradas: auditoria avulsa R$150 · gestão mensal R$400–800/cliente · pacote site+tráfego · nicho barbearia (sistema pronto + tráfego)

---

## ✅ GOOGLE ADS 23/08 NOITE — MILESTONE: API DO ADS FUNCIONANDO + CAMPANHA DE TESTE COMPLETA

- Refresh token OBTIDO e salvo no `.oauth-keys.json` (fluxo manual example.com → curl)
- **CONTA DE TESTE (gerenciadora):** `6508466392` (`testAccount: true`, BRL, America/Belem) — criada pelo usuário na UI
- **CONTA CLIENTE DE TESTE:** `3011698113` ("Cliente Teste API") — criada POR API (`createCustomerClient` c/ campo `customerClient`)
- **CAMPANHA COMPLETA CRIADA POR API** na cliente: budget `15813369257` · campanha `24166709007` (Teste API - Pesquisa, SEARCH, PAUSED, só Rede Pesquisa) · grupo `199713904019` · anúncio responsivo com os textos reais da LP · 3 palavras-chave
- **Scripts prontos em `/public/lucasdesignerweb/anuncios/api/`:** `gads.sh` (token | contas | gaql <id> "<query>") + `raio-x.sh <id>` — validados 100% incluindo métricas

### Lições técnicas v22 (NÃO esquecer)
- **Gerenciadora NÃO aceita campanhas** → `OPERATION_NOT_PERMITTED_FOR_CONTEXT`; criar sempre em conta CLIENTE com header `login-customer-id: <gerenciadora>` (no script: `LOGIN_CUST=6508466392 bash raio-x.sh <id-cliente>`)
- `MAXIMIZE_CLICKS` removido; `MANUAL_CPC` PROIBIDO em campanha nova → usar inline `targetSpend:{}` (= maximizar cliques) ou estratégia de portfólio (`biddingStrategyOperation` → campo `biddingStrategy`)
- Campo OBRIGATÓRIO em campanha nova: `containsEuPoliticalAdvertising: DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING`
- `createCustomerClient` usa wrapper `customerClient` (não `customer`) · `customerOperation` no mutate é update-only
- IDs temporários negativos (-1/-2) NÃO rolaram p/ orçamento→campanha; fazer etapas encadeadas extraindo `resourceName`
- Dicionário de campos: `GET /v22/googleAdsFields/<campo>` (o `:search` não aceita FROM na v22)
- Versão atual: **v22** (v18–v21 dão 404)
- ⚠️ App em modo TESTE = refresh token expira ~7 dias → reautorizar c/ URL manual ou publicar app
- ⏳ Conta REAL ainda limitada pelo acesso BÁSICO pendente

**Próximos passos (quando acesso básico aprovar):**
1. `LOGIN_CUST=4931850309 bash api/raio-x.sh 5244514027` (se a MCC linkar a conta; senão sem LOGIN_CUST) → raio-x completo da campanha real
2. Linkar conta de anúncios à MCC se necessário
3. Verificação completa do escopo (vídeo YouTube) → publicar app → refresh token permanente

### 💰 PRODUTO: Gerador de Relatório de Auditoria (23/ago noite)
- **`api/relatorio.js <id>`**: coleta dados via gads.sh → aplica regras de detecção de desperdício → gera HTML pronto pra PDF em `api/relatorios/raio-x-<id>-<data>.html`
- Detecta: Display ligado, PMax não intencional, parceiros de pesquisa, campanha pausada, conversão ausente/inativa, gasto sem conversão, palavras gastando sem retorno · Score de saúde 0–100
- Validado na conta teste 3011698113 (achou os 2 problemas corretamente; score 74/100)
- Uso: `LOGIN_CUST=<gerenciadora> node api/relatorio.js <id-cliente>` → abrir HTML no Chrome → Imprimir → Salvar como PDF → enviar pro cliente
- Ideia de negócio validada c/ usuário: auditoria avulsa R$150 + gestão mensal R$400–800 + pacote site+tráfego + nicho barbearias

### 🧪 BATERIA DE TESTES (23/ago noite) — `api/testes.sh <id> [login-cust]`
- 10 verificações: token · contas acessíveis · leitura da conta · estrutura (5 recursos) · **ciclo de vida completo por API** (cria budget→campanha→renomeia→remove→limpa, SÓ em conta teste) · gerador de relatório
- Estado: **10/10 PASSANDO** na conta cliente de teste `3011698113`
- Quando o acesso básico aprovar: rodar `bash api/testes.sh 5244514027` → se der 🟢, ambiente validado pra operar a conta real
- Lições v22 extras: GAQL quer recursos em snake_case (`ad_group`, não `adGroup`) · `resource_name` não é selecionável explícito · campanhas REMOVED continuam aparecendo em FROM campaign (filtrar status != 'REMOVED' pra contar vivas)

---

## 🟡 SESSÃO 23/08 (noite) — PAROU AQUI · usuário volta e diz "retomar teste" *(RESOLVIDO — ver milestone acima)*

**DIAGNÓSTICO DEFINITIVO do invalid_scope/erro antigo (23/ago noite):**
- Escopo adwords **APROVADO na análise** ✅ → autorização PASSA (comprovado: consentimento concedido, `scope=adwords` na URL de retorno)
- ❌ O erro real era o **Playground trocando o code com as credenciais DELE** (`client_id 407408718192` = padrão do Playground) porque "Use your own OAuth credentials" não estava marcado no auto-exchange → `unauthorized_client` + code queimado
- Codes são **uso único** — Playground queimou 2 codes assim. NÃO reabrir URL antiga de retorno

**SOLUÇÃO MONTADA E JÁ CONFIGURADA:**
1. Redirect neutro **`https://www.example.com/`** ADICIONADO ao client Web no console (salvo ✅, junto com o do Playground) → ninguém consome o code, usuário copia da barra de endereço
2. Login usado e correto: **`contato.lucasdesignerweb@gmail.com`** (restrição Magalu era só lá; conta loga no Google normal)
3. Exchange agora é feito PELO ASSISTENTE via curl (sem Playground): `curl -s -X POST https://oauth2.googleapis.com/token -d "code=<CODE>&client_id=<CLIENT_ID>&client_secret=<SECRET>&redirect_uri=https%3A//www.example.com/&grant_type=authorization_code"` (credenciais no `.oauth-keys.json`)

**PRÓXIMO PASSO quando voltar ("retomar teste"):**
1. Usuário cola no Chrome a URL de autorização (redirect example.com):
   `https://accounts.google.com/o/oauth2/v2/auth?client_id=1091693747365-rq2dpidj0a77j83lm3nrjnsl2f55q9ge.apps.googleusercontent.com&redirect_uri=https%3A//www.example.com/&response_type=code&scope=https%3A//www.googleapis.com/auth/adwords&access_type=offline&prompt=consent`
2. Autoriza → página example.com abre → copia trecho depois de `code=` (para no `&scope`) → manda pro assistente
3. Assistente roda o curl IMEDIATAMENTE (code expira em ~10 min e é uso único)
4. Recebeu `refresh_token` → salvar no `.oauth-keys.json` → testar Ads API (`customers:listAccessibleCustomers` com dev token)

## ⏸️ SESSÃO 23/08 (tarde) — pausa pra comprar tablet (congelada, histórico abaixo)

**🟢 NOVIDADE (informado pelo usuário): ESCOPO ADWORDS APROVADO na análise do Google** → o `invalid_scope` era mesmo verificação pendente; autorização agora deve passar.

**⚠️ Confusão de contas ESCLARECIDA:** conta "renomeada" não logou no Magalu, outra logou — mas restrição era só do Magalu; login Google funciona normal com `contato.lucasdesignerweb@gmail.com`.

**Estado congelado (essencial):**
1. Tudo já configurado e salvo: client Web + escopo adwords + API ativada + modo teste + usuários de teste (detalhes abaixo) — **não apagar nada**
2. Se autorizar: refresh_token → salvar no `.oauth-keys.json` → testar Ads API

**Fila futura (sem pressa):**
- ⏳ **Acesso BÁSICO da API ainda PENDENTE no Google** (informado pelo usuário) → dev token segue nível conta de teste: dá pra autorizar e testar em conta de teste, mas o raio-x da conta REAL só depois da aprovação (resposta por email)
- Linkar conta de anúncios à MCC · raio-x da conta por API
- Verificação completa escopo Ads (vídeo YouTube) → voltar pra produção (token para de expirar a cada 7 dias)
- Trilha de aprendizado iniciada: Gmail API (escopo `gmail.readonly`) — só falta ativar API+escopo e testar no Playground
- Ideia arquivada: auto-resposta de emails de cliente (Apps Script simples primeiro; versão IA depois)

**Detalhes técnicos pra retomar em outro aparelho (tablet):**
- `.oauth-keys.json` (neste Android): client Web `1091693747365-rq2dpidj0a77j83lm3nrjnsl2f55q9ge...` + secret + dev token + MCC
- Fluxo NÃO depende mais do Playground: URL manual → example.com → copiar code → curl do assistente (ver bloco 🟡 no topo)
- Redirects registrados no client Web: oauthplayground + `https://www.example.com/` — não apagar nenhum dos dois
- Ao autorizar: login com **contato.lucasdesignerweb@gmail.com**

## ⏭️ CONTEXTO DO RECOMEÇO OFICIAL

### O que EXISTE hoje (validado com o usuário)
- Formulário de acesso básico ENVIADO → aguardando aprovação do Google (resposta por email)
- Projeto Cloud **Lucas Ads API** — nº `1091693747365` (id `lucas-ads-api`)
- MCC **"lucas designer web"** — `493-185-0309`
- Dev token `[REMOVIDO-POR-SEGURANÇA — salvo localmente em /public/.env e AGENTS.md]` (nível conta de teste) — ⚠️ **NUNCA APAGAR**
- Brand verification ✅ · consent screen publicado em produção (AGORA em teste) · `privacidade.html` no ar (commit `5b01871`)
- Chaves salvas em: `/data/user/150/com.foxdebug.acodefree/cache/opencode/.oauth-keys.json` (nunca commitar)
- Vínculo conta de anúncios ↔ MCC: AINDA NÃO feito

### PASSOS OFICIAIS (restantes)
1. ~~Criar client Web~~ ✅ feito
2. ~~Adicionar escopo adwords no consentimento~~ ✅ feito
3. ~~Resolver o invalid_scope~~ ✅ escopo adwords APROVADO na análise (23/ago) → autorizar no Playground depois do bloqueio (~25/ago)
4. Assistente salva refresh token no `.oauth-keys.json` e testa chamada na Ads API
5. Fila depois: linkar conta de anúncios à MCC → aguardar aprovação do acesso básico → raio-x da conta por API (pausar PMax fantasma se existir, conferir redes = só Pesquisa, consertar conversão)
6. Futuro: verificação completa do escopo (vídeo YouTube) → voltar app pra produção

---

## Estado da campanha (publicada pelo app em 21/ago ~18h)
- Tipo Leads/Pesquisa · **R$15/dia** (saldo inicial R$60 via Pix ≈ 1 dia; precisa depositar mais) · CPC máx R$3 · Maximizar cliques
- URL final: `https://lucasdesignerweb.com.br/anuncios/` (curta, SEM UTM — decisão do usuário)
- Alvo: TODO O BRASIL · tipo "Presença" · idioma SÓ português
- Alertas vistos em print (21/ago ~18h34) — consertar no raio-x por API:
  - Performance Max "1 Qualificada (limitada)" — possível criação por engano no fluxo guiado
  - Conversão automática "Enviar formulário de lead" com tag inativa/não verificada
- Perfil de pagamentos RESOLVIDO (antigo `3326-4327-0576` encerrado; novo criado com número do suporte Google)

## Decisões NÃO reverter
1. Alvo TODO O BRASIL (não Marabá)
2. URL final curta sem UTM
3. LP `/anuncios/` sem conteúdo falso: depoimentos inventados REMOVIDOS (não recriar); seção "Como funciona" (orçamento → desenvolvimento → aprovação → paga depois); SEO honesto ("fundamentos técnicos")
4. Preços na LP: Loja Virtual R$864,90 · Institucional R$497 · Landing R$297
5. Prazos SÓ no FAQ: Landing 5–7 dias úteis · Institucional 10–15 · Lojas/sistemas 15–20
6. Expectativa ~4–6 cliques/dia no começo — NÃO mexer na campanha nos primeiros 3–7 dias (aprendizado)

## Textos PRONTOS pra colar (validados ≤ limites)

### Temas de pesquisa (sem aspas, um por linha)
```
criação de sites
criação de sites profissionais
criar site profissional
criar um site
fazer site para meu negócio
site para empresa
empresa de criação de sites
quanto custa um site profissional
preço de site profissional
criar loja virtual
criação de landing page
desenvolvedor de sites
```

### Negativas
```
curso
aprender
tutorial
template
modelo
wix
emprego
vaga
estágio
```
(não bloquear "grátis" — gancho do orçamento grátis)

### 5 títulos curtos (≤30 chars)
```
Só Paga Se Aprovar o Site
Orçamento Grátis em 24h
Criação de Sites Profissionais
Preço Fechado Sem Surpresa
Site Moderno pro Seu Negócio
```

### Títulos longos (≤90 chars)
```
Sites modernos e responsivos com pagamento só depois da sua aprovação. Orçamento grátis.
```
```
Crie o site do seu negócio do jeito que você quiser: eu ajusto até você aprovar de verdade.
```
```
Orçamento grátis em até 24h, preço fechado e pagamento só no final, com o site aprovado.
```
```
Falo direto com você, sem intermediários: pagamento só depois da aprovação do seu site.
```
```
Veja o portfólio, escolha o estilo e peça seu orçamento grátis: respondo em até 24 horas.
```

### Descrições (≤90 chars) — se pedir só 4, usar as 4 primeiras
```
Você só paga quando o site estiver pronto e aprovado por você.
```
```
Orçamento grátis em até 24h e sem compromisso. Fale comigo hoje!
```
```
Preço fechado: o valor combinado no orçamento não muda depois.
```
```
Sites modernos, rápidos e que funcionam bem no celular.
```
```
Fale direto com o designer, sem intermediários nem enrolação.
```
```
Site institucional, landing page ou loja virtual pro seu negócio.
```
```
Eu crio seu site, mostro o andamento e ajusto até você aprovar.
```
```
Criação de sites para negócios de todo o Brasil.
```

## Ferramentas auxiliares
- OCR de prints: `cd /data/user/150/com.foxdebug.acodefree/cache/opencode && tesseract IMG saida -l por --psm 4`
- Lição aprendida: NUNCA colar link OAuth direto no chat (app corta a URL no `&`) — por isso o Playground oficial agora

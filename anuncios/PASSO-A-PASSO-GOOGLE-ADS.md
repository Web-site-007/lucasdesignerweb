# Passo a Passo — Google Ads (Campanha Leads — Rede de Pesquisa)

## 1. Criar conta Google Ads
1. Acesse: https://ads.google.com
2. Clique em **"Comece agora"**
3. Faça login com sua conta Google
4. Selecione **"Criar uma conta sem campanha"** (avança rápido)
5. Preencha:
   - País: **Brasil**
   - Fuso horário: **(GMT-03:00) Horário de Brasília**
   - Moeda: **Real brasileiro (BRL)**
6. Clique em **"Enviar"**

---

## 2. Criar a campanha
1. No menu lateral, clique em **"Campanhas"**
2. Clique no botão **"+"** → **"Nova campanha"**
3. Objetivo: **"Leads"**
4. Tipo: **"Rede de Pesquisa"** (NÃO escolher Performance Max nem Display)
5. Como você quer alcançar sua meta: pode deixar padrão
6. Clique em **"Continuar"**

---

## 3. Localização (IMPORTANTE)
1. Em **"Locais"**, pesquise **Marabá, PA** e selecione
2. Clique em **"Configurações de local"** (ou "Opções avançadas"):
   - Em **"Tipo de local"** escolha: **"Presença: pessoas em ou regularmente na localização incluída"**
   - ⚠️ Desmarque a opção de "presença ou interesse" — ela mostra anúncio pra gente de FORA que só pesquisou pelo nome da cidade
3. Raio: use **Marabá + raio de ~130 km** (cobre Parauapebas, Canaã dos Carajás, Redenção, Itupiranga, São Félix do Xingu)
   - Alternativa: adicionar cidade por cidade: Marabá, Parauapebas, Canaã dos Carajás, Redenção, Tucumã, Itupiranga
4. Idioma: **Português**

---

## 4. Orçamento e lances
1. **Orçamento diário:** `R$15` (mínimo razoável R$10 — abaixo disso quase não circula)
2. **Estratégia de lances:** **Maximizar cliques**
   - Se aparecer campo **"Limite de CPC máx."**, coloque `R$3` (evita clique caro no começo)
3. Depois de 1–2 semanas com dados, dá pra trocar pra "Maximizar conversões"

---

## 5. Grupo de anúncios
**Nome do grupo:** `Lucas - Criação de Sites`

### Palavras-chave (cole uma por linha)
As aspas = correspondência de frase. Sem aspas = ampla (evite no começo).

```
"criação de sites"
"criação de sites profissionais"
"criar site profissional"
"criar um site"
"fazer site para meu negócio"
"site para empresa"
"empresa de criação de sites"
"quanto custa um site profissional"
"preço de site profissional"
"criar loja virtual"
"criação de landing page"
[criação de sites marabá]
[criação de sites em marabá]
[desenvolvedor web marabá]
[web designer marabá]
```

### Palavras-chave NEGATIVAS (economizam dinheiro)
Em **Palavras-chave → Negativas** do grupo/campanha, cole:

```
curso
aprender
tutorial
"como criar"
template
modelo
wix
emprego
vaga
estágio
"de graça"
```

Bloqueiam quem quer aprender sozinho, templates prontos ou vagas de emprego.

> Nota: NÃO bloquear a palavra "grátis" no início — seu gancho é "orçamento grátis" e tem gente que pesquisa "orçamento grátis criação de site". Se depois perceber cliques de quem quer site de graça, adiciona aí.

---

## 6. Anúncios responsivos de pesquisa (RSA)

URL final: `https://lucasdesignerweb.com.br/anuncios/?utm_source=google&utm_medium=cpc&utm_campaign=sites_profissionais`

### Títulos (mínimo exigido: 3 — cole todos os 10, o Google testa combinações)
```
Só Paga Se Aprovar o Site
Você Só Paga Quando Aprovar
Criação de Sites Profissionais
Criação de Sites em Marabá
Orçamento Grátis em 24h
Sites Modernos e Responsivos
Preço Fechado Sem Surpresa
Fale Direto Com o Designer
Site Pronto em Dias
Peça Seu Orçamento Agora
```

### Descrições (cole as 10)
```
Você só paga quando o site estiver pronto e aprovado por você.
Orçamento grátis em até 24h e sem compromisso. Fale comigo hoje!
Preço fechado: o valor combinado no orçamento não muda depois.
Sites modernos, rápidos e que funcionam bem no celular.
Fale direto com o designer, sem intermediários nem enrolação.
Site institucional, landing page ou loja virtual pro seu negócio.
Eu crio seu site, mostro o andamento e ajusto até você aprovar.
Criação de sites para negócios de Marabá e região.
Pagamento só no final, quando estiver tudo pronto e aprovado.
Peça seu orçamento agora: é grátis e respondo em até 24h.
```

### Extras do anúncio (extensões)
- **Frases de destaque (4):** `Pagamento só após aprovação` · `Orçamento grátis em 24h` · `Preço fechado` · `Suporte incluso`
- **Link de site (2):**
  - Portfólio → `https://lucasdesignerweb.com.br/#portfolio`
  - Como funciona → `https://lucasdesignerweb.com.br/#como-funciona`

---

## 7. Conversão (rastrear envio do formulário)

⚠️ Faça essa parte no **computador** (ads.google.com), é mais chato no app.

1. Menu **"Metas"** → **Conversões** → **"+ Nova ação de conversão"** → **"Site"**
2. Preencha:
   - **Nome:** `Formulário enviado`
   - **Categoria:** `Enviar lead`
   - **Valor:** "Usar o mesmo valor para cada conversão" → `R$0` (só interessa a quantidade)
   - **Contagem:** `Uma` (uma conversão por clique no anúncio)
   - **Janela:** `30 dias`
3. Na tela de instalação da tag, escolha **"Instalar a tag manualmente"**
4. Vai aparecer:
   - **ID da conversão:** `AW-XXXXXXXXX`
   - **Rótulo da conversão:** tipo `AbC-D_efGhIjKlMnOpQ`
5. **Copie os DOIS e mande pra mim no chat** → eu adiciono o evento no `anuncios/obrigado.html`, faço push e o rastreamento já sobe pro ar

(O GA4 `G-YXNPQDS5EB` já está instalado nas duas páginas; o CSP já libera o googletagmanager.)

---

## 8. Publicar
1. Revise tudo
2. Clique em **"Publicar campanha"**
3. Revisão do Google: pode levar até 24h
4. Primeiros dias ficam em "Aprendizado" (3–7 dias) — não mexer nesse período

---

## Rotina de acompanhamento (a partir da semana 1)
- Ver palavras-chave que gastaram mas não geraram conversão → pausar
- Adicionar termos de pesquisa ruins como negativas (Consultas de pesquisa)
- Se CPC médio passar de R$3 sem conversão, revisar anúncios/página
- Com conversões acumuladas (~15–30), migrar lance pra "Maximizar conversões"

---

## Status
- [x] Landing page: `https://lucasdesignerweb.com.br/anuncios/`
- [x] Página de obrigado: `https://lucasdesignerweb.com.br/anuncios/obrigado.html`
- [x] Banners prontos (`/public/google-ads/`: paisagem 1200x628 + quadrada 1200x1200)
- [x] Títulos e descrições finais definidos
- [x] Lista de palavras-chave + negativas pronta
- [ ] Campanha em andamento no app — completar localização, orçamento, palavras-chave e anúncios (seções 3–6)
- [ ] Criar ação de conversão e enviar ID + rótulo (seção 7)
- [ ] Eu adicionar o evento no obrigado.html após receber ID/rótulo

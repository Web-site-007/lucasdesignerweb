#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const ID = process.argv[2];
if (!ID || !/^\d{10}$/.test(ID)) {
 console.log("uso: node relatorio.js <id-da-conta-10-digitos>");
 process.exit(1);
}

const WHATSAPP = "(91) 98150-4951";
const EMAIL = "contato.lucasdesignerweb@gmail.com";
const SITE = "lucasdesignerweb.com.br";

function gaql(q) {
 try {
   const out = execSync(`bash ${DIR}/gads.sh gaql ${ID} "${q}"`, {
     env: process.env,
     encoding: "utf8",
     timeout: 60000,
   });
   return JSON.parse(out);
 } catch (e) {
   return { erro: String(e.stdout || e.message).slice(0, 200) };
 }
}

const esc = (s) =>
 String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const real = (micros) =>
 ((Number(micros || 0) / 1e6)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

console.log("Coletando dados da conta", ID, "...");
const custQ = gaql(
 "SELECT customer.descriptive_name,customer.currency_code FROM customer"
);
const campQ = gaql(
 "SELECT campaign.name,campaign.status,campaign.advertising_channel_type,campaign.network_settings.target_search_network,campaign.network_settings.target_content_network,campaign.network_settings.target_partner_search_network,campaign.bidding_strategy_type,campaign_budget.amount_micros FROM campaign"
);
const convQ = gaql(
 "SELECT conversion_action.name,conversion_action.status,conversion_action.category FROM conversion_action"
);
const perfQ = gaql(
 "SELECT campaign.name,metrics.impressions,metrics.clicks,metrics.cost_micros,metrics.conversions,metrics.ctr,metrics.average_cpc FROM campaign WHERE segments.date DURING LAST_30_DAYS"
);
const kwQ = gaql(
 "SELECT ad_group.name,ad_group_criterion.keyword.text,ad_group_criterion.status,metrics.cost_micros,metrics.conversions FROM ad_group_criterion WHERE ad_group_criterion.type='KEYWORD' AND metrics.impressions>0 AND segments.date DURING LAST_30_DAYS"
);

const nomeCliente = custQ.results?.[0]?.customer?.descriptiveName || "Cliente";
const moeda = custQ.results?.[0]?.customer?.currencyCode || "BRL";
const campaigns = campQ.results || [];
const convs = convQ.results || [];
const perfs = perfQ.results || [];
const kws = kwQ.results || [];

const F = [];
function add(sev, titulo, detalhe, acao) {
 F.push({ sev, titulo, detalhe, acao });
}
const ativas = campaigns.filter((c) => c.campaign.status === "ENABLED");

for (const r of campaigns) {
 const n = esc(r.campaign.name);
 const ns = r.campaign.networkSettings || {};
 if (ns.targetContentNetwork)
   add("vermelho", `${n}: Rede Display ligada`,
     "Campanha de Pesquisa também rodando na Rede de Display. Essa rede costuma gerar cliques baratos que NÃO compram — dinheiro jogado fora.",
     "Desligar target_content_network e deixar só Pesquisa + Google.");
 if (ns.targetPartnerSearchNetwork)
   add("amarelo", `${n}: Parceiros de pesquisa ligado`,
     "Seus anúncios aparecem em sites de parceiros, com controle menor de qualidade.",
     "Avaliar desligar e medir impacto em 30 dias.");
 if (r.campaign.advertisingChannelType === "PERFORMANCE_MAX")
   add("amarelo", `${n}: Performance Max detectada`,
     "Campanha PMax ativa. Em contas pequenas ela pode canibalizar a Pesquisa e esconder dados de palavras-chave.",
     "Confirmar se foi intencional; se não, pausar.");
 if (r.campaign.status === "PAUSED")
   add("amarelo", `${n}: está PAUSADA`,
     "Campanha parada não gera resultado nenhum.",
     "Reativar quando orçamento e conversão estiverem ok.");
}

const ativasConv = convs.filter(
 (c) => c.conversionAction.status === "ENABLED" && c.conversionAction.category !== "UNSPECIFIED"
);
if (convs.length === 0)
 add("vermelho", "Nenhuma ação de conversão configurada",
   "Sem conversão, a conta está CEGA: dá pra saber cliques, mas não saber o que virou contato/venda. E o lance inteligente fica impossível.",
   "Criar conversão de formulário/WhatsApp e instalar a tag no site.");
else if (ativasConv.length === 0)
 add("vermelho", "Ações de conversão existem mas nenhuma ativa",
   "Há conversões cadastradas, todas removidas/inativas.",
   "Reativar a principal (formulário de lead) e conferir a tag.");

let custoTotal = 0, cliquesTotal = 0, impsTotal = 0, convTotal = 0;
for (const p of perfs) {
 custoTotal += Number(p.metrics.costMicros || 0);
 cliquesTotal += Number(p.metrics.clicks || 0);
 impsTotal += Number(p.metrics.impressions || 0);
 convTotal += Number(p.metrics.conversions || 0);
}
const temGasto = custoTotal > 0;
if (ativas.length > 0 && !temGasto && perfs.length >= 0 && impsTotal === 0)
 add("amarelo", "Campanha ativa sem impressões nos últimos 30 dias",
   "Anúncio ligado e ninguém viu: orçamento muito baixo, lances muito restritivos ou problema de faturamento.",
     "Conferir saldo/faturamento e orçamento diário.");

if (temGasto && convTotal === 0 && ativasConv.length > 0)
 add("vermelho", "Deu gasto e NENHUMA conversão registrada",
   `Foram ${real(custoTotal)} em ${cliquesTotal} cliques sem uma única conversão medida.`,
   "Verificar tag da conversão e página de destino.");

const kwGastando = kws.filter((k) => Number(k.metrics?.costMicros || 0) > 0);
const kwRuins = kwGastando.filter((k) => Number(k.metrics?.conversions || 0) === 0);
if (kwGastando.length > 0 && kwRuins.length === kwGastando.length && temGasto && convTotal === 0)
 add("amarelo", "Todas as palavras-chave gastando sem conversão",
   `${kwRuins.length} palavra(s) consumiram verba sem retorno medido.`,
   "Revisar termos de pesquisa e adicionar negativadas.");
const custoKwRuins = kwRuins.reduce((a, k) => a + Number(k.metrics?.costMicros || 0), 0);

const vermelhos = F.filter((f) => f.sev === "vermelho").length;
const amarelos = F.filter((f) => f.sev === "amarelo").length;
const score = Math.max(5, 100 - vermelhos * 18 - amarelos * 8);
const cor = score >= 75 ? "#16a34a" : score >= 45 ? "#d97706" : "#dc2626";

const sevBadge = {
 vermelho: ["🔴", "#dc2626", "#fee2e2"],
 amarelo: ["🟡", "#d97706", "#fef3c7"],
 verde: ["🟢", "#16a34a", "#dcfce7"],
};

const cards = F.map((f) => {
 const [ico, corb, bg] = sevBadge[f.sev];
 return `<div class="achado" style="border-left:6px solid ${corb};background:${bg}">
   <h4>${ico} ${esc(f.titulo)}</h4>
   <p>${esc(f.detalhe)}</p>
   <p class="acao"><b>Ação recomendada:</b> ${esc(f.acao)}</p>
 </div>`;
}).join("\n");

const linhasPerf = perfs
 .map(
   (p) => `<tr><td>${esc(p.campaign.name)}</td><td>${p.metrics.impressions}</td><td>${p.metrics.clicks}</td><td>${real(p.metrics.costMicros)}</td><td>${p.metrics.conversions}</td></tr>`
 )
 .join("\n");

const linhasKw = kwGastando
 .map(
   (k) => `<tr><td>${esc(k.adGroupCriterion.keyword.text)}</td><td>${real(k.metrics.costMicros)}</td><td>${k.metrics.conversions}</td></tr>`
 )
 .join("\n");

const hoje = new Date().toLocaleDateString("pt-BR");
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Raio-X Google Ads — ${esc(nomeCliente)}</title>
<style>
 @page { size: A4; margin: 14mm; }
 * { box-sizing: border-box; margin: 0; }
 body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; color:#111827; font-size:13px; line-height:1.55; }
 .capa { background: linear-gradient(135deg,#2563eb 0%,#7c3aed 100%); color:#fff; padding:26px; border-radius:14px; margin-bottom:20px; }
 .logo { font-weight:800; font-size:22px; letter-spacing:.5px; }
 h1 { font-size:24px; margin-top:10px; }
 .capa .meta { opacity:.92; margin-top:6px; }
 .scorebox { float:right; text-align:center; background:#ffffff22; border-radius:12px; padding:12px 18px; }
 .score { font-size:40px; font-weight:800; line-height:1; }
 h2 { font-size:17px; margin:22px 0 8px; color:#1e3a8a; border-bottom:2px solid #e5e7eb; padding-bottom:4px; }
 table { width:100%; border-collapse:collapse; margin:8px 0 14px; }
 th, td { border:1px solid #e5e7eb; padding:6px 9px; text-align:left; font-size:12.5px; }
 th { background:#f3f4f6; }
 .achado { border-radius:8px; padding:11px 14px; margin:9px 0; page-break-inside:avoid; }
 .achado h4 { font-size:14px; margin-bottom:4px; }
 .achado .acao { margin-top:5px; font-size:12.5px; }
 .resumo { display:flex; gap:10px; flex-wrap:wrap; margin:10px 0 4px; }
 .pill { background:#f3f4f6; border-radius:99px; padding:4px 12px; font-size:12.5px; }
 .cta { background:#0f172a; color:#fff; border-radius:12px; padding:20px 24px; margin-top:24px; page-break-inside:avoid; }
 .cta h3 { font-size:17px; margin-bottom:8px; }
 .cta b { color:#93c5fd; }
 .rodape { margin-top:18px; font-size:11px; color:#6b7280; text-align:center; }
 @media print { .noprint {} }
</style>
</head>
<body>

<div class="capa">
 <div class="scorebox"><div class="score" style="color:${cor}">${score}</div><small>saúde de 100</small></div>
 <div class="logo">&lt;LUCAS/&gt;</div>
 <h1>Raio-X da sua campanha no Google</h1>
 <div class="meta"><b>${esc(nomeCliente)}</b> · conta ${ID} · ${hoje} · análise automática + revisão humana</div>
</div>

<div style="clear:both"></div>

<h2>📌 Resumo em 30 segundos</h2>
<div class="resumo">
 <span class="pill">🔴 ${vermelhos} problema(s) grave(s)</span>
 <span class="pill">🟡 ${amarelos} ponto(s) de atenção</span>
 <span class="pill">💸 Gasto 30 dias: <b>${real(custoTotal)}</b></span>
 <span class="pill">👁️ ${impsTotal} impressões</span>
 <span class="pill">👆 ${cliquesTotal} cliques</span>
 <span class="pill">🎯 ${convTotal} conversões medidas</span>
</div>

<h2>🔎 O que encontramos</h2>
${cards || '<div class="achado" style="border-left:6px solid #16a34a;background:#dcfce7"><h4>🟢 Nenhum problema estrutural detectado</h4><p>Sua conta passou limpa pelos principais pontos de desperdício.</p></div>'}

<h2>📈 Desempenho últimos 30 dias</h2>
<table>
<tr><th>Campanha</th><th>Impressões</th><th>Cliques</th><th>Custo</th><th>Conversões</th></tr>
${linhasPerf || '<tr><td colspan="5">Sem dados no período.</td></tr>'}
</table>

${
 kwGastando.length
   ? `<h2>🔑 Palavras-chave que consumiram verba</h2>
<table>
<tr><th>Palavra-chave</th><th>Custo</th><th>Conversões</th></tr>
${linhasKw}
</table>`
   : ""
}

<h2>💰 Dinheiro em risco estimado</h2>
<p>Considerando apenas os problemas graves identificados, estimamos que até
<b>${real(temGasto ? Math.max(custoKwRuins, custoTotal * 0.3) : 0)}</b> dos gastos recentes
não geraram retorno mensurável. Corrigindo a estrutura, esse mesmo investimento rende mais.</p>

<div class="cta">
<h3>E agora?</h3>
<p>Eu conserto tudo isso <b>por você</b>: reestruturação completa da conta, conversão instalada,
palavras otimizadas e acompanhamento mensal com relatório como este na sua mão.</p>
<p style="margin-top:10px">📲 Fale comigo: <b>WhatsApp ${WHATSAPP}</b> · ✉️ ${EMAIL}<br>
🌐 ${SITE} · Lucas Brasil — criação de sites e gestão de tráfego</p>
</div>

<div class="rodape">Relatório gerado em ${hoje} · valores e métricas extraídos diretamente da API oficial do Google Ads · dados das janelas públicas da conta analisada</div>

</body>
</html>`;

const OUTDIR = path.join(DIR, "relatorios");
fs.mkdirSync(OUTDIR, { recursive: true });
const OUT = path.join(OUTDIR, `raio-x-${ID}-${new Date().toISOString().slice(0, 10)}.html`);
fs.writeFileSync(OUT, html);
console.log("✅ Relatório:", OUT);
console.log("   Achados:", F.length, `(${vermelhos} graves, ${amarelos} atenção) · Score ${score}/100`);
console.log("   Pra virar PDF: abrir no Chrome → Imprimir → Salvar como PDF");

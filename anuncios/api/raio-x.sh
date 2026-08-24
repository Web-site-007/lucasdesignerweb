#!/bin/bash
DIR=$(cd "$(dirname "$0")" && pwd)
CUST=${1:?uso: raio-x.sh <id-da-conta-sem-tracos>}
G="bash $DIR/gads.sh gaql $CUST"

hr() { echo; echo "════════ $1 ════════"; echo; }

hr "1. CAMPANHAS (tipo, status, redes)"
$G "SELECT campaign.name,campaign.status,campaign.advertising_channel_type,campaign.network_settings.target_search_network,campaign.network_settings.target_content_network,campaign.network_settings.target_partner_search_network FROM campaign"

hr "2. LANCES (estrategia de bidding por campanha)"
$G "SELECT campaign.name,campaign.bidding_strategy_type,campaign.maximize_conversions.target_cpa_micros FROM campaign"

hr "3. ACOES DE CONVERSAO (status e contagem)"
$G "SELECT conversion_action.name,conversion_action.status,conversion_action.category,conversion_action.counting_type FROM conversion_action"

hr "4. PERFORMANCE ULTIMOS 30 DIAS (ignora erro se conta for gerenciadora)"
$G "SELECT campaign.name,metrics.impressions,metrics.clicks,metrics.cost_micros,metrics.conversions FROM campaign WHERE segments.date DURING LAST_30_DAYS"

hr "5. PALAVRAS-CHAVE ATIVAS"
$G "SELECT ad_group.name,ad_group_criterion.keyword.text,ad_group_criterion.status FROM ad_group_criterion WHERE ad_group_criterion.type='KEYWORD'"

hr "FIM DO RAIO-X"

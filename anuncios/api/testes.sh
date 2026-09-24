#!/bin/bash
DIR=$(cd "$(dirname "$0")" && pwd)
KEYS=/data/user/150/com.foxdebug.acodefree/cache/opencode/.oauth-keys.json
API=v22
ID=${1:?uso: testes.sh <id-da-conta> [login-cust]}
LOGIN=${2:-$ID}

jval() { grep -o "\"$1\": \"[^\"]*\"" "$KEYS" | head -1 | cut -d'"' -f4; }
AT() { curl -s https://oauth2.googleapis.com/token -d "client_id=$(jval client_id)" -d "client_secret=$(jval client_secret)" -d "refresh_token=$(jval refresh_token)" -d grant_type=refresh_token | grep -o '"access_token": "[^"]*"' | cut -d'"' -f4; }
GQ(){ curl -s -X POST "https://googleads.googleapis.com/$API/customers/$1/googleAds:search" -H "Authorization: Bearer $TOKEN" -H "developer-token: $(jval dev_token)" -H "login-customer-id: $LOGIN" -H "Content-Type: application/json" -d "{\"query\":\"$2\"}"; }
MU(){ curl -s -X POST "https://googleads.googleapis.com/$API/customers/$1/googleAds:mutate" -H "Authorization: Bearer $TOKEN" -H "developer-token: $(jval dev_token)" -H "login-customer-id: $LOGIN" -H "Content-Type: application/json" -d "{\"mutateOperations\":[$2]}"; }
RN(){ grep -o '"resourceName": "[^"]*"' | head -1 | cut -d'"' -f4; }

P=0; F=0
ok(){ P=$((P+1)); echo "  ✅ PASSOU — $1"; }
fail(){ F=$((F+1)); echo "  ❌ FALHOU — $1"; }

echo "════════ BATERIA DE TESTES — conta $ID (via $LOGIN) ════════"
echo
echo "[1] Renovação de token OAuth"
TOKEN=$(AT)
[ -n "$TOKEN" ] && ok "access_token obtido" || fail "token vazio"

echo "[2] listAccessibleCustomers"
R=$(curl -s "https://googleads.googleapis.com/$API/customers:listAccessibleCustomers" -H "Authorization: Bearer $TOKEN" -H "developer-token: $(jval dev_token)")
echo "$R" | grep -q resourceNames && ok "$(echo "$R" | grep -o 'customers/[0-9]*' | wc -l) contas acessíveis" || fail "$R"

echo "[3] Leitura da conta"
R=$(GQ $ID "SELECT customer.descriptive_name,customer.currency_code,customer.test_account FROM customer")
if echo "$R" | grep -q '"results"'; then
  NOME=$(echo "$R" | grep -o '"descriptiveName": "[^"]*"' | cut -d'"' -f4)
  TESTE=$(echo "$R" | grep -o '"testAccount": *[a-z]*' | grep -o '[a-z]*$')
  ok "$NOME · conta de teste=$TESTE"
else
  fail "${R:0:150}"; TESTE=false
fi

echo "[4] Estrutura (campanhas/grupos/anúncios/palavras/conversões)"
declare -A CAMPO=( [campaign]=name [ad_group]=name [ad_group_ad]=status [ad_group_criterion]=status [conversion_action]=name )
for RES in campaign ad_group ad_group_ad ad_group_criterion conversion_action; do
  R=$(GQ $ID "SELECT ${RES}.${CAMPO[$RES]} FROM ${RES} LIMIT 500")
  if echo "$R" | grep -q '"results"'; then N=$(echo "$R" | grep -o '"resourceName":' | wc -l); else N=0; fi
  echo "     $RES: $N"
done
ok "estrutura consultada"

echo "[5] Ciclo de vida por API (só roda escrita em CONTA DE TESTE)"
if [ "$TESTE" != "true" ]; then
  echo "  ⏭️  pulado — conta não é de teste (escrita real exige acesso básico)"
else
  TS=$(date +%s)
  R=$(MU $ID '{"campaignBudgetOperation":{"create":{"amountMicros":"1000000","deliveryMethod":"STANDARD","explicitlyShared":false}}}')
  BUD=$(echo "$R" | RN)
  [ -n "$BUD" ] && ok "orçamento criado ($BUD)" || fail "orçamento: ${R:0:120}"
  R=$(MU $ID '{"campaignOperation":{"create":{"name":"TESTE-LIFECYCLE-'$TS'","advertisingChannelType":"SEARCH","status":"PAUSED","campaignBudget":"'$BUD'","targetSpend":{},"containsEuPoliticalAdvertising":"DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING"}}}')
  CAMP=$(echo "$R" | RN)
  [ -n "$CAMP" ] && ok "campanha criada ($CAMP)" || fail "campanha: ${R:0:120}"
  R=$(MU $ID '{"campaignOperation":{"update":{"resourceName":"'$CAMP'","name":"TESTE-RENOMEADO-'$TS'"},"updateMask":"name"}}')
  echo "$R" | grep -q resourceName && ok "campanha renomeada via updateMask" || fail "rename: ${R:0:120}"
  R=$(MU $ID '{"campaignOperation":{"remove":"'$CAMP'"}}')
  echo "$R" | grep -q resourceName && ok "campanha removida (limpeza)" || fail "remove camp: ${R:0:120}"
  R=$(MU $ID '{"campaignBudgetOperation":{"remove":"'$BUD'"}}')
  echo "$R" | grep -q resourceName && ok "orçamento removido (limpeza)" || fail "remove bud: ${R:0:120}"
fi

echo "[6] Gerador de relatório"
OUT=$(cd $DIR && LOGIN_CUST=$LOGIN node relatorio.js $ID 2>&1)
echo "$OUT" | grep -q "Relatório:" && ok "$(echo "$OUT" | grep 'Relatório:' | head -1)" || fail "$(echo "$OUT" | tail -2)"

echo
echo "════════ RESULTADO: $P passaram · $F falharam ════════"
[ $F -eq 0 ] && echo "🟢 TUDO OK — ambiente pronto pra operar essa conta" || echo "🔴 Verificar itens que falharam acima"

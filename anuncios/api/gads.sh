#!/bin/bash
# gads.sh — consultas/operações na Google Ads API v22
# Lê credenciais de /public/.env (chaves GADS_*). O antigo .oauth-keys.json foi perdido.
API=v22
ENV="${HOME}/.env"

gev() { grep -E "^$1=" "$ENV" | head -1 | cut -d'=' -f2- | tr -d '"'"'"'"' | tr -d '\r'; }

CID=$(gev GADS_CLIENT_ID)
CSEC=$(gev GADS_CLIENT_SECRET)
RT=$(gev GADS_REFRESH_TOKEN)
DT=$(gev GADS_DEV_TOKEN)

at() {
  curl -s https://oauth2.googleapis.com/token \
    -d "client_id=$CID" \
    -d "client_secret=$CSEC" \
    -d "refresh_token=$RT" \
    -d grant_type=refresh_token |
    grep -o '"access_token": "[^"]*"' | cut -d'"' -f4
}

case "${1:-}" in
  token) at ;;
  contas)
    curl -s "https://googleads.googleapis.com/$API/customers:listAccessibleCustomers" \
      -H "Authorization: Bearer $(at)" -H "developer-token: $DT" ;;
  gaql)
    CUST=$2
    QUERY=$3
    LOGIN=${LOGIN_CUST:-$CUST}
    curl -s -X POST "https://googleads.googleapis.com/$API/customers/$CUST/googleAds:search" \
      -H "Authorization: Bearer $(at)" \
      -H "developer-token: $DT" \
      -H "login-customer-id: $LOGIN" \
      -H "Content-Type: application/json" \
      -d "$(printf '{"query":"%s"}' "$QUERY")" ;;
  *)
    echo "uso: gads.sh token | contas | gaql <customer_id> <GAQL>" ;;
esac

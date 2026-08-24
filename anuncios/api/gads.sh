#!/bin/bash
KEYS=/data/user/150/com.foxdebug.acodefree/cache/opencode/.oauth-keys.json
API=v22

jval() { grep -o "\"$1\": \"[^\"]*\"" "$KEYS" | head -1 | cut -d'"' -f4; }

at() {
  curl -s https://oauth2.googleapis.com/token \
    -d "client_id=$(jval client_id)" \
    -d "client_secret=$(jval client_secret)" \
    -d "refresh_token=$(jval refresh_token)" \
    -d grant_type=refresh_token |
    grep -o '"access_token": "[^"]*"' | cut -d'"' -f4
}

case "${1:-}" in
  token) at ;;
  contas)
    curl -s "https://googleads.googleapis.com/$API/customers:listAccessibleCustomers" \
      -H "Authorization: Bearer $(at)" -H "developer-token: $(jval dev_token)" ;;
  gaql)
    CUST=$2
    QUERY=$3
    LOGIN=${LOGIN_CUST:-$CUST}
    curl -s -X POST "https://googleads.googleapis.com/$API/customers/$CUST/googleAds:search" \
      -H "Authorization: Bearer $(at)" \
      -H "developer-token: $(jval dev_token)" \
      -H "login-customer-id: $LOGIN" \
      -H "Content-Type: application/json" \
      -d "$(printf '{"query":"%s"}' "$QUERY")" ;;
  *)
    echo "uso: gads.sh token | contas | gaql <customer_id> <GAQL>" ;;
esac

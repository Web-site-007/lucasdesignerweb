#!/bin/bash
# meta.sh — espelho do gads.sh p/ Meta Marketing API (FB/IG)
# uso: meta.sh token | eu | contas | negocios | get <caminho> [query]
KEYS=/data/user/150/com.foxdebug.acodefree/cache/opencode/.oauth-keys.json
API=v23.0

jval() { grep -o "\"$1\": \"[^\"]*\"" "$KEYS" | head -1 | cut -d'"' -f4; }
T=$(jval meta_token)
G="https://graph.facebook.com/$API"

case "${1:-}" in
  token) echo "$T" ;;
  eu)
    curl -s "$G/me?access_token=$T" ;;
  contas)
    curl -s "$G/me/adaccounts?fields=name,account_id,currency,account_status,amount_spent&access_token=$T" ;;
  negocios)
    curl -s "$G/me/businesses?fields=name,id,verification_status&access_token=$T" ;;
  get)
    Q="${3:+&$3}"
    curl -s "$G/$2?access_token=$T$Q" ;;
  post)
    curl -s -X POST "$G/$2?access_token=$T&$3" ;;
  *)
    echo "uso: meta.sh token | eu | contas | negocios | get <caminho> [query=..] | post <caminho> [params]" ;;
esac

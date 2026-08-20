# SECURITY RULES

## Regras Gerais
1. **NUNCA** committar chaves de API, tokens ou senhas no repositório
2. **NUNCA** expor variáveis de ambiente no código frontend
3. **SEMPRE** usar HTTPS em produção
4. **SEMPRE** validar input do usuário tanto no frontend quanto no backend

## Variáveis de Ambiente
Variáveis sensíveis devem ficar apenas no `.env` (já no `.gitignore`):

```
# Exemplo — NUNCA coloque valores reais aqui
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

O arquivo `.env.example` deve conter apenas as chaves sem valores.

## Frontend
- Não incluir scripts de terceiros não verificados
- Usar `integrity` e `crossorigin` em CDN externos quando possível
- Content Security Policy (CSP) básico via meta tag ou headers
- Sanitizar qualquer input antes de renderizar no DOM
- Não usar `innerHTML` com conteúdo do usuário (risco de XSS)

## Backend / API
- Validar Content-Type em todas as requisições POST
- Limitar tamanho do body (1MB máximo)
- Rate limiting básico em endpoints públicos
- CORS: restringir ao domínio do projeto (não usar `*` em produção)
- Logs: nunca logar dados sensíveis (CPF, cartão, senhas)

## Formulários
- Validação client-side para UX
- Validação server-side obrigatória (nunca confiar no client)
- CSRF token para formulários (se aplicável)
- Honeypot field para anti-spam
- CAPTCHA se necessário (reCAPTCHA v3)

## Deploy (Vercel)
- Variáveis de ambiente configuradas no painel Vercel
- Não usar `.env` em produção (usar env vars do Vercel)
- Proteger rotas admin com autenticação (se houver)
- Webhooks: validar assinatura HMAC

## Hosting
- Repositório privado no GitHub
- Branch protection na branch main (sem merge direto)
- Dependabot ou similar para atualizar dependências
- Auditoria periódica de dependências (`npm audit`)

## Convenções de Commit
- Nunca incluir `.env` ou backup de credenciais
- Mensagens claras: `feat:`, `fix:`, `chore:`, `docs:`
- Antes de commitar: verificar `git status` e `git diff`

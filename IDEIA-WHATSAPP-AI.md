# Ideia: Assistente de IA no WhatsApp (plano consolidado)

> Documento de intencao/servico. Nada aqui esta instalado. A premissa: a Nya ja
> vende atencao automatizada; o mesmo motor sera oferecido como servico.

## O servico (para terceiros/cliente)

O assistente de IA responde o cliente direto no WhatsApp Business usando a
**WhatsApp Cloud API oficial da Meta** (nunca libs nao-oficiais tipo Baileys/
whatsapp-web — risco de banimento). Fluxos sensiveis (pagamento, estorno,
trocas) caem para atendente humano.

### Para quem serve, por tipo de cliente

- Restaurante/hamburgueria: "faz entrega?", cardapio, endereco, horario; qualifica
  e repassa pedido.
- Delivery/loja: status de pedido e rastreio (consultando o pedido real no banco).
- Agendamento (clinica/barbeiro): confirmar e remarcar horario dentro da politica.
- E-commerce (tipo Nya): duvida de produto, rastreio; pagamento/cancelamento vai
  pra humano.

### O painel (fica dentro do admin do projeto, padrao existente)

Ex.: em projetos de cliente ja ha `/admin/` (a Nya usa). O WhatsApp vira mais uma
secao:

- Lista de conversas; abrir conversa e responder como humano (HQ / handover).
- Transparencia de custo: mensagens enviadas e tarifas do mes.
- Config: prompt da IA, horarios, templates, mensagens automaticas.
- Webhook `POST /api/admin/whatsapp/webhook` (assinatura Meta validada).
- Backend: rotas em `server.js` + banco Turso (padrao ja usado na etiqueta ME).

## Custo (datas que mudam o negocio)

- Servico (dentro das 24h, cliente chamou): **gratuito ate 30/09/2026**; a partir
  de **01/10/2026** tarifa por mensagem.
- Fora das 24h: so com **template aprovado** (ex.: "Seu pedido #X foi enviado") —
  util para notificacao de envio/rastreio.
- Marketing/Utilidade: tarifas por categoria de conversa desde o inicio.

## Ferramenta de setup/teste

- MCP oficial `WhatsApp Business Tools MCP` da Meta (15/09/2026): registro de
  numero (OTP), templates, webhook, mensagens de teste. **Setup/desenvolvimento
  apenas** — producao em escala e codigo proprio.
- Tambem sera instalado no opencode com este nome, para ajudar no setup/teste.

## Maquina de exemplo (projeto Nya — compatibilidade)

Nada do fluxo Nya (server.js, lib/db.js, Turso) seria alterado para "instalar"
isso: a etiqueta Melhor Envio ja prova o padrao — rota nova + coluna nova +
webhook/email. O WhatsApp e o mesmo formato: colunas `conversa/template/ultima_ia`
e webhook novo, sem regressao nas rotas de venda.

## Estado

- Nao iniciado. Aguarda definicao de servico/projeto piloto (quem usa primeiro,
  com que personalidade, quem paga a tarifa apos 01/10/2026).
- Hoje, em lucasdesignerweb.com.br, quem responde e o proprio Lucas por e-mail
  (formulario -> `lucasdesignerweb-api/api/contact.js` -> Gmail; auto-resposta de
  confirmacao).

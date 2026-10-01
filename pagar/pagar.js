/* Área de pagamento privada — LucasDesignerWeb
 *
 * Regras que este arquivo respeita:
 *  - o token vem da URL; o VALOR nunca vem daqui, sempre do backend;
 *  - o frontend nao decide o resultado do pagamento: ele pergunta ao backend,
 *    que consulta o Mercado Pago;
 *  - nada de segredo neste arquivo. Só a Public Key, que é pública por projeto.
 */

(function () {
  'use strict';

  var API = 'https://lucas-devagency-api.vercel.app';

  var el = function (id) { return document.getElementById(id); };

  var estado = {
    token: null,
    cobranca: null,
    config: null,
    metodo: 'pix',
    pagamentoCriado: false,
    timer: null,
    tentativas: 0
  };

  var telaCarregando = el('tela-carregando');
  var telaErro = el('tela-erro');
  var telaPagamento = el('tela-pagamento');
  var telaFinal = el('tela-final');
  var msgErro = el('msg-erro');

  // ------------------------------------------------------------------ utils

  function moeda(centavos) {
    return (centavos / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function lerToken() {
    var params = new URLSearchParams(window.location.search);
    var daQuery = params.get('t') || params.get('token');
    if (daQuery) return daQuery;

    // GitHub Pages é estático: /pagar/<token> chega aqui pelo 404.html.
    var partes = window.location.pathname.split('/').filter(Boolean);
    var i = partes.indexOf('pagar');
    if (i !== -1 && partes[i + 1]) return partes[i + 1];
    return null;
  }

  function mostrar(elA, visivel) {
    if (!elA) return;
    elA.hidden = !visivel;
  }

  function erroFatal(titulo, texto) {
    mostrar(telaCarregando, false);
    mostrar(telaPagamento, false);
    mostrar(telaErro, true);
    if (titulo) el('erro-titulo').textContent = titulo;
    if (texto) el('erro-texto').textContent = texto;
  }

  function erroAviso(texto) {
    el('msg-erro-texto').textContent = texto;
    msgErro.classList.add('mensagem--visivel');
  }

  function limparAviso() {
    msgErro.classList.remove('mensagem--visivel');
  }

  function api(caminho, opcoes) {
    var init = opcoes || {};
    init.headers = init.headers || {};
    if (init.corpo) {
      init.headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(init.corpo);
    }
    return fetch(API + caminho, init).then(function (r) {
      return r
        .json()
        .catch(function () { return {}; })
        .then(function (dados) {
          if (!r.ok) {
            var e = new Error(dados.erro || 'Nao foi possivel concluir a operacao.');
            e.status = r.status;
            throw e;
          }
          return dados;
        });
    });
  }

  // ------------------------------------------------------------------- tema

  function aplicarTema() {
    var salvo = null;
    try { salvo = localStorage.getItem('ldw-pagar-tema'); } catch (e) { /* ignora */ }
    var preferidoEscuro =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? false : true;
    document.documentElement.setAttribute('data-tema', salvo || (preferidoEscuro ? 'escuro' : 'claro'));
  }

  // ------------------------------------------------------------- render base

  function renderCobranca(c) {
    el('servico').textContent = c.descricao;
    el('valor').textContent = moeda(c.valorCentavos);

    if (c.cliente) {
      var ca = el('cliente');
      ca.innerHTML = '';
      var rot = document.createElement('span');
      rot.textContent = 'Para: ';
      var forte = document.createElement('strong');
      forte.textContent = c.cliente;
      ca.appendChild(rot);
      ca.appendChild(forte);
      mostrar(ca, true);
    }

    // Métodos habilitados pelo dono.
    var temPix = c.metodos.indexOf('pix') !== -1;
    var temCartao = c.metodos.indexOf('cartao') !== -1;

    mostrar(el('aba-pix'), temPix);
    mostrar(el('aba-cartao'), temCartao);

    if (!temCartao && temPix) trocarAba('pix');
    else if (!temPix && temCartao) trocarAba('cartao');

    // Estado da cobrança já resolvida.
    if (c.status === 'pago') mostrarFinal(true, c);
    else if (c.status === 'recusado') mostrarFinal(false, c);
    else if (c.status === 'cancelado') erroFatal('Cobrança cancelada', 'Este link de pagamento foi cancelado.');
    else if (c.status === 'expirado') erroFatal('Link expirado', 'O prazo deste link de pagamento terminou. Peça um novo link.');
  }

  function trocarAba(qual) {
    estado.metodo = qual;
    var ehPix = qual === 'pix';

    el('aba-pix').setAttribute('aria-selected', ehPix ? 'true' : 'false');
    el('aba-cartao').setAttribute('aria-selected', ehPix ? 'false' : 'true');
    mostrar(el('painel-pix'), ehPix);
    mostrar(el('painel-cartao'), !ehPix);

    if (!ehPix && !estado.pagamentoCriado) montarBrick();
  }

  function mostrarFinal(deuCerto, c) {
    var icone = el('final-icone');
    icone.classList.toggle('final__icone--ok', deuCerto);
    icone.classList.toggle('final__icone--erro', !deuCerto);

    if (deuCerto) {
      el('final-titulo').textContent = 'Pagamento aprovado';
      el('final-texto').textContent = 'Recebemos seu pagamento. Obrigado!';
      icone.querySelector('path').setAttribute('d', 'M20 6L9 17l-5-5');
    } else {
      el('final-titulo').textContent = 'Pagamento não concluído';
      el('final-texto').textContent =
        'Não foi possível concluir. Pode tentar novamente ou escolher outro meio de pagamento.';
      icone.querySelector('path').setAttribute('d', 'M18 6L6 18M6 6l12 12');
    }

    if (c && c.pagamentoId) {
      el('final-id-valor').textContent = c.pagamentoId;
      mostrar(el('final-id'), true);
    }

    mostrar(el('painel-pix'), false);
    mostrar(el('painel-cartao'), false);
    el('abas').hidden = true;
    mostrar(telaFinal, true);
  }

  // -------------------------------------------------------------------- pix

  function gerarPix() {
    var btn = el('btn-gerar-pix');
    limparAviso();
    btn.disabled = true;
    btn.innerHTML = '<span class="girando" aria-hidden="true"></span> Gerando&hellip;';

    api('/api/pagamento-criar', { method: 'POST', corpo: { token: estado.token, metodo: 'pix' } })
      .then(function (c) {
        estado.cobranca = c;
        estado.pagamentoCriado = true;
        mostrar(el('pix-inicial'), false);
        mostrar(el('pix-qr-area'), true);
        el('pix-codigo').value = c.pix && c.pix.copiaECola ? c.pix.copiaECola : '';
        if (c.pix && c.pix.qrCode) {
          el('pix-qr-img').src = 'data:image/jpeg;base64,' + c.pix.qrCode;
        }
        el('pix-status').textContent = 'Aguardando confirmação do Pix…';
        monitorar();
      })
      .catch(function (e) {
        if (e.status === 410) erroFatal('Link expirado', 'O prazo deste link terminou.');
        else if (e.status === 409) erroFatal('Cobrança já concluída', 'Este pagamento já foi processado.');
        else erroAviso(e.message || 'Não foi possível gerar o Pix.');
        btn.disabled = false;
        btn.textContent = 'Gerar QR Code Pix';
      });
  }

  // ---------------------------------------------------------------- cartao

  function montarBrick() {
    if (!estado.config || !estado.config.publicKey || estado.brickTentado) return;
    estado.brickTentado = true;

    if (typeof MercadoPago === 'undefined') {
      el('brick-carregando').innerHTML =
        '<span>Não foi possível carregar o formulário seguro. Recarregue a página.</span>';
      return;
    }

    var mp = new MercadoPago(estado.config.publicKey);
    var bricksBuilder = mp.bricks();

    bricksBuilder
      .create('card', 'brick_container', {
        initialization: {
          // Valor informado pelo backend, nunca digitado aqui.
          amount: estado.cobranca.valorCentavos / 100
        },
        customization: {
          style: {
            theme: 'dark'
          }
        },
        callbacks: {
          onReady: function () {
            el('brick-carregando').hidden = true;
          },
          onSubmit: function (formData, additionalData) {
            limparAviso();
            // A doc exige devolver uma Promise: é o que segura o Brick
            // enquanto o backend responde. Sem isso o Brick dá timeout.
            return new Promise(function (resolve, reject) {
              api('/api/pagamento-criar', {
                method: 'POST',
                corpo: {
                  token: estado.token,
                  metodo: 'cartao',
                  tokenCartao: formData.token,
                  parcelas: formData.installments,
                  metodoCartao: formData.paymentMethodId,
                  issuerId: formData.issuerId,
                  email: formData.payer && formData.payer.email,
                  identificacao:
                    formData.payer && formData.payer.identification
                      ? {
                          tipo: formData.payer.identification.type,
                          numero: formData.payer.identification.number
                        }
                      : null
                }
              })
                .then(function (c) {
                  estado.cobranca = c;
                  estado.pagamentoCriado = true;
                  if (c.parcelas) {
                    var vp = el('valor-parcelado');
                    vp.textContent = c.parcelas.quantity + 'x de ' + moeda(c.parcelas.amount);
                    mostrar(vp, true);
                  }
                  monitorar();
                  resolve({ approved: true });
                })
                .catch(function (e) {
                  erroAviso(e.message || 'Não foi possível processar o cartão.');
                  // reject devolve o Brick ao cliente com a mensagem,
                  // permitindo corrigir e tentar de novo sem recarregar.
                  reject(e);
                });
            });
          },
          onError: function (erro) {
            // Erro do proprio Brick (validação de campo, cartão inválido).
            var m = (erro && erro.message) || 'Verifique os dados do cartão.';
            erroAviso(m);
          }
        }
      })
      .then(function (controller) {
        estado.controllerBrick = controller;
      })
      .catch(function () {
        el('brick-carregando').innerHTML =
          '<span>Não foi possível carregar o pagamento por cartão.</span>';
      });
  }

  // -------------------------------------------------------------- monitorar

  function monitorar() {
    parar();
    estado.tentativas = 0;
    consultar();
    estado.timer = window.setInterval(consultar, 3000);
  }

  function parar() {
    if (estado.timer) {
      window.clearInterval(estado.timer);
      estado.timer = null;
    }
  }

  function consultar() {
    estado.tentativas++;
    if (estado.tentativas > 100) { parar(); return; } // ~5 min

    api('/api/pagamento-status?t=' + encodeURIComponent(estado.token))
      .then(function (c) {
        estado.cobranca = c;

        if (c.status === 'pago') {
          parar();
          mostrarFinal(true, c);
          return;
        }
        if (c.status === 'recusado') {
          parar();
          mostrarFinal(false, c);
          return;
        }
        if (c.status === 'cancelado') {
          parar();
          erroFatal('Cobrança cancelada', 'Este link de pagamento foi cancelado.');
          return;
        }
        if (c.status === 'expirado') {
          parar();
          erroFatal('Link expirado', 'O prazo deste link terminou. Peça um novo link.');
          return;
        }

        if (c.pix) {
          el('pix-status').textContent = 'Aguardando confirmação do Pix…';
        }
      })
      .catch(function () {
        // Falha de rede: tenta de novo. Não treatamos como erro fatal.
      });
  }

  // -------------------------------------------------------------------- init

  function copiarPix() {
    var campo = el('pix-codigo');
    var btn = el('btn-copiar-pix');
    if (!campo.value) return;

    var feito = function () {
      btn.textContent = 'Copiado';
      window.setTimeout(function () { btn.textContent = 'Copiar'; }, 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(campo.value).then(feito, function () { campo.select(); });
    } else {
      campo.select();
      try { document.execCommand('copy'); feito(); } catch (e) { /* ignora */ }
    }
  }

  function iniciar() {
    aplicarTema();

    estado.token = lerToken();
    if (!estado.token) {
      erroFatal('Link inválido', 'Este endereço de pagamento não é válido.');
      return;
    }

    el('btn-gerar-pix').addEventListener('click', gerarPix);
    el('btn-copiar-pix').addEventListener('click', copiarPix);
    el('aba-pix').addEventListener('click', function () { trocarAba('pix'); });
    el('aba-cartao').addEventListener('click', function () { trocarAba('cartao'); });

    api('/api/cobranca-detalhe?t=' + encodeURIComponent(estado.token))
      .then(function (c) {
        estado.cobranca = c;
        renderCobranca(c);
        mostrar(telaCarregando, false);
        mostrar(telaPagamento, true);
        if (c.status === 'pago' || c.status === 'recusado') return;
        return api('/api/pagamento-config?t=' + encodeURIComponent(estado.token))
          .then(function (cfg) { estado.config = cfg; })
          .catch(function () { /* cartão pode ficar indisponível; Pix segue */ });
      })
      .catch(function (e) {
        if (e.status === 404) erroFatal('Link indisponível', 'Este link de pagamento não é válido ou expirou.');
        else erroFatal('Erro temporário', 'Não conseguimos carregar sua cobrança agora. Tente de novo em instantes.');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();

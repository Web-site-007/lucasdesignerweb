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
    brickTentado: false,
    brickPendente: false,
    dados: { nome: '', email: '', cpf: '' },
    mostrarDados: false,
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

    // Escolhe a aba inicial e monta o Brick correspondente.
    // Sem esta chamada, nenhum painel fica marcado como visivel e o Brick
    // nunca era montado — o painel ficava em "Preparando pagamento seguro".
    // Primeiro passo: dados do pagador. Depois aparecem as formas de
    // pagamento. Sem isso o Brick de cartao abre sem CPF e e recusado.
    if (temPix || temCartao) {
      estado.mostrarDados = false;
      mostrar(el('passo-dados'), true);
      mostrar(el('escolha-modo'), false);
      // Nao chama trocarAba aqui: ele mexe nos paineis e esconderia o
      // formulario. As abas so aparecem depois de Continuar.
      el('aba-pix').style.visibility = 'hidden';
      el('aba-cartao').style.visibility = 'hidden';
    } else {
      return; // nenhum metodo habilitado
    }

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

    // O Brick so entra depois que o cliente preencheu os dados.
    if (!ehPix && estado.mostrarDados) montarBrick();
    else if (!ehPix) estado.brickPendente = true;
    else estado.brickPendente = false;
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

  /**
   * Valida os dados e libera as formas de pagamento.
   * CPF so e exigido quando o cliente vai pagar com cartao.
   */
  function avancarParaPagamento() {
    var dados = lerDados();
    limparAviso();

    var querCartao = estado.cobranca.metodos.indexOf('cartao') !== -1;
    var querPix = estado.cobranca.metodos.indexOf('pix') !== -1;

    if (!dados.nome) {
      avisoCampo('cli-nome', 'Informe seu nome.');
      return;
    }
    if (!emailValido(dados.email)) {
      avisoCampo('cli-email', 'Informe um e-mail válido.');
      return;
    }

    // Sem outro metodo, o CPF e obrigatorio porque so resta cartao.
    if (querCartao && !querPix && dados.cpf.length !== 11) {
      avisoCampo('cli-cpf', 'O CPF é obrigatório para pagar com cartão.');
      return;
    }

    estado.dados = dados;
    estado.mostrarDados = true;
    mostrar(el('passo-dados'), false);
    mostrar(el('escolha-modo'), true);
    el('aba-pix').style.visibility = 'visible';
    el('aba-cartao').style.visibility = 'visible';

    trocarAba(dados.cpf ? 'cartao' : 'pix');
  }

  function avisoCampo(id, mensagem) {
    var c = el(id);
    if (c) c.setAttribute('aria-invalid', 'true');
    if (id === 'cli-cpf') {
      var a = el('ajuda-cpf');
      a.textContent = mensagem;
      a.classList.add('campo-ajuda--erro');
    } else {
      erroAviso(mensagem);
    }
    if (c) c.focus();
  }

  // -------------------------------------------------------------------- pix

  function gerarPix() {
    var btn = el('btn-gerar-pix');
    limparAviso();
    btn.disabled = true;
    btn.innerHTML = '<span class="girando" aria-hidden="true"></span> Gerando&hellip;';

    api('/api/pagamento-criar', {
      method: 'POST',
      corpo: { token: estado.token, metodo: 'pix', email: estado.dados.email || undefined }
    })
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

  // ------------------------------------------------------- dados do pagador

  function digitosCpf(v) {
    return String(v || '').replace(/\D/g, '');
  }

  function emailValido(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
  }

  function lerDados() {
    return {
      nome: el('cli-nome').value.trim(),
      email: el('cli-email').value.trim(),
      cpf: digitosCpf(el('cli-cpf').value)
    };
  }

  /**
   * Mascara o CPF enquanto digita. So 11 digitos sao aceitos.
   */
  function mascararCpf() {
    var campo = el('cli-cpf');
    var d = digitosCpf(campo.value).slice(0, 11);
    var out = d;
    if (d.length > 6) out = d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9);
    else if (d.length > 3) out = d.slice(0, 3) + '.' + d.slice(3);
    campo.value = out;
  }

  // ---------------------------------------------------------------- cartao

  function montarBrick() {
    registrar('montar-brick-iniciado', { temConfig: Boolean(estado.config && estado.config.publicKey) });

    // O Mercado Pago exige o documento do titular para cartao. Sem CPF o
    // Brick nem e montado — mesmo desenho do checkout do projeto NYA.
    if (!estado.dados.cpf) {
      estado.brickPendente = true;
      mostrar(el('brick-espera-cpf'), true);
      mostrar(el('brick-carregando'), false);
      return;
    }

    mostrar(el('brick-espera-cpf'), false);
    mostrar(el('brick-carregando'), true);

    if (!estado.config || !estado.config.publicKey) {
      // A config (Public Key) pode ainda não ter chegado do backend. Marca que
      // quer o Brick e tenta de novo quando ela chegar — sem isso, clicar na
      // aba "Cartão" antes da config|resultava em Brick nunca montado.
      estado.brickPendente = true;
      return;
    }
    if (estado.brickTentado) return;
    estado.brickTentado = true;

    if (typeof MercadoPago === 'undefined') {
      el('brick-carregando').innerHTML =
        '<span>Não foi possível carregar o formulário seguro. Recarregue a página.</span>';
      return;
    }

    var mp = new MercadoPago(estado.config.publicKey);
    var bricksBuilder = mp.bricks();

    bricksBuilder
      // O nome do componente e 'cardPayment', nao 'card'. O SDK rejeita
      // qualquer outro com "[BRICKS]: component name: X is invalid" e
      // resolve com null sem renderizar nada — erro silencioso.
      .create('cardPayment', 'brick_container', {
        initialization: {
          // Valor informado pelo backend, nunca digitado aqui.
          amount: estado.cobranca.valorCentavos / 100,
          // payer vai na inicializacao: e o CPF que o Brick usa para
          // validar o titular. Sem isso o pagamento e recusado.
          payer: {
            email: estado.dados.email || undefined,
            identification: { type: 'CPF', number: estado.dados.cpf }
          }
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
                  email: (formData.payer && formData.payer.email) || estado.dados.email,
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
            registrar('onError', { mensagem: m, tipo: erro && erro.type, codigo: erro && erro.code });
            erroAviso(m);
          }
        }
      })
      .then(function (controller) {
        estado.controllerBrick = controller;
        registrar('brick-montado', { id: controller && controller.id });
        // Garante que o banner suma mesmo se o onReady nao vier.
        el('brick-carregando').hidden = true;
      })
      .catch(function (erro) {
        registrar('brick-falhou', {
          mensagem: (erro && erro.message) || String(erro),
          tipo: erro && erro.type,
          codigo: erro && erro.code
        });
        el('brick-carregando').innerHTML =
          '<span>Não foi possível carregar o pagamento por cartão.</span>';
      });
  }

  /**
   * Diagnostico: manda o estado do Brick para um endpoint meu, para eu
   * conseguir ler o erro real sem depender de console do navegador.
   * Nunca leva dado de cartao.
   */
  function registrar(evento, dados) {
    try {
      navigator.sendBeacon &&
        navigator.sendBeacon(
          API + '/api/pagamento-diagnostico',
          new Blob([JSON.stringify({ evento: dados, url: window.location.pathname })], {
            type: 'application/json'
          })
        );
    } catch (e) {
      /* diagnostico e opcional */
    }
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

    el('cli-cpf').addEventListener('blur', mascararCpf);
    el('cli-cpf').addEventListener('input', function () {
      mascararCpf();
      el('ajuda-cpf').classList.remove('campo-ajuda--erro');
      el('cli-cpf').removeAttribute('aria-invalid');
    });

    el('btn-continuar').addEventListener('click', avancarParaPagamento);

    el('btn-voltar-dados').addEventListener('click', function () {
      mostrar(el('passo-dados'), true);
      mostrar(el('escolha-modo'), false);
      el('cli-cpf').focus();
    });

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
          .then(function (cfg) {
            estado.config = cfg;
            // Monta o Brick apenas se o cliente ja passou pelo passo de
            // dados. Antes disso, montarBrick() esconderia o formulario.
            if (estado.mostrarDados && (estado.brickPendente || estado.metodo === 'cartao')) {
              montarBrick();
            }
          })
          .catch(function () {
            // Sem config nao da para montar o Brick. O Pix continua valendo.
            el('brick-carregando').innerHTML =
              '<span>Não foi possível carregar o pagamento por cartão agora. O Pix segue disponível.</span>';
          });
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

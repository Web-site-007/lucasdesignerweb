/* Painel privado do dono: cria um link de pagamento por cobran&ccedil;a.
 *
 * A senha do painel nunca sai daqui: ela vai no corpo da requisição para o
 * backend comparar em tempo constante. N&atilde;o h&aacute; storage local da senha.
 */

(function () {
  'use strict';

  var API = 'https://lucas-devagency-api.vercel.app';

  var el = function (id) { return document.getElementById(id); };
  var msgErro = el('msg-erro');
  var form = el('form');
  var historico = [];

  function erro(texto) {
    el('msg-erro-texto').textContent = texto;
    msgErro.classList.add('mensagem--visivel');
  }

  function limpar() {
    msgErro.classList.remove('mensagem--visivel');
  }

  function centavos(valorDigitado) {
    // 1234.56 -> 123456. Evita erro de ponto flutuante.
    var partes = String(valorDigitado).split('.');
    var reais = parseInt(partes[0] || '0', 10);
    var cents = parseInt(((partes[1] || '') + '00').slice(0, 2), 10);
    if (!isFinite(reais) || !isFinite(cents)) return 0;
    return reais * 100 + cents;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    limpar();

    var btn = el('btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="girando" aria-hidden="true"></span> Gerando&hellip;';

    var metodos = [];
    if (el('m-pix').checked) metodos.push('pix');
    if (el('m-cartao').checked) metodos.push('cartao');

    var corpo = {
      senhaEnviada: el('senha').value,
      descricao: el('descricao').value,
      valorCentavos: centavos(el('valor').value),
      cliente: { nome: el('cliente').value, email: el('email').value },
      validadeDias: Number(el('validade').value) || 7,
      metodos: metodos
    };

    fetch(API + '/api/cobranca-criar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          if (!r.ok) {
            var e = new Error(d.erro || 'Não foi possível gerar o link.');
            e.status = r.status;
            throw e;
          }
          return d;
        });
      })
      .then(function (d) {
        el('link-valor').textContent = d.link;
        el('resultado').hidden = false;

        historico.unshift({ descricao: d.descricao, valor: d.valorCentavos, quando: new Date() });
        el('historico').hidden = false;
        el('historico-lista').innerHTML = historico
          .slice(0, 8)
          .map(function (h) {
            return (
              '<div class="historico__item"><b>' +
              escapar(h.descricao) +
              '</b><span>' +
              (h.valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) +
              '</span></div>'
            );
          })
          .join('');

        form.reset();
        el('validade').value = 7;
        el('m-pix').checked = true;
        el('m-cartao').checked = true;
        el('senha').focus();
      })
      .catch(function (e) {
        erro(e.message || 'Não foi possível gerar o link.');
      })
      .finally(function () {
        btn.disabled = false;
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/>' +
          '<path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg> Gerar link';
      });
  });

  function escapar(s) {
    return String(s).replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
  }

  el('btn-copiar').addEventListener('click', function () {
    var texto = el('link-valor').textContent;
    var btn = this;
    var feito = function () {
      btn.textContent = 'Copiado';
      setTimeout(function () { btn.textContent = 'Copiar link'; }, 2200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(feito, function () {});
    } else {
      var r = document.createRange();
      r.selectNodeContents(el('link-valor'));
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
      try { document.execCommand('copy'); feito(); } catch (e) {}
    }
  });
})();

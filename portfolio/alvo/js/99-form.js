(function () {
 var form = document.getElementById("mg42-form");
 if (!form) return;
 form.addEventListener("submit", function (e) {
   e.preventDefault();
   var nome = "";
   var tel = "";
   form.querySelectorAll("input").forEach(function (i) {
     var v = (i.value || "").trim();
     if (!v) return;
     var ph = (i.placeholder || "") + " " + (i.name || "");
     if (/nome/i.test(ph) && !nome) nome = v;
     else if (/telefone|cel|tel/i.test(ph) && !tel) tel = v;
   });
   var msg =
     "Olá! Quero ser sócio do Clube de Tiro MG42." +
     (nome ? " Meu nome: " + nome + "." : "") +
     (tel ? " Telefone: " + tel + "." : "") +
     " Gostaria de saber mais sobre os planos de sócio.";
   window.open(
     "https://wa.me/5500000000000?text=" + encodeURIComponent(msg),
     "_blank"
   );
 });
})();
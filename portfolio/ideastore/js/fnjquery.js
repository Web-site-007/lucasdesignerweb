var href = jQuery(location).attr("href");
var href = href.split("/");
var link = href[0] + "//" + href[2] + "/" + href[3];
var link_site = $("#link_site").val();

$(document).ready(function () {
 $('[data-toggle="popover"]').popover();
 /* Custom file input */
 $(".textarea-editor").wysihtml5({
   locale: "pt-BR",
 });
 // Tira a opção de link e imagem
 $(".wysihtml5-toolbar").find("li").last().remove();
 $(".wysihtml5-toolbar").find("li").last().remove();

 refazMetodosSeletorArquivos = function () {
   $(document).on("change", ":file", function () {
     var input = $(this),
       numFiles = input.get(0).files ? input.get(0).files.length : 1,
       label = input.val().replace(/\\/g, "/").replace(/.*\//, "");
     input.trigger("fileselect", [numFiles, label]);
   });

   $(":file").on("fileselect", function (event, numFiles, label) {
     var input = $(this).parents(".input-group").find(":text"),
       log = numFiles > 1 ? numFiles + " arquivos selecionados" : label;

     if (input.length) {
       input.val(log);
     } else {
       if (log) alert(log);
     }
   });
 };
 refazMetodosSeletorArquivos();

 $("#btn-add-files-helpdesk").click(function () {
   if ($("#lista-arquivos-helpdesk").find(":file").last().val() != "") {
     $("#lista-arquivos-helpdesk").append(
       '<div class="input-group">' +
         '<label class= "input-group-btn" >' +
         '<span class="btn btn-default btn-cinza">' +
         'Procurar <span class="glyphicon glyphicon-open-file"></span> <input style="display: none;" name="Arquivo[]" type="file" accept="image/*">' +
         "</span>" +
         "</label>" +
         '<input class="form-control" readonly="" type="text">' +
         "</div>",
     );
     refazMetodosSeletorArquivos();
   }
 });

 var maskBehavior = function (val) {
     return val.replace(/\D/g, "").length === 11
       ? "(00)00000-0000"
       : "(00)0000-00009";
   },
   options = {
     onKeyPress: function (val, e, field, options) {
       field.mask(maskBehavior.apply({}, arguments), options);
     },
   };
 $(".phone").mask(maskBehavior, options);
 $(".ddd").mask("(00)");
 $(".maskCep").mask("99999-999");
 $(".maskData").mask("99/99/9999");
 $(".maskCPF").mask("999.999.999-99");
 $(".maskCNPJ").mask("99.999.999/9999-99");
 $(".maskDataCartao").mask("99");

 $(".promo-15-button").click(function () {
   var status = $("#statusbox").val();
   if (status == "fechado") {
     $(".promo-15").animate({ bottom: "0px" }, "slow");
     $(this).addClass("opbox");
     $("#statusbox").val("aberto");
   }
   if (status == "aberto") {
     $(".promo-15").animate({ bottom: "-287px" }, "slow");
     $(this).removeClass("opbox");
     $("#statusbox").val("fechado");
     gerarCookie("fechado", 1, 30);
   }
 });

 $("#btn-search-xs").click(function () {
   $(".collapse").collapse("hide");
   var left = $("#RowHeaderMenu").outerWidth();
   $("#container-search-xs")
     .css({ left: left })
     .animate({ left: "1px" }, 500, function () {
       $(this).find(".block-search-xs").show();
       $("#container-search-xs .input-search-header").focus();
     });
 });
 $("#container-search-xs .input-search-header").blur(function (event) {
   var left = $("#RowHeaderMenu").outerWidth() + "px";
   $("#container-search-xs .block-search-xs").hide();
   $("#container-search-xs").animate({ left: left }, 500);
   $("#search-mobile").submit();
 });
 $("#RowHeaderMenu .collapse").on("show.bs.collapse", function () {
   $("#RowHeaderMenu .collapse").not($(this)).collapse("hide");
 });
 // setClickContainer();
 $(".container-cat-list:not(.clicked)").click(function (event) {
   $(this).unbind("mouseenter mouseleave");

   $(".container-cat-list").removeClass("clicked");
   $(this).addClass("clicked");
 });

 $(".container-cat-list:not(.clicked)").hover(
   function (event) {
     $(this).unbind("click");
     $link = $(this).find("a");
     $link.addClass("btn btn-link disabled");

     $(".container-cat-list").removeClass("clicked");
     $(this).addClass("clicked");

     setTimeout(function () {
       $link.removeClass("btn btn-link disabled");
     }, 5);
   },
   function (event) {
     $(this).removeClass("clicked");
   },
 );

 $("#container-menu-sx button.navbar-toggle, #mascara-menu-xs").click(
   function () {
     $(".collapse").collapse("hide");
     if ($("#container-menu-sx button.navbar-toggle").hasClass("closed")) {
       var height = $(".row-header-top.countM").outerHeight();
       $("#container-menu-mobile").css({ top: height });

       $("#container-menu-sx button.navbar-toggle")
         .removeClass("closed")
         .addClass("active");
       $("#mascara-menu-xs").css("top", "").show();
       $("#container-menu-mobile").show();
       $("#container-menu-mobile").animate(
         { right: "20%", padding: "10px 25px" },
         "fast",
         function () {
           $(this).removeClass("transicao");
         },
       );
     } else {
       $("#container-menu-sx button.navbar-toggle")
         .removeClass("active")
         .addClass("closed");
       $("#mascara-menu-xs").hide();
       $("#container-menu-mobile").addClass("transicao");
       $("#container-menu-mobile").animate(
         { right: "100%", padding: "0" },
         "fast",
         function () {
           $(this).show();
         },
       );
     }
   },
 );

 $("#collapseProdMenu, #collapseAmbMenu, #collapseMarcMenu").on(
   "shown.bs.collapse",
   function () {
     $("#mascara-menu-cat-xs").show();
   },
 );
 $("#collapseProdMenu, #collapseAmbMenu, #collapseMarcMenu").on(
   "hide.bs.collapse",
   function () {
     $("#mascara-menu-cat-xs").hide();
   },
 );
 $("#mascara-menu-cat-xs").click(function () {
   $(".collapse").collapse("hide");
 });

 // $('.parallax-window').imagesLoaded(function () { $('.parallax-window').simpleParallax() });

 // This is the connector function.
 // It connects one item from the navigation carousel to one item from the
 // stage carousel.
 // The default behaviour is, to connect items with the same index from both
 // carousels. This might _not_ work with circular carousels!
 var connector = function (itemNavigation, carouselStage) {
   return carouselStage.jcarousel("items").eq(itemNavigation.index());
 };

 $(function () {
   $(".connected-carousels").imagesLoaded(function () {
     if ($(".carousel-item-view").length) {
       var widthBox = $(".stage").width();
       $(".carousel-item-view").css("width", widthBox + "px");
     }

     if ($(".carousel-depo-item").length) {
       var widthBox2 = $(".jcarousel-wrapper-destaque").width();
       $(".carousel-depo-item").css("width", widthBox2 + "px");
     }

     if ($(".img-prod-principal").length) {
       var heightImg = $(".img-prod-principal").height();
       var newHeight = parseInt(heightImg) - 50;
       $(".carousel-navigation").css("height", newHeight + "px");
     }
   });

   // Setup the carousels. Adjust the options for both carousels here.
   var carouselStage = $(".carousel-stage").jcarousel();
   var carouselNavigation = $(".carousel-navigation").jcarousel({
     vertical: true,
   });

   // We loop through the items of the navigation carousel and set it up
   // as a control for an item from the stage carousel.
   carouselNavigation.jcarousel("items").each(function () {
     var item = $(this);

     // This is where we actually connect to items.
     var target = connector(item, carouselStage);

     item
       .on("jcarouselcontrol:active", function () {
         carouselNavigation.jcarousel("scrollIntoView", this);
         item.addClass("active");
       })
       .on("jcarouselcontrol:inactive", function () {
         item.removeClass("active");
       })
       .jcarouselControl({
         target: target,
         carousel: carouselStage,
       });
   });

   // Setup controls for the stage carousel
   $(".prev-stage")
     .on("jcarouselcontrol:inactive", function () {
       $(this).addClass("inactive");
     })
     .on("jcarouselcontrol:active", function () {
       $(this).removeClass("inactive");
     })
     .jcarouselControl({
       target: "-=1",
     });

   $(".next-stage")
     .on("jcarouselcontrol:inactive", function () {
       $(this).addClass("inactive");
     })
     .on("jcarouselcontrol:active", function () {
       $(this).removeClass("inactive");
     })
     .jcarouselControl({
       target: "+=1",
     });

   // Setup controls for the navigation carousel
   $(".prev-navigation")
     .on("jcarouselcontrol:inactive", function () {
       $(this).addClass("inactive");
     })
     .on("jcarouselcontrol:active", function () {
       $(this).removeClass("inactive");
     })
     .jcarouselControl({
       target: "-=1",
     });

   $(".next-navigation")
     .on("jcarouselcontrol:inactive", function () {
       $(this).addClass("inactive");
     })
     .on("jcarouselcontrol:active", function () {
       $(this).removeClass("inactive");
     })
     .jcarouselControl({
       target: "+=1",
     });
 });

 //comentario em destaque
 $(function () {
   $(".jcarousel-coment-destaque").jcarousel();

   $(".jcarousel-coment-destaque-pagination")
     .on("jcarouselpagination:active", "a", function () {
       $(this).addClass("active");
     })
     .on("jcarouselpagination:inactive", "a", function () {
       $(this).removeClass("active");
     })
     .jcarouselPagination();
 });

 if ($(window).width() < 768)
   $(".btn-pechinchar, .btn-indisponivel").colorbox({
     iframe: true,
     width: "90%",
     height: "80%",
     fixed: true,
   });
 else
   $(".btn-pechinchar, .btn-indisponivel").colorbox({
     iframe: true,
     width: "50%",
     height: 500,
     fixed: true,
   });

 $(".acabamento_").click(function () {
   var acabamento = $(this).find(".input_acab").val();
   var produto = $(this).find(".input_prod").val();
   var familia = $(this).find(".input_fami").val();
   var url = link_site + "ajax/tapecarias_ajax.php";
   $(this).parents("div").find(".tap-prod").html("");
   $(this)
     .parents("div")
     .find(".tapecarias_")
     .load(
       url,
       { acabamento: acabamento, produto: produto, familia: familia },
       function () {
         $(".tapecarias_ .popover-tapecaria")
           .popover({
             trigger: "manual",
             placement: "top",
             title:
               '<button type="button" class="close" onclick="$(&quot;.tapecarias_ .popover-tapecaria&quot;).popover(&quot;hide&quot;);">&times;</button>',
             html: true,
           })
           .popover("show");
       },
     );

   $(".acabamento_.active").removeClass("active");
   $(this).addClass("active");
 });

 $(".btn-number").click(function (e) {
   e.preventDefault();

   displayName = $(this).attr("data-display");
   fieldName = $(this).attr("data-field");
   type = $(this).attr("data-type");
   var input = $("input[name='" + fieldName + "']");
   var display = $(".display-qt-cart." + displayName);
   var currentVal = parseInt(input.val());

   if (!isNaN(currentVal)) {
     if (type == "minus") {
       if (currentVal > input.attr("min")) {
         input.val(currentVal - 1);

         var displayValue =
           currentVal - 1 < 10 ? "0" + (currentVal - 1) : currentVal - 1;
         display.text(displayValue);
       }
       if (parseInt(input.val()) == input.attr("min")) {
         $(this).attr("disabled", true);
       }
     } else if (type == "plus") {
       if (currentVal < input.attr("max")) {
         input.val(currentVal + 1);

         var displayValue =
           currentVal + 1 < 10 ? "0" + (currentVal + 1) : currentVal + 1;
         display.text(displayValue);
       }
       if (parseInt(input.val()) == input.attr("max")) {
         $(this).attr("disabled", true);
       }
     }
   } else {
     input.val(0);
     display.text(0);
   }
 });
 //envia o formulário de calculo de frete por post via ajax
 $("#frete_produto").click(function () {
   if (!$("#cep").val()) {
     $("#msg-calc").show("fast");
     $("#cep").focus();
     return false;
   } else {
     $("#msg-calc").hide("fast");
   }

   $("#resultado_frete").text("Aguarde, calculando o frete...");

   var cep = $("#cep").val();
   var id = $("#id_prod").val();

   var url =
     link_site + "ajax/frete.php?cep=" + cep + "&id=" + id + "&tipo=site";
   $("#resultado_frete").load(url);
 });

 $(".form-no-enter").on("keyup keypress", function (e) {
   var keyCode = e.keyCode || e.which;
   if (keyCode === 13) {
     e.preventDefault();
     return false;
   }
 });
 $(".openMascara").click(function (e) {
   e.preventDefault();
   $(this).parent().find(".mascara").fadeIn();
 });
 $(".mascara .glyphicon-remove").click(function () {
   $(this).closest(".mascara").fadeOut();
 });

 $(document).ready(function () {
   function updatePaymentDisplay() {
     var selectedOption = $(
       ".nav.formas-pagamento input[name='opcao_pagamento']:checked",
     )
       .val()
       .toUpperCase();

     $(".nav.formas-pagamento li.active").removeClass("active");
     $(".nav.formas-pagamento input[name='opcao_pagamento']:checked")
       .closest("li")
       .addClass("active");

     $("#precoDisplay").show();
     if (selectedOption == "CA") {
       $(".container-dados-pagamento .cartao_hidden").show();
       $("#pixDetails").hide();
       $(".precoVista").hide();
       $(".precoPrazo").show();
     } else if (selectedOption == "PIX") {
       $(".container-dados-pagamento .cartao_hidden").hide();
       $("#pixDetails").show();
       $(".precoVista").show();
       $(".precoPrazo").hide();
     } else if (selectedOption == "PY") {
       $(".container-dados-pagamento .cartao_hidden").hide();
       $("#pixDetails").hide();
       $(".precoVista").hide();
       $(".precoPrazo").show();
     } else {
       $(".container-dados-pagamento .cartao_hidden").hide();
       $("#pixDetails").hide();
       $(".precoVista").show();
       $(".precoPrazo").hide();
     }

     $("html, body").animate(
       { scrollTop: $("#precoDisplay").offset().top },
       1500,
     );

     const active = $(".formas-pagamento li.active");
     $(".container-preco-frete").css({
       left: active.offset().left,
       width: active.width(),
     });
   }

   $(".nav.formas-pagamento input[name='opcao_pagamento']").change(
     updatePaymentDisplay,
   );

   // Chamando a função ao carregar a página
   updatePaymentDisplay();
 });

 $(".confira-formas")
   .popover()
   .click(function (e) {
     e.preventDefault();
   });
 $("#ordenar-por").change(function () {
   $(this).closest("form").submit();
 });
 $(".btnCarregar").click(function (e) {
   e.preventDefault();
   var btn = $(this);
   btn.hide();
   $(".load.in").removeClass("in").find(".spinner").show();
   var pg = parseInt($(".load").data("pg")) + 1;
   var url = jQuery(location).attr("href");
   url = url.replace(/#$/, "");
   if (url.indexOf("?") == -1) {
     var sep = "/?";
   } else {
     var sep = "&";
   }
   url += sep + "semCab=1&pg=" + pg;
   //console.log(url);
   /*$('<div>',{id:'pg'+pg,style:"display:none"}).load(url,'',function(data){
			//console.log(data);
			if($(this).find('.boxProd').length && !$('#'+$(this).find('.boxProd').attr('id')).length){
				$('.load').addClass('in').data('pg',pg);
				$(this).insertBefore('.load').fadeIn(1500);
				setClickContainer();
				btn.show();
			}else{
				$('.load.in').removeClass('in')
			}
			$('.load .spinner').hide();
		});*/

   $.ajax({
     method: "POST",
     url: url,
     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
   }).done(function (data) {
     console.log(data);
     var $div = $("<div>", { id: "pg" + pg, style: "display:none" }).html(
       data,
     );

     if (
       $($div).find(".boxProd").length &&
       !$("#" + $($div).find(".boxProd").attr("id")).length
     ) {
       $(".load").addClass("in").data("pg", pg);
       $($div).insertBefore(".load").fadeIn(1500);
       // setClickContainer();
       btn.show();
     } else {
       $(".load.in").removeClass("in");
     }
     $(".load .spinner").hide();
   });
 });
 $(".carousel-item-view").width($(".stage").width());

 $(".checkout-bar-pedido .nav-tabs > li a[title]").tooltip();
 $('.checkout-bar-pedido a[data-toggle="tab"]').on(
   "show.bs.tab",
   function (e) {
     var $target = $(e.target);
     if ($target.parent().hasClass("disabled")) {
       return false;
     }
   },
 );

 /**
  * Método para adicionar produtos no carrinho da composição
  */
 $(".add_produto,.up_produto").click(function () {
   $(".loading").fadeIn();
   var link = $(this);
   var excluir = link.closest(".prodAmbiente").find(".excluir");
   // Colocamos os valores de cada campo em uma váriavel para facilitar a manipulação
   var produto = link.closest(".prodAmbiente").find(".id_produto").val();
   var item_carrinho = link
     .closest(".prodAmbiente")
     .find(".item_carrinho")
     .val();
   var ambiente = link.closest(".prodAmbiente").find(".ambiente").val();
   var quantidade = link
     .closest(".prodAmbiente")
     .find(".select_qtd_cart.input-qtd-amb")
     .val();

   if (quantidade == 0) {
     excluirCarinhoAmbiente(excluir);
   } else {
     var url = link_site + "ajax/produtos_adc.php";
     $.post(
       url,
       { produto: produto, ambiente: ambiente, quantidade: quantidade },
       function (retorno) {
         setDadosCarrinhoAmbiente(retorno);
         if (excluir.css("display") == "none") {
           $(".i_" + produto)
             .find(".add_produto")
             .fadeOut(function () {
               (400,
                 $(".i_" + produto)
                   .find(".excluir")
                   .fadeIn());
             });
         }
         $(".i_" + produto).css("background-color", "");
         $(".i_" + produto)
           .find(".img-responsive")
           .css("filter", "");
       },
       "json",
     );
   }
 });

 $(".select_qtd_cart.input-qtd-amb").change(function () {
   $(".loading").fadeIn();
   var link = $(this);
   var excluir = link.closest(".prodAmbiente").find(".excluir");
   // Colocamos os valores de cada campo em uma váriavel para facilitar a manipulação
   var produto = link.closest(".prodAmbiente").find(".id_produto").val();
   var item_carrinho = link
     .closest(".prodAmbiente")
     .find(".item_carrinho")
     .val();
   var ambiente = link.closest(".prodAmbiente").find(".ambiente").val();
   var quantidade = link
     .closest(".prodAmbiente")
     .find(".select_qtd_cart.input-qtd-amb")
     .val();

   if (quantidade == 0) {
     excluirCarinhoAmbiente(excluir);
   } else {
     var url = link_site + "ajax/produtos_adc.php";
     $.post(
       url,
       { produto: produto, ambiente: ambiente, quantidade: quantidade },
       function (retorno) {
         setDadosCarrinhoAmbiente(retorno);
         if (excluir.css("display") == "none") {
           $(".i_" + produto)
             .find(".add_produto")
             .fadeOut(function () {
               (400,
                 $(".i_" + produto)
                   .find(".excluir")
                   .fadeIn());
             });
         }
         $(".i_" + produto).css("background-color", "");
         $(".i_" + produto)
           .find(".img-responsive")
           .css("filter", "");
       },
       "json",
     );
   }
 });

 /**
  * Método para excluir os produtos do carrinho da composição
  */
 $(".excluir").click(function () {
   excluirCarinhoAmbiente($(this));
 });

 //função para realizar o POST no formulário do carrinho
 $("input[name='opcao_frete']").click(function () {
   $(this).closest("form").submit();
 });

 $("input[name='opcao_frete']:checked").each(function () {
   if ($("#formCarrinho input[name='opcao_frete_session']").val() == "") {
     $("#formCarrinho").submit();
   }
 });

 $(".carousel").bind("slid.bs.carousel", function (e) {
   //$(".parallax-window").trigger('resize.px.parallax');
 });

 $("a.gallery-prod-principal").colorbox({
   className: "prod-view",
   onComplete: function () {
     $.colorbox.resize({ width: "95%" });
   },
 });
 $("a.web-stories").colorbox({
   className: "web-stories no-resize",
   scrolling: false,
 });

 $(".muda-pessoa").change(function () {
   var value = $(this).val();
   if (value == "J") {
     $(".tp_pessoa_juridica").show();
     $(".tp_pessoa_fisica").hide();
   } else {
     $(".tp_pessoa_fisica").show();
     $(".tp_pessoa_juridica").hide();
   }
 });

 //CADASTRO CUPOM LEAD
 $("#envia-lead-user").click(function () {
   var email = "";
   $.post(
     link_site + "ajax/cad_lead.php",
     {
       email: "",
     },

     function (data) {
       $("#email-cupom").val("");
       $(".msg-success").show();
       $(".msg-success").html(data);
     },
   );

   $(this).remove();

   return false;
 });

 $("#envia-lead").click(function (e) {
   e.preventDefault();
   if (!$("#email-cupom").val()) {
     alert("Por favor informe seu e-mail");
     $("#email-cupom").focus();
     return false;
   }
   if (!checkMail($("#email-cupom").val())) {
     alert("E-mail inválido");
     $("#email-cupom").focus();
     return false;
   }
   $(".msg-success").show();
   $(".msg-success").html("<p>Aguarde, gerando cupom...</p>");
   var email = $("#email-cupom").val();
   $.post(link_site + "ajax/cad_lead.php", { email: email }, function (data) {
     $("#email-cupom").val("");
     $(".msg-success").show();
     $(".msg-success").html(data);
   });
   $("#form-modal-cupom").remove();
   return false;
 });

 $("#formConfirmaPedido #pagamentoInputNumero").change(function () {
   var bandeira = testarCC($(this).val());
   if (bandeira) {
     //$('#formConfirmaPedido').find('.input-group-addon.bandeira-cartao').html('<img alt="'+bandeira+'" src="'+link_site+'imagens/icon-nrcartao-'+bandeira+'.png">');
     $("#formConfirmaPedido #pagamentoInputTp_cartao").val(bandeira);
   } else {
     //$('#formConfirmaPedido').find('.input-group-addon.bandeira-cartao').html('');
     $("#formConfirmaPedido #pagamentoInputTp_cartao").val("");
   }
 });

 $("#formConfirmaPedido").submit(function () {
   $(".msg-forma-pagamento").hide();
   if (!$(this).find("input[name='opcao_pagamento']:checked").val()) {
     $(".msg-forma-pagamento").show();
     return false;
   }

   //mesmo form, mas não deve validar em opção diferente de cartão
   if ($(this).find("input[name='opcao_pagamento']:checked").val() != "CA") {
     return true;
   }

   $(this).find(".form-group.has-error").removeClass("has-error");

   $portador = $(this).find("input[name='PORTADOR']");
   $nrcartao = $(this).find("input[name='NRCARTAO']");
   $mescartao = $(this).find("input[name='MES']");
   $anocartao = $(this).find("input[name='ANO']");
   $cvc2 = $(this).find("input[name='CVC2']");
   $nrparcelas = $(this).find("select[name='n_parcelas']");

   if (!$portador.val()) {
     $portador
       .popover({
         content: "Por favor informe o nome do portador.",
         trigger: "manual",
         placement: "bottom",
         html: true,
       })
       .popover("show");
     $portador.closest(".form-group").addClass("has-error");
     $portador.focus();

     setTimeout(function () {
       $portador.popover("destroy");
     }, 2000);

     return false;
   }

   if (!$nrcartao.val()) {
     $nrcartao
       .popover({
         content:
           "Por favor preencha corretamente o n&uacute;mero do cart&atilde;o.",
         trigger: "manual",
         placement: "bottom",
         html: true,
       })
       .popover("show");
     $nrcartao.closest(".form-group").addClass("has-error");
     $nrcartao.focus();

     setTimeout(function () {
       $nrcartao.popover("destroy");
     }, 2000);

     return false;
   }

   /*if(!testarCC($nrcartao.val())){
			$nrcartao.popover({content:'O n&uacute;mero do cart&atilde;o &eacute; inv&aacute;lido',trigger:'manual',placement:'bottom',html:true}).popover('show');
			$nrcartao.closest('.form-group').addClass('has-error');
			$nrcartao.focus();

			setTimeout(function(){
				$nrcartao.popover('destroy');
			}, 2000);

			return false;
		}*/

   if (!$mescartao.val()) {
     $mescartao
       .popover({
         content: "Por favor informe o m&ecirc;s do cart&atilde;o.",
         trigger: "manual",
         placement: "bottom",
         html: true,
       })
       .popover("show");
     $mescartao.closest(".form-group").addClass("has-error");
     $mescartao.focus();

     setTimeout(function () {
       $mescartao.popover("destroy");
     }, 2000);

     return false;
   }
   if ($mescartao.val() > 12 || $mescartao.val() == 0) {
     $mescartao
       .popover({
         content:
           "Por favor informe corretamente o m&ecirc;s do cart&atilde;o.",
         trigger: "manual",
         placement: "bottom",
         html: true,
       })
       .popover("show");
     $mescartao.closest(".form-group").addClass("has-error");
     $mescartao.focus();

     setTimeout(function () {
       $mescartao.popover("destroy");
     }, 2000);

     return false;
   }
   if (!$anocartao.val()) {
     $anocartao
       .popover({
         content: "Por favor informe o ano do cart&atilde;o.",
         trigger: "manual",
         placement: "bottom",
         html: true,
       })
       .popover("show");
     $anocartao.closest(".form-group").addClass("has-error");
     $anocartao.focus();

     setTimeout(function () {
       $anocartao.popover("destroy");
     }, 2000);

     return false;
   }

   if ($anocartao.val() == $("#anoA").val()) {
     if ($mescartao.val() < $("#mesA").val()) {
       $mescartao
         .popover({
           content: "A data do cart&atilde;o deve ser maior que a data atual.",
           trigger: "manual",
           placement: "bottom",
           html: true,
         })
         .popover("show");
       $mescartao.closest(".form-group").addClass("has-error");
       $mescartao.focus();

       setTimeout(function () {
         $mescartao.popover("destroy");
       }, 2000);

       return false;
     }
   } else {
     if ($anocartao.val() < $("#anoA").val()) {
       $anocartao
         .popover({
           content: "A data do cart&atilde;o deve ser maior que a data atual.",
           trigger: "manual",
           placement: "bottom",
           html: true,
         })
         .popover("show");
       $anocartao.closest(".form-group").addClass("has-error");
       $anocartao.focus();

       setTimeout(function () {
         $anocartao.popover("destroy");
       }, 2000);

       return false;
     }
   }

   if (!$cvc2.val()) {
     $cvc2
       .popover({
         content:
           "Por favor preencha o c&oacute;digo de verifica&ccedil;&atilde;o do cart&atilde;o.",
         trigger: "manual",
         placement: "bottom",
         html: true,
       })
       .popover("show");
     $cvc2.closest(".form-group").addClass("has-error");
     $cvc2.focus();

     setTimeout(function () {
       $cvc2.popover("destroy");
     }, 2000);

     return false;
   }

   if (!$nrparcelas.val()) {
     $nrparcelas
       .popover({
         content:
           "Por favor informe a op&ccedil;&atilde;o de parcela desejada.",
         trigger: "manual",
         placement: "bottom",
         html: true,
       })
       .popover("show");
     $nrparcelas.closest(".form-group").addClass("has-error");
     $nrparcelas.focus();

     setTimeout(function () {
       $nrparcelas.popover("destroy");
     }, 2000);

     return false;
   }

   $("#formConfirmaPedido button").attr("disabled", true);

   return true;
 });

 /**carousel swipe**/
 $(".carousel")
   .not(".carousel-stage")
   .on("touchmove touchstart", function (e) {
     if (e.type == "touchstart") {
       lastX = e.originalEvent.touches[0].clientX;
     } else {
       var currentX = e.originalEvent.touches[0].clientX;
       if (currentX > lastX + 60) {
         $(this).carousel("prev");
       } else if (currentX < lastX - 60) {
         $(this).carousel("next");
       }
     }
   });
 /** Carousel prodview **/
 $(".carousel.carousel-stage").on("touchmove touchstart", function (e) {
   if (e.type == "touchstart") {
     lastX = e.originalEvent.touches[0].clientX;
   } else {
     var currentX = e.originalEvent.touches[0].clientX;
     if (currentX > lastX + 60) {
       $(".carousel-stage").jcarousel("scroll", "-=1");
     } else if (currentX < lastX - 60) {
       $(".carousel-stage").jcarousel("scroll", "+=1");
     }
   }
 });

 $(".select_qtd_cart.change_form").change(function () {
   $(this).closest("form").submit();
 });

 $("#Estado").change(function () {
   var est = $(this).val();
   var url = link_site + "ajax/cidades.php";
   $("#Cidade").load(url, { est: est });
 });

 $(".cep-dados").change(function () {
   var cep = $(this).val().replace(/\D/g, "");
   var validacep = /^[0-9]{8}$/;

   if (cep != "" && validacep.test(cep)) {
     var $rua = $("#" + $(this).data("id-rua"));
     var $bairro = $("#" + $(this).data("id-bairro"));
     var $cidade = $("#" + $(this).data("id-cidade"));
     var $uf = $("#" + $(this).data("id-uf"));

     $.getJSON(
       "//viacep.com.br/ws/" + cep + "/json/?callback=?",
       function (dados) {
         if (!("erro" in dados)) {
           $rua.val(dados.logradouro);
           $bairro.val(dados.bairro);

           $uf.find("option").each(function () {
             if ($(this).text().trim() === dados.uf) {
               $(this).prop("selected", true);
             }
           });

           $uf.trigger("change");

           setTimeout(function () {
             $cidade.find("option").each(function () {
               if ($(this).text().trim() === dados.localidade) {
                 $(this).prop("selected", true);
               }
             });
           }, 500);
         } else {
           $rua.val("");
           $bairro.val("");
           $cidade.val("");
           $uf.val("");
         }
       },
     );
   } else {
     $(this).val("");
   }
 });

 if ($(".cep-dados").data("trigger") == 1) {
   $(".cep-dados").trigger("change");
 }

 $("#display-change-endereco").click(function () {
   $("#display-change-endereco").closest(".remove_display").remove();
   $("#display-change-endereco_content").fadeIn();
 });

 $("#link_recup_senha").click(function () {
   $(".hidden-esqueci-senha").hide();
   $(".show-esqueci-senha").show();
 });
 $("#link_recup_senha_back").click(function () {
   $(".hidden-esqueci-senha").show();
   $(".show-esqueci-senha").hide();
 });

 $(".input-number").keydown(function (a) {
   $.inArray(a.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
     (65 === a.keyCode && (a.ctrlKey === !0 || a.metaKey === !0)) ||
     (a.keyCode >= 35 && a.keyCode <= 40) ||
     ((a.shiftKey || a.keyCode < 48 || a.keyCode > 57) &&
       (a.keyCode < 96 || a.keyCode > 105) &&
       a.preventDefault());
 });

 $("#slick-slider_lancamento, #slick-slider_promocoes").slick({
   slidesToShow: 3,
   slidesToScroll: 1,
   autoplay: true,
   autoplaySpeed: 2000,
   responsive: [
     { breakpoint: 992, settings: { slidesToShow: 2 } },
     { breakpoint: 768, settings: { slidesToShow: 1 } },
   ],
   prevArrow:
     '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button" style=""><img class="slick-arrow-lancamentos alt="Anterior" src="' +
     link_site +
     'imagens/icon-prevslick-min.jpg"></button>',
   nextArrow:
     '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button" style=""><img class="slick-arrow-lancamentos" alt="Próximo" src="' +
     link_site +
     'imagens/icon-nextslick-min.jpg"></button>',
 });

 $("#slick-slider-designers").slick({
   slidesToShow: 1,
   slidesToScroll: 1,
   autoplay: false,
   autoplaySpeed: 4000,
   prevArrow:
     '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button" style=""><img class="slick-arrow-designer" alt="Anterior" src="' +
     link_site +
     'imagens/icon-prevslick-min.jpg"></button>',
   nextArrow:
     '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button" style=""><img class="slick-arrow-designer" alt="Próximo" src="' +
     link_site +
     'imagens/icon-nextslick-min.jpg"></button>',
 });

 $("#slick-slider-blog").slick({
   slidesToShow: 3,
   slidesToScroll: 1,
   autoplay: true,
   autoplaySpeed: 2000,
   responsive: [
     { breakpoint: 992, settings: { slidesToShow: 2 } },
     { breakpoint: 768, settings: { slidesToShow: 1 } },
   ],
   prevArrow:
     '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button" style=""><img class="slick-arrow-blog" alt="Anterior" src="' +
     link_site +
     'imagens/icon-prevslick-min.jpg"></button>',
   nextArrow:
     '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button" style=""><img class="slick-arrow-blog" alt="Próximo" src="' +
     link_site +
     'imagens/icon-nextslick-min.jpg"></button>',
 });

 $("#instaCarousel").load(
   link_site + "ajax/instagram.php",
   "",
   function (data) {
     $(this)
       .find("#slickInstagram")
       .slick({
         arrows: false,
         centerMode: false,
         swipeToSlide: true,
         variableWidth: true,
         autoplay: true,
         slidesToShow: 8,
       });
   },
 );

 $("#slick-slider-vejatambem").slick({
   slidesToShow: 3,
   slidesToScroll: 1,
   autoplay: true,
   autoplaySpeed: 4000,
   responsive: [
     { breakpoint: 900, settings: { slidesToShow: 2 } },
     { breakpoint: 600, settings: { slidesToShow: 1 } },
   ],
 });

 $("#backToTop").click(function () {
   $("html, body").animate({ scrollTop: 0 }, 1000);
 });

 if (/#collapseHelpDesk/.test(window.location.href)) {
   $("#collapseHelpDesk").collapse({ toggle: true }).collapse("show");
   $("html, body").animate(
     { scrollTop: $("#collapseHelpDesk").offset().top - 50 },
     1000,
   );
 }
 $(".prevent_automation").on("cut copy paste", function (e) {
   e.preventDefault();
 });

 $("#cookie-accepted").click(function () {
   $.post(link_site + "ajax/accept_cookie.php", {}, function (data) {
     $("#accept-cookie").remove();
   });
 });
});

//função para validar e-mail
function checkMail(mail) {
 var er = new RegExp(
   /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/,
 );
 if (typeof mail == "string") {
   if (er.test(mail)) return true;
 } else if (typeof mail == "object") {
   if (er.test(mail.value)) {
     return true;
   }
 } else return false;
}

function testarCC(r) {
 var cartoes = {
   Visa: /^4[0-9]{12}(?:[0-9]{3})/,
   Mastercard: /^5[1-5][0-9]{14}/,
   Amex: /^3[47][0-9]{13}/,
   Diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
   Discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
   JCB: /^(?:2131|1800|35\d{3})\d{11}/,
   Elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
   Hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
 };
 for (var t in cartoes) if (r.match(cartoes[t])) return t;
 return false;
}

function setLoadMascara() {
 $(".mascara.central").find(".spinner").hide();
 $("#submitMascara").click(function (e) {
   e.preventDefault();
   $(".mascara.central").find(".spinner").show();
   var form = $(this).closest("form");
   $(".mascara.central .texto").load(
     form.attr("action"),
     form.serializeArray(),
     function () {
       setLoadMascara();
     },
   );
 });
}

function excluirCarinhoAmbiente(link) {
 $(".loading").fadeIn();
 if (link.length) {
   // Colocamos os valores de cada campo em uma váriavel para facilitar a manipulação
   var produto = link.closest(".prodAmbiente").find(".id_produto").val();
   var item_carrinho = link
     .closest(".prodAmbiente")
     .find(".item_carrinho")
     .val();
   var ambiente = link.closest(".prodAmbiente").find(".ambiente").val();
   var url = link_site + "ajax/excluir_produtos.php";
   $.post(
     url,
     { item_carrinho: item_carrinho, ambiente: ambiente },
     function (retorno) {
       setDadosCarrinhoAmbiente(retorno);
       $(".i_" + produto).css("background-color", "#f7f7f7");
       $(".i_" + produto)
         .find(".img-responsive")
         .css({
           "-webkit-filter": "grayscale(100%)",
           filter: "grayscale(100%)",
         });
       $(".i_" + produto)
         .find(".excluir")
         .fadeOut(function () {
           (400,
             $(".i_" + produto)
               .find(".add_produto")
               .fadeIn());
         });
     },
     "json",
   );
 }
}

function setDadosCarrinhoAmbiente(retorno) {
 if (retorno.qtde) {
   $.each(retorno.Produtos, function () {
     $(".i_" + this.produto)
       .find(".preco_avista")
       .text(this.preco_a_calc);
     $(".i_" + this.produto)
       .find(".preco_parcel")
       .text(this.total_parcial);
     $(".i_" + this.produto)
       .find(".display-qt-cart")
       .text(
         this.quantidade_prod < 10
           ? "0" + this.quantidade_prod
           : this.quantidade_prod,
       );
     $(".i_" + this.produto)
       .find(".select_qtd_cart.input-qtd-amb")
       .val(this.quantidade_prod);
   });
   $(".sub-prazo p").text(retorno.preco_parcelado);
   $(".sub-vista p").text(retorno.preco_a_calc);
   $(".comprar-pview button").removeAttr("disabled");
 } else {
   $(".sub-prazo p").text("0,00");
   $(".sub-vista p").text("0,00");
   $(".comprar-pview button").attr("disabled", "disabled");
 }
 $(".loading").fadeOut();
}

// function setClickContainer() {
// 	$('.container-item-list:not(.clicked)').off('click').click(function (event) {
// 		$(this).unbind('mouseenter mouseleave');

// 		$(".container-item-list").removeClass('clicked');
// 		$(this).addClass('clicked');
// 		$pop = $(this).find('.click-link');

// 		//redireciona os usuários de dispositivos móveis para o produto após 0,5 segundos
// 		if (window.mobileAndTabletcheck()) {
// 			setTimeout(function () {
// 				window.location.replace($pop.attr('href'));
// 			}, 500);
// 		}

// 		$pop.popover({ content: 'Clique aqui para comprar!', trigger: 'manual', placement: 'bottom' }).popover('show');
// 		setTimeout(function () {
// 			$pop.popover('destroy');
// 		}, 2000);
// 	});

// 	var timeoutHandle = setTimeout(function () { }, 5000);
// 	$('.container-item-list:not(.clicked)').off('hover').hover(function (event) {
// 		$(this).unbind("click");
// 		$pop = $(this).find('.click-link');
// 		$pop.addClass('disabled');

// 		$(".container-item-list").removeClass('clicked');
// 		$(this).addClass('clicked');

// 		//redireciona os usuários de dispositivos móveis para o produto após 0,5 segundos
// 		if (window.mobileAndTabletcheck()) {
// 			setTimeout(function () {
// 				window.location.replace($pop.attr('href'));
// 			}, 500);
// 		}

// 		$pop.popover({ content: 'Clique aqui para comprar!', trigger: 'manual', placement: 'bottom' }).popover('show');
// 		clearTimeout(timeoutHandle);
// 		timeoutHandle = setTimeout(function () {
// 			$pop.popover('destroy');
// 		}, 2000);

// 		setTimeout(function () {
// 			$pop.removeClass('disabled');
// 		}, 5);
// 	},
// 		function (event) {
// 			$(this).removeClass('clicked');
// 		});
// }

function gerarCookie(strCookie, strValor, lngDias) {
 $.cookie(strCookie, strValor, {
   expires: lngDias,
 });
}

function LerCookie(nomeCookie) {
 if ($.cookie(nomeCookie) == 1) return true;
 else return false;
}

$(window).load(function () {
 if (!LerCookie("fechado")) {
   $(".promo-15-button").click();
 }

 $("#container-menu-sx").css("margin-top", "");
 $(".container-cat-list .ajust-center").css("margin-top", "");
 mesmoHeight();
 mosaico();
});
$(window).resize(function () {
 $window_width = $(window).width();

 if ($("#colorbox").not(".no-resize").is(":visible")) {
   var $cbx = $.colorbox.element();
   if ($cbx.attr("class").indexOf("gallery-prod-principal") >= 0) {
     $.colorbox.resize({ width: "95%" });
   } else if ($("#colorbox").hasClass("color-cupom")) {
     if ($window_width < 1070)
       $.colorbox.resize({ width: "95%", height: "550px" });
     else $.colorbox.resize({ width: "974px", height: "550px" });
   } else {
     if ($window_width < 768)
       $.colorbox.resize({ width: "90%", height: "80%" });
     else $.colorbox.resize({ width: "60%", height: 500 });
   }
 }
 $("#container-menu-sx").css("margin-top", "");
 $(".container-cat-list .ajust-center").css("margin-top", "");
 $(".carousel-item-view").width($(".stage").width());
 mesmoHeight();
 mosaico();
});
$(window).scroll(function () {
 if ($(window).width() <= 768) {
   if (
     $(".comprar-pview.xs").offset().top > $(window).scrollTop() &&
     $(".comprar-pview.xs").offset().top <
       $(window).scrollTop() + $(window).height() - 60
   ) {
     if ($(".comprar-fixed").hasClass("in"))
       $(".comprar-fixed").fadeOut().removeClass("in");

     if ($(".whats_floating_button").hasClass("translate-up"))
       $(".whats_floating_button").removeClass("translate-up");
   } else {
     if (!$(".comprar-fixed").hasClass("in"))
       $(".comprar-fixed").fadeIn().addClass("in");

     if (!$(".whats_floating_button").hasClass("translate-up"))
       $(".whats_floating_button").addClass("translate-up");
   }
 }

 /** Back to Top **/
 if ($(this).scrollTop()) {
   $("#backToTop").fadeIn();
 } else {
   $("#backToTop").fadeOut();
 }
});

function mosaico() {
 var padding = Math.max.apply(
   null,
   $("#mosaico")
     .find("img")
     .map(function () {
       return $(this).height();
     })
     .get(),
 );
 $("#mosaico")
   .find(".ajustePading")
   .css("padding", padding * 0.02);
}

function mesmoHeight_callback() {
 $("#container-menu-sx").vAlign(".row-header-top");
 $(".container-cat-list .ajust-center").vAlign(".container-midia-list");
 $("#carousel-banners-lancamento .carousel-control img").vAlign(
   "#carousel-banners-lancamento .carousel-control",
 );
 $("#carousel-completar .carousel-control img").vAlign(
   "#carousel-completar .carousel-control",
 );
}
function mesmoHeight() {
 ($(".mesmoHeight").css("height", "").removeClass("off"),
   $(document).imagesLoaded(function () {
     $(".mesmoHeight").each(function () {
       if (!$(this).hasClass("off")) {
         var e = $(this).parent(),
           s = Math.max.apply(
             null,
             e
               .find(".mesmoHeight")
               .map(function () {
                 return $(this).height();
               })
               .get(),
           );
         if (s > 0) {
           e.find(".mesmoHeight").css("height", s).addClass("off");
         }
       }
     });
     mesmoHeight_callback();
   }));
}
$.fn.vAlign = function (t) {
 return this.each(function (i) {
   var h = $(this).height(),
     n = $(this).closest(t).height(),
     s = Math.ceil((n - h) / 2);
   $(this).css("margin-top", s);
 });
};
window.mobileAndTabletcheck = function () {
 var i,
   a = !1;
 return (
   (i = navigator.userAgent || navigator.vendor || window.opera),
   (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
     i,
   ) ||
     /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
       i.substr(0, 4),
     )) &&
     (a = !0),
   a
 );
};

$(document).ready(function () {
 $(".confira-formas").click(function (e) {
   e.preventDefault();
   $("#paymentModal").modal("show");
 });

 $(".close, .btn-close").click(function () {
   $("#paymentModal").modal("hide");
 });

 $(document).click(function (event) {
   if ($(event.target).is(".modal")) {
     $("#paymentModal").modal("hide");
   }
 });
});

function isSafari() {
 return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function showModal() {
 if (isSafari()) {
   $(".imagem-safari").show();
   $(".gif-outros").hide();
 } else {
   $(".imagem-safari").hide();
   $(".gif-outros").show();
 }

 $("#loadingGif").show();
}

function hideModal() {
 $("#loadingGif").hide();
 $(".imagem-safari, .gif-outros").hide();
}

$(document).ready(function () {
 $("#formConfirmaPedido button[type=submit]").on("click", function (e) {
   showModal();
 });
});

function copiarTexto() {
 const chavePix = document.querySelector("#pixKey strong").textContent;

 navigator.clipboard.writeText(chavePix);

 const copyToast = document.getElementById("copyToast");
 copyToast.style.display = "block";

 setTimeout(() => {
   copyToast.style.display = "none";
 }, 2000);
}

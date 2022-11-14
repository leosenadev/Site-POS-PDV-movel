var obj = [];
var tentativasDeEnvio = 0;
var types = [];
function form( id ){
  var $id = $('#'+id); //Id do formulario
  var submitBtn = $id.find('button[type="submit"]'); //Seleciona botão de submit do formulario
  $id.attr({method:"post", role:"form"}); // Adiciona method e role na tag do form para validação
  formMasks($id); //Mascara

  $id.submit(function(event){
      event.preventDefault();
  });

  $.validator.messages.required = "Este campo é obrigatório!";

  $id.validate({
    messages: {
      email: "Por favor coloque um e-mail valido"
      },
    submitHandler: function(form) {
      //fbq('track', 'StartTrial');
      submitBtn.fadeOut('slow');
      var totalCampos = $id.find('input, input[type="radio"]:checked').length;
      $id.find('input, input[type="radio"]:checked').each(function(i) {
        if ($(this).is(':required')) {
          if((i+2) == totalCampos){
            tentativasDeEnvio = tentativasDeEnvio+1;
            obj = JSON.stringify(obj);
            formPost(obj, id, tentativasDeEnvio);
          }

        }
      });
    }
  });
}

function pushObj(name, val) {
   var arr = {};
   arr[name] = val;
   obj.push(arr);
}
function formPost(obj, id, tentativasDeEnvio){
  var $id = $('#'+id); //Id do formulario
  var nome = $id.find('#nome').val()
  var email = $id.find('#email').val();
  var cnpj = $id.find('#cnpj').val().replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
  var tel = $id.find('#telefone').val().replace(/[^a-z0-9\s]/gi, '').replace(/\s/g,'');
  var submitBtn = $id.find('button[type="submit"]');

  var submitBtn = $id.find('button[type="submit"]');
    if (obj != '' && tentativasDeEnvio < 4) {
      var optionsWarningTimeOut =
        {
          title: 'Servidor demorou de responer.',
          message: 'Tentarei enviar sua mensagem 3 vezes. ('+tentativasDeEnvio+'/3).',
          position: 'topCenter',
          progressBar: true,
          overlay: true,
          theme: 'padrao',
          timeout: '3000',
          onClosing: function(){
            if(tentativasDeEnvio < 4){
              submitBtn.trigger('submit');
            }
          }
        }
      var optionsWarning =
        {
          title: 'Enviando...',
          message: 'Aguarde um instante.',
          position: 'topCenter',
          pauseOnHover: false,
          progressBar: true,
          theme: 'padrao',
          timeout: '30000',
          id: 'alerta',
          overlay: true,
          close: false
        };
      var optionsSuccess =
        {
          title: 'Cadastro feito com SUCESSO!',
          position: 'topCenter',
          pauseOnHover: false,
          progressBar: false,
          theme: 'padrao',
          timeout: '2000',
          id: 'sucesso',
          overlay: false,
          onClosing: function(){
            if($('.iziToast-overlay').hasClass('fadeIn')){
              $('.iziToast-overlay').addClass('fadeOut');
              $('.iziToast-overlay').removeClass('fadeIn');
            }
          },
          onClosed: function(){
            $id.find('.form-control, .form-check-input:checked').val('').prop("disabled", false);
            submitBtn.fadeIn('slow');
            localStorage.removeItem('FormObjeto');
            location.href = "/sucesso_cielo"
          }
        };
      iziToast.warning(optionsWarning);
      /*$.ajax({
        type: "POST",
        //url: "https://app.poscontrole.com.br/app/prc.php",
        data: {
            nome: nome,
            email: email,
            telefone: tel,
            cnpj: cnpj,
            q: 'wl'
        },
        dataType: "json",
      }).done(function(response){
        if(response.status == 'sucesso'){
          tentativasDeEnvio = 5;
          iziToast.destroy();
          iziToast.success(optionsSuccess);
        }
        if(response.status === 'erro'){
          iziToast.destroy();
          var erroDetail = response.detalhe
          if(response.detalhe.msg === 'CNPJ Inativo/Baixado/Inválido'){
            iziToast.warning({
              title: 'Erro ao cadastrar!',
              message: response.detalhe.msg,
              position: 'topCenter',
              progressBar: true,
              overlay: true,
              theme: 'padrao',
              timeout: '10000',
              onClosing: function(instance, toast, closedBy){
                if($('.iziToast-overlay').hasClass('fadeIn')){
                  $('.iziToast-overlay').addClass('fadeOut')
                  $('.iziToast-overlay').removeClass('fadeIn');
                }
              },
              onClosed: function(){
                iziToast.destroy();
                if($('.iziToast-overlay').length > 0){
                  $('.iziToast-overlay').remove()
                }
                $id.find('input').val(' ');
                $id.find('input').next().removeClass('active');
                submitBtn.fadeIn('slow');
                submitBtn.fadeIn('slow');
              }
            });

          }else{
            $.each(erroDetail, function(key, value) {
              iziToast.question({
                title: 'Por favor corrija o erro para continuar!',
                message: value.msg,
                position: 'topCenter',
                progressBar: true,
                overlay: true,
                theme: 'padrao',
                timeout: '10000',
                onClosing: function(instance, toast, closedBy){
                  if($('.iziToast-overlay').hasClass('fadeIn')){
                    $('.iziToast-overlay').addClass('fadeOut')
                    $('.iziToast-overlay').removeClass('fadeIn');
                  }
                },
                onClosed: function(){
                  iziToast.destroy();
                  if($('.iziToast-overlay').length > 0){
                    $('.iziToast-overlay').remove()
                  }
                  $id.find('input').val(' ');
                  $id.find('input').next().removeClass('active');
                  submitBtn.fadeIn('slow');
                }
              });

            });

          }
          // console.log(erroMsgArr);

        }
      }).fail(function(xhr){
        var status = xhr.status;
        console.log(xhr.responseText);
        iziToast.destroy();
        iziToast.warning({
          title: 'Não foi possível enviar sua mensagem.',
          message: xhr.responseText,
          position: 'topCenter',
          progressBar: true,
          overlay: true,
          theme: 'padrao',
          onClosing: function(instance, toast, closedBy){
            console.log('teste');
            if($('.iziToast-overlay').hasClass('fadeIn')){
              $('.iziToast-overlay').addClass('fadeOut')
              $('.iziToast-overlay').removeClass('fadeIn');
            }
          },
          onClosed: function(){
            $id.find('.form-control, .form-check-input:checked').val('').prop("disabled", false);
            submitBtn.fadeIn('slow');
            location.reload();
          }
        });
      });*/
    }else{
      iziToast.warning({
        title: 'Não foi possível enviar sua mensagem.',
        message: 'entre em contato por telefone ou tente novamente daqui a alguns minutos.',
        position: 'topCenter',
        progressBar: true,
        overlay: true,
        theme: 'padrao',
        onClosing: function(){
          if($('.iziToast-overlay').hasClass('fadeIn')){
            $('.iziToast-overlay').addClass('fadeOut')
            $('.iziToast-overlay').removeClass('fadeIn');
          }
        },
        onClosed: function(){
          $id.find('.form-control, .form-check-input:checked').val('').prop("disabled", false);
          submitBtn.fadeIn('slow');
          location.reload();
        }
      });
    }
}

function formMasks($id){
  $id.find("input#telefone, input#cel").mask('(00) 0000-00000')
  $id.find('input#bgColor').mask('#999999');
  $id.find('input#cpf, #logarCpf').mask('999.999.999-99');
  $id.find('input#cnpj').mask('99.999.999/9999-99');
}

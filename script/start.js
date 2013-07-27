$(document).ready(function() {
    //обработчики диалоговых кнопок--------------------------------------------------------
    $('#userRegYes').click(function(){
        $('#userPass').show(1000);//показываем поля пароля
        $('#userRegAsk').hide(1000);//прячем кнопки
    });
    $('#userRegNo').click(function(){
        $('#userRegistration').hide(1000);//закрываем диалог
        Global.nickNameSubmit();//заходим
    });
    $('#userRegSubmit').click(function() {
        //Анализ полей пароля и отправка на сервер значения
        var newUserPass = $('#newUserPass').val();//парсим значение полей в переменные
        var newUserPassConfirm = $('#newUserPassConfirm').val();
        if(newUserPass && newUserPass == newUserPassConfirm){//Если пароль введен и равен конфирмации
            $('#userRegistration').hide(1000);//Прячем диалог регистрации
            $('#userRegWarn').hide(100);//Прячем предупреждение
            Global.userRegistration(newUserPass);//Запуск регистрации
        }
        else{
            $('#userRegWarn').show(100);//Показываем что пользователь допустил ошибку или не ввел пароли
        }                
    });
    $('#userRegCancel').click(function() {//делаем тоже что и при отмене
        $('#userRegistration').hide(1000);//Прячем диалог
        Global.nickNameSubmit();//заходим
    });
    
    $('#userAuthYes').click(function(){
        $('#authUserPass').show(1000);//тут мы выводим поля пароля и анализ содержимого
        $('#userAuthAsk').hide(1000);//прячем кнопки                    
    });
    $('#userAuthNo').click(function(){//тут мы закрывааем диалог и делаем выход юзера
        $('#userAuthorization').hide(1000);//прячем диалог
        Global.exitSubmit();
    });
    $('#userAuthSubmit').click(function() {//тут будет анализ пароля
        if($('#oldUserPass').val()){
            var oldUserPass = $('#oldUserPass').val();
            Global.socket.emit('existUser', {'password':oldUserPass, 'nickname':Global.nickname});
            $('#userAuthWarn').hide(100);
            $('#userAuthorization').hide(1000);
        }
        else{
            $('#userAuthWarn').show(100);
        }
    });
    $('#userAuthCancel').click(function() {
        $('#userAuthorization').hide(1000);//прячем диалог
        Global.exitSubmit();
    });
    //-------------------------------------------------------------------------------
    
    Global.snd_in = $('#msg_sound_in');
    Global.snd_out = $('#msg_sound_out');

    $('#msgSend').mousedown(function(){
		$(this).addClass('msgSendClick');
		});
	$('#msgSend').mouseup(function(){
		$(this).removeClass('msgSendClick');
		});
        
    $('#autoscroll').addClass('autoscrollOn');
    
    $('#status').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    
    $('#nickNameSubmit').click(function(){
        if($('#nickName').val()){
            Global.nickname = $('#nickName').val();
            if(Global.nickname.length > 15)
            {
                Global.nickname = Global.nickname.substring(0 ,12)+'...';
                alert(Global.nickname);
            }
            else;   
            Global.userCheck();
        }
        else;
    });
    $('#nickName').keypress(function(e){
        if(e.which == 13){
            Global.nickname = $('#nickName').val();
            if(Global.nickname.length > 15)
            {
                Global.nickname = Global.nickname.substring(0 ,12)+'...';
            }
            else;            
            Global.userCheck();
        }
        else;
    });
    $('#nickName').focus(function(){
        $(this).val('');
    });
        
    
    
    $('#msgSend').click(function(){
        if($('#msgBox').val()){
           Global.sendMsg();
        }
        else;
    });
    $('#msgBox').keypress(function(e) {
        if(e.which == 13){
            if($('#msgBox').val()){
                Global.sendMsg();
            }
            else;
        }
        else;
    });
    $('#exitSubmit').click(function() {
        Global.exitSubmit();
    });
    $('#autoscroll').click(function() {
        $(this).toggleClass('autoscrollOn');
        Global.autoscroll=!Global.autoscroll;
    });
    $('#soundToggle').click(function() {
        $(this).toggleClass('autoscrollOn');
        Global.soundToggle=!Global.soundToggle;
    });
    
    
});

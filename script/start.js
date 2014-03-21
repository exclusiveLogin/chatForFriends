$(document).ready(function() {
    
    if(jQuery.browser.mobile){
        window.location.replace("pda/index.html");
    }
    else;
    
    //включааем тему
    Global.themeRoll(1);
    
    $('#dark_theme').click(function() {
        Global.themeRoll(1);
    });
    $('#light_theme').click(function() {
        Global.themeRoll(2);
    });
    
    //Показ панели top_panel
    $('#panel_tgl').click(function(){
        if($('#topPanel').is(':visible')){
            $('#topPanel').fadeOut(500);
        }
        else{
            $('#topPanel').fadeIn(500);
        }
    });
    
    $('#contactListBody').on('click','.contactUnit', function(){
        var privNick = $(this).text();
        $(this).toggleClass('contactUnitSelected');
        if($(this).hasClass('contactUnitSelected')){
            Global.priv.push(privNick);
            console.log('user added:'+privNick);
        }
        else{
            var del = Global.priv.indexOf(privNick);
            Global.priv.splice(del, 1);
            console.log('index of delete:'+del);
        }     
    });
    //обработчики диалоговых кнопок--------------------------------------------------------
    $('#userRegYes').click(function(){
        $('#userPass').show(500);//показываем поля пароля
        $('#userRegAsk').hide(500);//прячем кнопки
    });
    $('#userRegNo').click(function(){
        $('#userRegistration').hide(500);//закрываем диалог
        for(var i in Global.members){
            if(Global.nickname==Global.members[i].nickname){//Если такой ник есть в КЛ то выдаем предупреждение
                alert("Совпадение ников");
                Global.accept=false;
                Global.exitSubmit();
                break;
            }
            else{
                Global.accept=true;
            };
        }
        if(Global.accept){
            Global.nickNameSubmit();//заходим
        }
        else{//иначе не заходим
            Global.exitSubmit();
        }
    });
    $('#userRegSubmit').click(function() {
        //Анализ полей пароля и отправка на сервер значения
        var newUserPass = $('#newUserPass').val();//парсим значение полей в переменные
        var newUserPassConfirm = $('#newUserPassConfirm').val();
        if(newUserPass && newUserPass == newUserPassConfirm){//Если пароль введен и равен конфирмации
            $('#userRegistration').hide(500);//Прячем диалог регистрации
            $('#userRegWarn').hide(100);//Прячем предупреждение
            Global.userRegistration(newUserPass);//Запуск регистрации
        }
        else{
            $('#userRegWarn').show(100);//Показываем что пользователь допустил ошибку или не ввел пароли
        }                
    });
    $('#userRegCancel').click(function() {//делаем тоже что и при отмене
        $('#userPass').hide(500);//прячем поля пароля
        $('#userRegAsk').show(500);//показываем кнопки
        $('#userRegistration').hide(500);//Прячем диалог
        Global.nickNameSubmit();//заходим
    });
    
    $('#userAuthYes').click(function(){
        $('#authUserPass').show(500);//тут мы выводим поля пароля и анализ содержимого
        $('#userAuthAsk').hide(500);//прячем кнопки                    
    });
    $('#userAuthNo').click(function(){//тут мы закрывааем диалог и делаем выход юзера
        $('#userAuthorization').hide(500);//прячем диалог
        Global.exitSubmit();
    });
    $('#userAuthSubmit').click(function() {//тут будет анализ пароля
        if($('#oldUserPass').val()){
            var oldUserPass = $('#oldUserPass').val();
            Global.socket.emit('existUser', {'password':oldUserPass, 'nickname':Global.nickname});
            $('#userAuthWarn').hide(100);
            $('#userAuthorization').hide(500);
        }
        else{
            $('#userAuthWarn').show(100);
        }
    });
    $('#userAuthCancel').click(function() {
        $('#userAuthorization').hide(500);//прячем диалог
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
           Global.socket.emit('typing',{'nickname':Global.nickname, 'status':false});
        }
        else;
    });
    $('#msgBox').keypress(function(e) {
        if(e.which == 13){
            if($('#msgBox').val()){
                Global.sendMsg();
                Global.socket.emit('typing',{'nickname':Global.nickname, 'status':false});
            }
            else;
        }
        else{
            clearTimeout(timer);
            Global.socket.emit('typing',{'nickname':Global.nickname, 'status':true});
            var timer = setTimeout(function() {
                Global.socket.emit('typing',{'nickname':Global.nickname, 'status':false});
            }, 3000);
        }
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

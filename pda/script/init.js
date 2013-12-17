 $(document).ready(function(){
    Global.snd_in = $('#msg_sound_in');
    Global.snd_out = $('#msg_sound_out');
    
    $('#enterSubmit').button('disable');
    
    $('#sendSlider').slider('disable');
    
    Global.sendBtnRefresh();
    
    //$('#btnSend').button();
    /*if(!jQuery.browser.mobile){
        window.location.replace("http://chatforfriends.mi.su");
    }
    else;*/
    
    $( "#titlePop" ).on( "popupbeforeposition", function( event, ui ) {
        var msg = '<h3>'+$('#titleText').text()+'</h3>';
        $('#titlePop').html(msg);
    } );
    
    $('[data-role="panel"]').on('panelbeforeclose', function( event, ui ) {
        Global.autoscrolling();
    });
    
    $('#menuBtn').click(function(){
		$('#menu').panel('open');
		});
            
    $('#clBtn').click(function(){
    	$('#cl').panel('open');
		});
            
    $('#autoscrollSlider').slider({
        stop:function(){
            if($('#autoscrollSlider :selected').val() == 'on'){
                Global.autoscroll = true;
                }
            else{
                Global.autoscroll = false;
            }
        }
    });
    $('#soundSlider').slider({
        stop:function(){
            if($('#soundSlider :selected').val() == 'on'){
                Global.soundToggle = true;
            }
            else{
                Global.soundToggle = false;
            }
        }
    });
    $('#sendSlider').slider({
        stop:function(){
            if($('#sendSlider :selected').val() == 'on'){
                Global.btnSend = true;
                Global.sendBtnRefresh();
            }
            else{
                Global.btnSend = false;
                Global.sendBtnRefresh();
            }
        }
    });
    $('#userRegWarn').hide();
    $('#userAuthWarn').hide();
    $('#userEnterWarn').hide();
    $('#debugPanel').hide();
    
    $('#exitSubmit').click(function(){
        Global.exitSubmit();
    });
    
    $('#titleText').text(Global.title);
    
    $('#titleText').click(function(){
        $('#titlePop').popup('open');
    });
    
    $('#enterSubmit').click(function(){
        $.mobile.changePage($('#enterPage'));
    });
    
    $('#userEnterCancel').click(function(){
        $.mobile.changePage($('#chat'));
    });
    
    if(!Global.nickname){
        //$('#enterSubmit').button('enable');
        $('#msgContainer').hide();
        $('#exitSubmit').button('disable');
        Global.title = "Вы не вошли в чат";
        $('#titleText').text(Global.title);
        $('#notEnteredText').show();
    }
    else{
        //$('#enterSubmit').button('disable');
        $('#msgContainer').show();
        $('#exitSubmit').button('enable');
        Global.title = "Вы вошли как "+Global.nickname;
        $('#titleText').text(Global.title);
        $('#notEnteredText').hide();
    }
        
    $('.chatCell:even').css({'backgroundColor':'#444'});        
     
    //Управление приватным списком отправки мсг
    /*$('#contactContain').on('click','.contactUnit', function(){
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
    });*/
    //Обработчики диалогов
    $('#userRegYes').click(function(){
        $('#userPass').show(500);//показываем поля пароля
        $('#userRegAsk').hide(500);//прячем кнопки
    });
    $('#userRegNo').click(function(){
        $('#userPass').hide(500);//прячем поля пароля
        $('#userRegAsk').show(500);//показываем кнопки
        $('#userRegistration').popup('close');
        setTimeout(function() {
            Global.nickNameSubmit();//заходим
        }, 1000);
        
    });
    
    $('#userRegSubmit').click(function() {
        //Анализ полей пароля и отправка на сервер значения
        var newUserPass = $('#newUserPass').val();//парсим значение полей в переменные
        var newUserPassConfirm = $('#newUserPassConfirm').val();
        if(newUserPass && newUserPass == newUserPassConfirm){//Если пароль введен и равен конфирмации
            $('#userPass').hide(500);//прячем поля пароля
            $('#userRegAsk').show(500);//показываем кнопки
            $('#userRegWarn').hide(100);
            $('#userRegistration').popup('close');
            setTimeout(function() {
                Global.userRegistration(newUserPass);//Запуск регистрации
            }, 1000);
        }
        else{
            $('#userRegWarn').show(100);//Показываем что пользователь допустил ошибку или не ввел пароли
        }                
    });
    $('#userRegCancel').click(function() {//делаем тоже что и при отмене
        $('#userPass').hide(500);//снова прячем поля пароля
        $('#userRegAsk').show(500);//снова показываем кнопки
        $('#userRegistration').popup('close');//Прячем диалог
        setTimeout(function() {
            Global.nickNameSubmit();//заходим
        }, 1000);
    });
    
    $('#userAuthYes').click(function(){
        $('#authUserPass').show(500);//тут мы выводим поля пароля и анализ содержимого
        $('#userAuthAsk').hide(500);//прячем кнопки                    
    });
    $('#userAuthNo').click(function(){//тут мы закрывааем диалог и делаем выход юзера
        $('#userAuthorization').popup('close');//прячем диалог
        Global.exitSubmit();
    });
    $('#userAuthSubmit').click(function() {//тут будет анализ пароля
        if($('#oldUserPass').val()){
            var oldUserPass = $('#oldUserPass').val();
            Global.socket.emit('existUser', {'password':oldUserPass, 'nickname':Global.nickname});
            $('#userAuthWarn').hide(100);
            $('#authUserPass').hide(500);//снова прячем поля пароля
            $('#userAuthAsk').show(500);//снова показываем кнопки
            $('#oldUserPass').val('');
            $('#userAuthorization').popup('close');
        }
        else{
            $('#userAuthWarn').show(100);//Предупреждение об ошибке
        }
    });
    $('#userAuthCancel').click(function() {
        $('#userAuthorization').popup('close');//прячем диалог
        Global.exitSubmit();
        $('#authUserPass').hide(500);//снова прячем поля пароля
        $('#userAuthAsk').show(500);//снова показываем кнопки
    });
    //Обработка отправки ника(нажатие Enter)
    $('#nickName').keypress(function(e){
        if(e.which == 13){
            Global.nickname = $('#nickName').val();
            if(Global.nickname.length > 15)
            {
                Global.nickname = Global.nickname.substring(0 ,12)+'...';
            }
            else;            
            Global.userCheck();
            $('userEnterWarn').hide(500);
        }
        else{
            $('userEnterWarn').show(500);
        }
    });
    
    $('#userEnterSubmit').click(function(){
        if($('#nickName').val()){
            Global.nickname = $('#nickName').val();
            if(Global.nickname.length > 15)
            {
                Global.nickname = Global.nickname.substring(0 ,12)+'...';
            }
            else;
            Global.userCheck();
            $('#userEnterWarn').hide();
            
        }
        else{
            $('#userEnterWarn').show();
        }
    });
    //Обработка отправки сообщения(нажатие Enter)
    $('#msgBox').keypress(function(e) {
        if(e.which == 13){
            if($('#msgBox').val()){
                Global.sendMsg();
                //Global.socket.emit('typing',{'nickname':Global.nickname, 'status':false});
            }
            else;
        }
        else{
            /*clearTimeout(timer);
            Global.socket.emit('typing',{'nickname':Global.nickname, 'status':true});
            var timer = setTimeout(function() {
                Global.socket.emit('typing',{'nickname':Global.nickname, 'status':false});
            }, 3000);*/
        }
    });
    
    $('#btnSend').click(function(){
        if($('#msgBox').val()){
           Global.sendMsg();
           //Global.socket.emit('typing',{'nickname':Global.nickname, 'status':false});
        }
        else;
    });
});
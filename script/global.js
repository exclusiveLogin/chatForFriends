var Global={};
    Global.nickname;
    Global.autoscroll = true;
    Global.soundToggle = true;
    Global.timer_reconnect;
    Global.socket;
    Global.users = {};
    
    Global.nickNameSend = function(){
        Global.socket.emit('nickname', Global.nickname);        
    }
    Global.nickNameSubmit = function(){
        $('#nickName').val('');
        $('#globalFooter').fadeIn(1000);
        $('#nickNameSubmit').hide(1000);
        $('#nickName').hide(1000);
        $('#chatHeaderText').text('Вы вошли как '+Global.nickname);
        $('#exitSubmit').show(1000);
        $('#msgBox').focus();
        Global.nickNameSend();
    }
    Global.userCheck = function(){//Проверка имеется ли такой никнейм
        if(Global.users[Global.nickname]){//Если да, то просим ввести его пароль
            Global.userAuth();
        }
        else{//если нет, спрашиваем создать ли его в системе
            Global.userAsk();
        }
    }
    Global.userAsk = function(){
        $('#userRegistration').show(1000);//показываем диалог
        $('#userRegAsk').show();//показываем вопрос
    }
    Global.userAuth = function(){
        $('#authUserPass').hide();//Прячем поля на всякий случай
        $('#userAuthorization').show(1000);//показываем диалог авторизации            
        $('#userAuthAsk').show(1000);//показываем кнопки
    }
    Global.userRegistration = function(data){
        Global.socket.emit('registrationUser', {'nickname':Global.nickname, 'password':data});
        Global.nickNameSubmit();
    }
    Global.selfDisconnect = function(){
        Global.socket.disconnect();
        clearTimeout(Global.timer_reconnect);
		Global.timer_reconnect=false;
        $('#status').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    }
    Global.sendMsg = function(){
        var msg = $('#msgBox').val();
        $('#msgBox').val('');
        Global.socket.emit('msg', msg);
    }
    Global.exitSubmit = function(){
        Global.socket.emit('exit');
        $('#chatHeaderText').text('Введите свой ник:');
        $('#nickNameSubmit').show(1000);
        $('#nickName').show(1000);
        $('#exitSubmit').hide(1000);
        $('#nickName').val('');
        $('#globalFooter').fadeOut(1000);
        Global.nickname = false;
    }
    Global.autoscrolling = function(){
        if(Global.autoscroll){
            var scroll = $('#chatBody')[0].scrollHeight;
            $('#chatBody').animate({'scrollTop':scroll},1000);
        }
        else;
    }
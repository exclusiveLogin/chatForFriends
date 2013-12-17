var Global={};
    Global.nickname;
    Global.autoscroll = true;
    Global.soundToggle = true;
    Global.btnSend = false;
    Global.timer_reconnect;
    Global.socket;
    Global.users = {};
    Global.priv = [];
    Global.title = 'CFF';
    Global.day;
    Global.month;
    Global.year;
    Global.timeHours;
    Global.timeMinutes;
    Global.timeSeconds;
    Global.active = false;
    Global.client="mobile";
    
    Global.sendBtnRefresh = function(){
        if(Global.btnSend){
            $('#btnSend').show();
            $('#btnSend').buttonMarkup('refresh');
        }
        else{
            $('#btnSend').hide();
            $('#btnSend').buttonMarkup('refresh');
        }
    }
    
    Global.nickNameSend = function(){
        Global.socket.emit('nickname', {'nickname':Global.nickname, 'client':Global.client});
    }
    Global.nickNameSubmit = function(){
        $('#nickName').val('');
        $('#enterSubmit').button('disable');
        $('#msgContainer').show(500);
        $('#exitSubmit').button('enable');
        $('#notEnteredText').hide(500);
        $('#sendSlider').slider('enable');
        Global.nickNameSend();
        $.mobile.changePage($('#chat'));
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
        $('#userRegistration').popup('open');
    }
    Global.userAuth = function(){
        $('#userAuthorization').popup('open');
    }
    Global.userRegistration = function(data){
        Global.socket.emit('registrationUser', {'nickname':Global.nickname, 'password':data});
        Global.nickNameSubmit();
    }
    Global.selfDisconnect = function(){
        Global.socket.disconnect();
        clearTimeout(Global.timer_reconnect);
		Global.timer_reconnect = false;
        //Меняем статус на отключено
    }
    Global.sendMsg = function(){
        var msg = $('#msgBox').val();
        $('#msgBox').val('');
        Global.socket.emit('msg', {'msg':msg, 'priv':Global.priv});
    }
    Global.exitSubmit = function(){
        Global.nickname = false;
        $('#enterSubmit').button('enable');
        $('#exitSubmit').button('disable');
        $('#msgContainer').hide(500);
        $('#notEnteredText').show(500);
        $('#sendSlider').slider('disable');
        $('#nickName').val('');
        Global.socket.emit('exit');
    }
    Global.autoscrolling = function(){
        if(Global.autoscroll){
            var scroll = $('#chatBody')[0].scrollHeight;
            //$(document).animate({'scrollTop':scroll},1000);
            $(document).scrollTop(scroll);
        }
        else;
    }
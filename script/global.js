var Global={};
    Global.nickname;//Ник в клиентской части
    Global.autoscroll = true;//Програмный слайдер автоскрола
    Global.soundToggle = true;//Програмный слайдер звука
    Global.timer_reconnect;
    Global.socket;//Глобальная переменная сокета
    Global.users = {};//Массив полученных Reg Users
    Global.priv = [];//Массив кому пишут в приват
    Global.client="desktop";//Статическая переменная клиента
    Global.members={};//Массив сокетов онлайн
    Global.accept=true;//Compare nick toggle Client Side
    Global.day;//Переменные Timestamp
    Global.month;
    Global.year;
    Global.timeHours;
    Global.timeMinutes;
    Global.timeSeconds;
    
    Global.themeRoll = function(selector){
        //theme roller
        if(selector == 1){
            $('link').attr('href','style/default.css');
            $('#dark_theme').css('background','url(style/dark_btn_selected.png)');
            $('#light_theme').css('background','url(style/light_btn.png)');
        }
        else if(selector == 2){
            $('link').attr('href','style/light.css');
            $('#light_theme').css('background','url(style/light_btn_selected.png)');
            $('#dark_theme').css('background','url(style/dark_btn.png)');
        }
        else;
    }
    
    Global.nickNameSend = function(){
        Global.socket.emit('nickname', {'nickname':Global.nickname, 'client':Global.client});
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
        $('#userRegistration').show(500);//показываем диалог
        $('#userRegAsk').show();//показываем вопрос
    }
    Global.userAuth = function(){
        $('#authUserPass').hide();//Прячем поля на всякий случай
        $('#userAuthorization').show(500);//показываем диалог авторизации            
        $('#userAuthAsk').show(500);//показываем кнопки
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
        Global.socket.emit('msg', {'msg':msg, 'priv':Global.priv});
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
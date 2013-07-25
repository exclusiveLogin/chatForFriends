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
        alert('Проверка ника в массиве:'+Global.users[Global.nickname]);
        if(Global.users[Global.nickname]){//Если да, то просим ввести его пароль
            alert('UserCheck = true');
            Global.userAuth();
        }
        else{//если нет, спрашиваем создать ли его в системе
            alert('UserCheck = false');
            Global.userAsk();
        }
    }
    Global.userAsk = function(){
        $(document).ready(function(){
            $('#userRegistration').show(1000);//показываем диалог
            $('#userRegAsk').show();//показываем вопрос
            $('#userRegYes').click(function(){
                $('#userPass').show();//показываем поля пароля
                $('#userRegAsk').hide();//прячем кнопки
            });
            $('#userRegNo').click(function(){
                $('#userRegistration').hide(1000);//закрываем диалог
                Global.nickNameSubmit();//заходим за гостя с ником
            });
            $('#userRegSubmit').click(function() {
                //Анализ полей пароля и отправка на сервер значения
                var newUserPass = $('#newUserPass').val();;
                var newUserPassConfirm = $('#newUserPassConfirm').val();
                if(newUserPass && newUserPass == newUserPassConfirm){
                    Global.userRegistration(newUserPass);
                    $('#userRegistration').hide(1000);
                    $('#nickName').val('');
                    $('#globalFooter').fadeIn(1000);
                    $('#nickNameSubmit').hide(1000);
                    $('#nickName').hide(1000);
                    $('#chatHeaderText').text('Вы вошли как '+Global.nickname);
                    $('#exitSubmit').show(1000);
                    $('#msgBox').focus();
                    $('#userRegWarn').hide(100);
                }
                else{
                    $('#userRegWarn').show(100);
                }                
            });
            $('#userRegCancel').click(function() {//делаем тоже что и при отмене
                $('#userRegistration').hide(1000);
                Global.nickNameSubmit();
            });
        });
    }
    Global.userAuth = function(){
        $(document).ready(function(){
            $('#userAuthorization').show(1000);
            $('#authUserPass').hide();
            $('#userAuthAsk').show(1000);//показываем кнопки
            $('#userAuthYes').click(function(){
                $('#authUserPass').show(1000);//тут мы выводим поля пароля и анализ содержимого
                $('#userAuthAsk').hide(1000);//прячем кнопки    
                
            });
            $('#userAuthSubmit').click(function() {//тут будет анализ пароля
                alert('Pressed Submit');
                if($('#oldUserPass').val()){
                    var oldUserPass = $('#oldUserPass').val();
                    Global.socket.emit('existUser', oldUserPass);
                    $('#userAuthWarn').hide(100);
                    $('#userAuthorization').hide(1000);
                }
                else{
                    $('#userAuthWarn').show(100);
                }
            });
            $('#userAuthCancel').click(function() {
                    $('#userAuthorization').hide(1000);//прячем диалог
                    $('#nickName').val('');
                    $('#nickName').focus();
                    alert('Pressed Cancel');
            });
            $('#userAuthNo').click(function(){
                $('#userAuthorization').hide(1000);//прячем диалог
                $('#nickName').val('');
                $('#nickName').focus();
            });
        });
    }
    Global.userRegistration = function(data){
        Global.socket.emit('registrationUser', {'nickname':Global.nickname, 'password':data});
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
    Global.exitSubmit =function(){
        Global.socket.emit('exit');
        $('#chatHeaderText').text('Введите свой ник:');
        $('#nickNameSubmit').show(1000);
        $('#nickName').show(1000);
        $('#exitSubmit').hide(1000);
        $('#nickName').val('');
        $('#globalFooter').fadeOut(1000);
    }
    Global.autoscrolling = function(){
        if(Global.autoscroll){
            var scroll = $('#chatBody')[0].scrollHeight;
            $('#chatBody').animate({'scrollTop':scroll},1000);
        }
        else;
    }
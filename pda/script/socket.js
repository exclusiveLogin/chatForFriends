 $(document).ready(function(){
if($.browser.webkit){
        Global.socket = io.connect('https://chat-c9-serenity.c9.io',{
            'connect timeout': 60000,
            'reconnect': true,
            'reconnection delay':5000,
            'reconnection limit': 60000,
            'transports':['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']
        });
    }
    else{
        Global.socket = io.connect('https://chat-c9-serenity.c9.io',{
            'connect timeout': 60000,
            'reconnect': true,
            'reconnection delay':5000,
            'reconnection limit': 60000,
            'transports':['flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']
        });
    }
    
/*Global.socket = io.connect('http://chatforfriends.serenity.c9.io',{
            'connect timeout': 60000,
            'reconnect': true,
            'reconnection delay':5000,
            'reconnection limit': 60000,
            'transports':['flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']
        });*/

Global.socket.on('users', function(users){
        Global.users = users;
    });

Global.socket.on('connect', function(){
        $('#titleText').text('Подключен').css({
            'text-shadow':'0 0 5px #0F0',
            'color':'#0F0'
        });
        if(Global.nickname){
            $('#msgBox').fadeIn(1000);
            $('#enterSubmit').button('disable');
            $('#exitSubmit').button('enable');
            Global.nickNameSend();
        }
        else{
            $('#enterSubmit').button('enable');
            $('#exitSubmit').button('disable');
        }
        
        if(Global.timer_reconnect){
            clearTimeout(Global.timer_reconnect);
    		Global.timer_reconnect = false;
        }
        else;
    });
    
    Global.socket.on('connecting', function(){        
        $('#titleText').text('Подключение').css({
            'text-shadow':'0 0 5px #0FF',
            'color':'#0FF'
        });
    });
    
    Global.socket.on('reconnecting', function(){        
        $('#titleText').text('Переподключение').css({
            'text-shadow':'0 0 5px #0FF',
            'color':'#0FF'
        });
	    if(Global.timer_reconnect){} 
	    else{       
            Global.timer_reconnect = setTimeout(function() {
            Global.selfDisconnect();
        	}, 60000);
		}
    });
    
    Global.socket.on('error', function(reason){        
        $('#titleText').text('Ошибка сервера').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    $('#enterSubmit').button('disable');
    $('#exitSubmit').button('disable');
	if(Global.timer_reconnect){}
	else{
        Global.timer_reconnect = setTimeout(function() {
            Global.selfDisconnect();
        	}, 5000);
		}
    });
    
    Global.socket.on('welcome', function(data){
       var msg = '<div class="chatCell">'+
                    '<table class="cellContain">'+
                        '<tr>'+
                            '<td class="vizitkaSys">Система<br><div class="iconContactSystem"></div>'+
                            '<span class="time">'+Global.day+'.'+Global.month+'.'+Global.year+
                            '<br>'+Global.timeHours+':'+Global.timeMinutes+':'+Global.timeSeconds+
                            '</span></td>'+
                            '<td class="cellMsgSys">'+data+'</td>'+
                        '</tr>'+
                    '</table>'+
                '</div>';
        $('#chatBody').append(msg);
        Global.autoscrolling();
    });
    
    Global.socket.on('send', function(data){
        var msg;
        if (data.nick == Global.nickname) {
            if(Global.soundToggle) {
                    Global.snd_in.get(0).play();
                }
                else;
            if(data.to){
                msg = '<div class="chatCell">'+
                            '<table class="cellContain">'+
                                '<tr>'+
                                    '<td class="vizitkaSelf">Вы пишете '+data.to+'<br>'+
                                    '<div class="iconContact"></div>'+
                                    '<span class="time">'+Global.day+'.'+Global.month+'.'+Global.year+
                                    '<br>'+Global.timeHours+':'+Global.timeMinutes+':'+Global.timeSeconds+
                                    '</span></td>'+
                                    '<td class="cellMsgSelf">'+data.msg+'</td>'+
                                '</tr>'+
                            '</table>'+
                        '</div>';
            }
            else{
                msg = '<div class="chatCell">'+
                            '<table class="cellContain">'+
                                '<tr>'+
                                    '<td class="vizitkaSelf">Вы пишете всем<br>'+
                                    '<div class="iconContact"></div>'+
                                    '<span class="time">'+Global.day+'.'+Global.month+'.'+Global.year+
                                    '<br>'+Global.timeHours+':'+Global.timeMinutes+':'+Global.timeSeconds+
                                    '</span></td>'+
                                    '<td class="cellMsgSelf">'+data.msg+'</td>'+
                                '</tr>'+
                            '</table>'+
                        '</div>';
            }
        }
        else{
            if(Global.soundToggle) {
                    Global.snd_out.get(0).play();
                }
                else;
            if(data.to == Global.nickname){
                msg = '<div class="chatCell">'+
                            '<table class="cellContain">'+
                                '<tr>'+
                                    '<td class="vizitka">'+data.nick.nickname+' пишет Вам<br>'+
                                    '<div class="iconContact"></div>'+
                                    '<span class="time">'+Global.day+'.'+Global.month+'.'+Global.year+
                                    '<br>'+Global.timeHours+':'+Global.timeMinutes+':'+Global.timeSeconds+
                                    '</span></td>'+
                                    '<td class="cellMsg">'+data.msg+'</td>'+
                                '</tr>'+
                            '</table>'+
                        '</div>';
            }
            else{
                msg = '<div class="chatCell">'+
                            '<table class="cellContain">'+
                                '<tr>'+
                                    '<td class="vizitka">'+data.nick.nickname+' пишет<br>'+
                                    '<div class="iconContact"></div>'+
                                    '<span class="time">'+Global.day+'.'+Global.month+'.'+Global.year+
                                    '<br>'+Global.timeHours+':'+Global.timeMinutes+':'+Global.timeSeconds+
                                    '</span></td>'+
                                    '<td class="cellMsg">'+data.msg+'</td>'+
                                '</tr>'+
                            '</table>'+
                        '</div>';
            }
        }       
        $('#chatBody').append(msg);
        Global.autoscrolling();
        
    });   
    
    Global.socket.on('cl', function(data){
        $('#contactContain').empty();
        for(var i in data.members){
            var clas;
            if(Global.nickname == data.members[i].nickname){
                clas = 'contactUnitMe';
            }
            else if(data.members[i].nickname in Global.users){
                clas = 'contactUnit';
            }
            else{
                clas = 'contactUnitGuest';
            }
            
            var client;
             if(data.members[i].client=='desktop'){
                 client='<div class="desktop_client"></div>';
                 
            }else if(data.members[i].client=='mobile'){
                 client='<div class="mobile_client"></div>';
                 
             }else{
                 client='';
             }
 
            var contact = '<div class="'+clas+'">'+client+data.members[i].nickname+'</div><div class="typing" id="'+data.members[i].nickname+'_type"></div>';
            $('#contactContain').append(contact);
        }
        if (data.msg) {
            var msg = '<div class="chatCell">'+
                    '<table class="cellContain">'+
                        '<tr>'+
                            '<td class="vizitkaSys">Система<br><div class="iconContactSystem"></div>'+
                            '<span class="time">'+Global.day+'.'+Global.month+'.'+Global.year+
                            '<br>'+Global.timeHours+':'+Global.timeMinutes+':'+Global.timeSeconds+
                            '</span></td>'+
                            '<td class="cellMsgSys">'+data.msg+'</td>'+
                        '</tr>'+
                    '</table>'+
                '</div>';
            $('#chatBody').append(msg);
            Global.autoscrolling(); 
        }
        
        
    });
    
    Global.socket.on('disconnect', function(){
        $('#msgBox').fadeOut(1000);
        $('#titleText').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    });
    
    Global.socket.on('users', function(data){
        Global.usersList = data;
    });
    
    Global.socket.on('userAccess', function(data){
        var msg = '<div class="chatCell">'+
                    '<table class="cellContain">'+
                        '<tr>'+
                            '<td class="vizitkaSys">Система<br><div class="iconContactSystem"></div>'+
                            '<span class="time">'+Global.day+'.'+Global.month+'.'+Global.year+
                            '<br>'+Global.timeHours+':'+Global.timeMinutes+':'+Global.timeSeconds+
                            '</span></td>'+
                            '<td class="cellMsgSys">'+data+'</td>'+
                        '</tr>'+
                    '</table>'+
                '</div>';
        $('#chatBody').append(msg);
        Global.nickNameSubmit();
        Global.autoscrolling();
    });
    
    Global.socket.on('userDenied', function(data){
        var msg = '<div class="chatCell">'+
                    '<table class="cellContain">'+
                        '<tr>'+
                            '<td class="vizitkaSys">Система<br><div class="iconContactSystem"></div>'+
                            '<span class="time">'+Global.day+'.'+Global.month+'.'+Global.year+
                            '<br>'+Global.timeHours+':'+Global.timeMinutes+':'+Global.timeSeconds+
                            '</span></td>'+
                            '<td class="cellMsgSys">'+data+'</td>'+
                        '</tr>'+
                    '</table>'+
                '</div>';
        $('#chatBody').append(msg);
        Global.autoscrolling(); 
    });
    Global.socket.on('userTyping', function(data){
        $(document).ready(function() {
            var unitIdWhoTyping = data.nickname+'_type';
            if(data.status == true){
                $('#'+unitIdWhoTyping).show(500);
            }
            else{
                $('#'+unitIdWhoTyping).hide(500);
            }
            
        });
    });
});
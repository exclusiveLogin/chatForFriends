$(document).ready(function(){
if($.browser.webkit){
        Global.socket = io.connect('http://chatforfriends.serenity.c9.io',{
            'connect timeout': 60000,
            'reconnect': true,
            'reconnection delay':5000,
            'reconnection limit': 60000,
            'transports':['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']
        });
    }
    else{
        Global.socket = io.connect('http://chatforfriends.serenity.c9.io',{
            'connect timeout': 60000,
            'reconnect': true,
            'reconnection delay':5000,
            'reconnection limit': 60000,
            'transports':['flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']
        });
    }
Global.socket.on('users', function(users){
        Global.users = users;
    });

Global.socket.on('connect', function(){
        $('#chat').fadeIn(1000);
        $('#contactList').fadeIn(1000);
        if(Global.nickname){
            $('#globalFooter').fadeIn(1000);
            Global.nickNameSend();
        }
        else;
        
        $('#status').text('Подключено').css({
            'text-shadow':'0 0 5px #0F0',
            'color':'#0F0'
        });   
        if(Global.timer_reconnect){
            clearTimeout(Global.timer_reconnect);
    		Global.timer_reconnect = false;
        }
        else;
    });
    
    Global.socket.on('connecting', function(){        
        $('#status').text('Подключение').css({
            'text-shadow':'0 0 5px #0FF',
            'color':'#0FF'
        });
    });
    
    Global.socket.on('reconnecting', function(){        
        $('#status').text('Переподключение').css({
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
        $('#status').text('Ошибка сервера').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
	if(Global.timer_reconnect){}
	else{
        Global.timer_reconnect = setTimeout(function() {
            Global.selfDisconnect();
        	}, 5000);
		}
    });
    
    Global.socket.on('welcome', function(data){
       var msg = '<div class="chatCellSys">'+
                '<div class="chatCellHeader">Системное сообщение</div>'+
                '<div class="chatCellBodySys">'+data+
                '</div></div>';  
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
                msg = '<div class="chatCellSelf">'+
                '<div class="chatCellHeader">Вы пишете '+data.to+':</div>'+
                '<div class="chatCellBodySelf">'+data.msg+
                '</div></div>';
            }
            else{
                msg = '<div class="chatCellSelf">'+
                '<div class="chatCellHeader">Вы пишете всем:</div>'+
                '<div class="chatCellBodySelf">'+data.msg+
                '</div></div>';
            }
        }
        else{
            if(Global.soundToggle) {
                    Global.snd_out.get(0).play();
                }
                else;
            if(data.to == Global.nickname){
                msg = '<div class="chatCellSelf">'+
                '<div class="chatCellHeader">'+data.nick+' пишет Вам:</div>'+
                '<div class="chatCellBodySelf">'+data.msg+
                '</div></div>';
            }
            else{
                msg = '<div class="chatCellSelf">'+
                '<div class="chatCellHeader">'+data.nick+' пишет всем:</div>'+
                '<div class="chatCellBodySelf">'+data.msg+
                '</div></div>';
            }
        }       
        $('#chatBody').append(msg);
        Global.autoscrolling();
        
    });   
    
    Global.socket.on('cl', function(data){
        $('#contactListBody').empty();
        for(var i in data.members){
            var clas;
            if(Global.nickname == data.members[i]){
                clas = 'contactUnitMe';
            }
            else if(data.members[i] in Global.users){
                clas = 'contactUnit';
            }
            else{
                clas = 'contactUnitGuest';
            }
            var contact = '<div class="'+clas+'">'+data.members[i]+'</div>';
            $('#contactListBody').append(contact);
        }
        if (data.msg) {
            var msg = '<div class="chatCellSys">'+
            '<div class="chatCellHeader">Системное сообщение</div>'+
            '<div class="chatCellBodySys">'+data.msg+
            '</div></div>';
            $('#chatBody').append(msg);
            Global.autoscrolling(); 
        }
        
        
    });
    
    Global.socket.on('disconnect', function(){
        $('#chat').fadeOut(1000);
        $('#contactList').fadeOut(1000);
        $('#globalFooter').fadeOut(1000);
        
        $('#status').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    });
    
    Global.socket.on('users', function(data){
        Global.usersList = data;
    });
    
    Global.socket.on('userAccess', function(data){
        var msg = '<div class="chatCellSys">'+
            '<div class="chatCellHeader">Системное сообщение</div>'+
            '<div class="chatCellBodySys">'+data+
            '</div></div>';
        $('#chatBody').append(msg);
        Global.nickNameSubmit();
        Global.autoscrolling();
    });
    
    Global.socket.on('userDenied', function(data){
        var msg = '<div class="chatCellSys">'+
            '<div class="chatCellHeader">Системное сообщение</div>'+
            '<div class="chatCellBodySys">'+data+
            '</div></div>';
        $('#chatBody').append(msg);
        Global.autoscrolling(); 
    });
});
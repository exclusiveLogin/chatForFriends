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
            msg = '<div class="chatCellSelf">'+
                '<div class="chatCellHeader">Вы пишете:</div>'+
                '<div class="chatCellBodySelf">'+data.msg+
                '</div></div>'; 
                if(Global.soundToggle) {
                    Global.snd_in.get(0).play();
                }
                else;                
        }
        else{
            msg = '<div class="chatCell">'+
                '<div class="chatCellHeader">'+data.nick+' пишет:</div>'+
                '<div class="chatCellBody">'+data.msg+
                '</div></div>';
                if(Global.soundToggle) {
                    Global.snd_out.get(0).play();
                }
                else;
        }
       
        $('#chatBody').append(msg);
        Global.autoscrolling();        
    });
    
    
    
    
    Global.socket.on('cl', function(data){
        $('#contactListBody').empty();
        for(var i in data.members){
            var contact = '<div class="contactUnit">'+data.members[i]+'</div>';
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
});
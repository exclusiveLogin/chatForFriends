$(document).ready(function(){

Global.socket = io('https://chat-c9-serenity.c9.io');

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
                '<div class="timeStampSelf">'+Global.day+'.'+Global.month+'.'+Global.year+
                '<br>'+Global.timeHours+':'+Global.timeMinutes+'</div>'+
                '<div class="chatCellHeader">Вы пишете '+data.to+':</div>'+
                '<div class="chatCellBodySelf">'+data.msg+
                '</div></div>';
            }
            else{
                msg = '<div class="chatCellSelf">'+
                '<div class="timeStampSelf">'+Global.day+'.'+Global.month+'.'+Global.year+
                '<br>'+Global.timeHours+':'+Global.timeMinutes+'</div>'+
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
                msg = '<div class="chatCell">'+
                '<div class="timeStamp">'+Global.day+'.'+Global.month+'.'+Global.year+
                '<br>'+Global.timeHours+':'+Global.timeMinutes+'</div>'+
                '<div class="chatCellHeader">'+data.nick+' пишет Вам:</div>'+
                '<div class="chatCellBody">'+data.msg+
                '</div></div>';
            }
            else{
                msg = '<div class="chatCell">'+
                '<div class="timeStamp">'+Global.day+'.'+Global.month+'.'+Global.year+
                '<br>'+Global.timeHours+':'+Global.timeMinutes+'</div>'+
                '<div class="chatCellHeader">'+data.nick+' пишет всем:</div>'+
                '<div class="chatCellBody">'+data.msg+
                '</div></div>';
            }
        }       
        $('#chatBody').append(msg);
        Global.autoscrolling();
        
    });   
    
    Global.socket.on('cl', function(data){
        Global.members=data.members;
        $('#contactListBody').empty();
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
            
            
            var contact = '<div class="'+clas+'">'+client+
            data.members[i].nickname+'<div class="type_con"><div class="typing" id="'+
            data.members[i].nickname+'_type"></div></div></div>';
            
            $('#contactListBody').append(contact);
        }
        
        //Добавление комнаты
        for(var tRooms in data.rooms){
            if(tRooms){//Если комната есть
                $('#contactListBody').append('<div class="roomContainer"><div class="roomHeader">'+tRooms.substring(1)+'</div><div id="'+tRooms.substring(1)+'_room" class="roomBody"></div></div>');
                //Добавление участников комнаты
                console.log('users in room:'+data.rooms[tRooms]);
                var roomUsers = data.rooms[tRooms].toString().split(',');
                console.log(roomUsers);
                for(var ri in roomUsers){
                    $('#'+tRooms.substring(1)+'_room').append('<div class="roomContact">'+roomUsers[ri].substring(0,7)+'...'+'</div>');
                }
            }
            else{
                
            }
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
        Global.exitSubmit();
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

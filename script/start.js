var Global={};
    Global.nickname;
    Global.autoscroll = true;    
    
    Global.soundToggle = true;
    Global.timer_reconnect;
    Global.socket;
    
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



$(document).ready(function() {
    
    var snd_in = document.getElementById('msg_sound_in');
    var snd_out = document.getElementById('msg_sound_out');

    $('#msgSend').mousedown(function(){
		$(this).addClass('msgSendClick');
		});
	$('#msgSend').mouseup(function(){
		$(this).removeClass('msgSendClick');
		});
        
    $('#autoscroll').addClass('autoscrollOn');
    
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
    
    
    function selfDisconnect(){
        Global.socket.disconnect();
		clearTimeout(Global.timer_reconnect);
		Global.timer_reconnect=false;
        $('#status').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    }
    
    $('#status').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
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
            selfDisconnect();
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
            selfDisconnect();
        	}, 5000);
		}
    });
    
    Global.socket.on('welcome', function(data){
       var msg = '<div class="chatCellSys">'+
                '<div class="chatCellHeader">Системное сообщение</div>'+
                '<div class="chatCellBodySys">'+data+
                '</div></div>';  
        $('#chatBody').append(msg);
        autoscrolling();
    });
    
    Global.socket.on('send', function(data){
        var msg;
        if (data.nick == Global.nickname) {
            msg = '<div class="chatCellSelf">'+
                '<div class="chatCellHeader">Вы пишете:</div>'+
                '<div class="chatCellBodySelf">'+data.msg+
                '</div></div>'; 
                if(Global.soundToggle) {
                    snd_in.play();
                }
                else;                
        }
        else{
            msg = '<div class="chatCell">'+
                '<div class="chatCellHeader">'+data.nick+' пишет:</div>'+
                '<div class="chatCellBody">'+data.msg+
                '</div></div>';
                if(Global.soundToggle) {
                    snd_out.play();
                }
                else;
        }
       
        $('#chatBody').append(msg);
        autoscrolling();        
    });
    
    function sendMsg(){
        var msg = $('#msgBox').val();
        $('#msgBox').val('');
        Global.socket.emit('msg', msg);
    }
    
    
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
            autoscrolling(); 
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
    
    
    
    
    //Client side logic
    
    $('#nickNameSubmit').click(function(){
        if($('#nickName').val()){
            Global.nickname = $('#nickName').val();
            Global.nickNameSubmit();
        }
        else;
    });
    $('#nickName').keypress(function(e){
        if(e.which == 13){
            Global.nickname = $('#nickName').val();
            Global.nickNameSubmit();
        }
        else;
    });
    $('#nickName').focus(function(){
        $(this).val('');
    });
        
    
    
    $('#msgSend').click(function(){
        if($('#msgBox').val()){
           sendMsg();
        }
        else;
    });
    $('#msgBox').keypress(function(e) {
        if(e.which == 13){
            if($('#msgBox').val()){
                sendMsg();
            }
            else;
        }
        else;
    });
    $('#exitSubmit').click(function() {
        exitSubmit();
    });
    $('#autoscroll').click(function() {
        $(this).toggleClass('autoscrollOn');
        Global.autoscroll=!Global.autoscroll;
    });
    $('#soundToggle').click(function() {
        $(this).toggleClass('autoscrollOn');
        Global.soundToggle=!Global.soundToggle;
    });
    function exitSubmit(){
        Global.socket.emit('exit');
        $('#chatHeaderText').text('Введите свой ник:');
        $('#nickNameSubmit').show(1000);
        $('#nickName').show(1000);
        $('#exitSubmit').hide(1000);
        $('#nickName').val('');
        $('#globalFooter').fadeOut(1000);
    }
    function autoscrolling(){
        if(Global.autoscroll){
            var scroll = $('#chatBody')[0].scrollHeight;
            $('#chatBody').animate({'scrollTop':scroll},1000);
        }
        else;
    }
    
});

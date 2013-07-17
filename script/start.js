// Client side Events
$(document).ready(function() {
    $('#msgSend').mousedown(function(){
		$(this).addClass('msgSendClick');
		});
	$('#msgSend').mouseup(function(){
		$(this).removeClass('msgSendClick');
		});
        
    
    
    var socket = io.connect('http://chatforfriends.serenity.c9.io');
    var nickname;
    var autoscroll = true;
    $('#autoscroll').addClass('autoscrollOn');
    var msg_in = document.getElementById('msg_sound');
    var msg_out = document.getElementById('msg_sound_out');
    var soundToggle = true;
    
    socket.on('id', function(data){
        var id = data.substring(0,10);
        socket.emit('guestid',id);
    });
    
    $('#status').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    
    socket.on('connected', function(data){
        $('#chat').fadeIn(1000);
        $('#contactList').fadeIn(1000);
        if(nickname){
            $('#globalFooter').fadeIn(1000);
            nickNameSend();
        }
        else;
        
        $('#status').text('Подключено').css({
            'text-shadow':'0 0 5px #0F0',
            'color':'#0F0'
        });        
    });
    
    socket.on('welcome', function(data){
       var msg = '<div class="chatCellSys">'+
                '<div class="chatCellHeader">Системное сообщение</div>'+
                '<div class="chatCellBodySys">'+data+
                '</div></div>';  
        $('#chatBody').append(msg);
        autoscrolling();
    });
    
    socket.on('send', function(data){
        var msg;
        if (data.nick == nickname) {
            msg = '<div class="chatCellSelf">'+
                '<div class="chatCellHeader">Вы пишете:</div>'+
                '<div class="chatCellBodySelf">'+data.msg+
                '</div></div>'; 
                if (soundToggle) {
                    msg_out.play();
                }
                else;                
        }
        else{
            msg = '<div class="chatCell">'+
                '<div class="chatCellHeader">'+data.nick+' пишет:</div>'+
                '<div class="chatCellBody">'+data.msg+
                '</div></div>';
                if (soundToggle) {
                    msg_in.play();
                }
                else;
        }
       
        $('#chatBody').append(msg);
        autoscrolling();        
    });
    
    function sendMsg(data){
        var msg = $('#msgBox').val();
        $('#msgBox').val('');
        socket.emit('msg', msg);
    }
    
    
    socket.on('cl', function(data){
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
    
    socket.on('disconnect', function(){
        $('#chat').fadeOut(1000);
        $('#contactList').fadeOut(1000);
        $('#globalFooter').fadeOut(1000);
        
        $('#status').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    });
    
    function nickNameSend(){
        socket.emit('nickname', nickname);        
    }
    function nickNameSubmit(){
        $('#nickName').val('');
        $('#globalFooter').fadeIn(1000);
        $('#nickNameSubmit').fadeOut(1000);
        $('#nickName').fadeOut(1000);
        $('#chatHeaderText').text('Вы вошли как '+nickname);
        $('#exitSubmit').fadeIn(1000);
        $('#msgBox').focus();
        nickNameSend();
        
    }
    
    
    //Client side logic
    
    $('#nickNameSubmit').click(function(){
        if($('#nickName').val()){
            nickname = $('#nickName').val();
            nickNameSubmit();
        }
        else;
    });
    $('#nickName').keypress(function(e){
        if(e.which == 13){
            nickname = $('#nickName').val();
            nickNameSubmit();
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
        autoscroll=!autoscroll;
    });
    $('#soundToggle').click(function() {
        $(this).toggleClass('autoscrollOn');
        soundToggle=!soundToggle;
    });
    function exitSubmit(){
        socket.emit('exit');
        $('#chatHeaderText').text('Введите свой ник:');
        $('#nickNameSubmit').fadeIn(1000);
        $('#nickName').fadeIn(1000);
        $('#exitSubmit').fadeOut(1000);
        $('#nickName').val('');
    }
    function autoscrolling(){
        if(autoscroll){
            var scroll = $('#chatBody')[0].scrollHeight;
            $('#chatBody').animate({'scrollTop':scroll},1000);
        }
        else;
    }
    
});
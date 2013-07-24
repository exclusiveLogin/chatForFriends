$(document).ready(function() {
    
    Global.snd_in = $('#msg_sound_in');
    Global.snd_out = $('#msg_sound_out');

    $('#msgSend').mousedown(function(){
		$(this).addClass('msgSendClick');
		});
	$('#msgSend').mouseup(function(){
		$(this).removeClass('msgSendClick');
		});
        
    $('#autoscroll').addClass('autoscrollOn');
    
    $('#status').text('Отключено').css({
            'text-shadow':'0 0 5px #F00',
            'color':'#F00'
        });
    
    $('#nickNameSubmit').click(function(){
        if($('#nickName').val()){
            Global.nickname = $('#nickName').val();
            if(Global.nickname.length > 15)
            {
                Global.nickname = Global.nickname.substring(0 ,12)+'...';
            }
            else;   
            alert('Запуск проверки по входу');
            Global.userCheck();
        }
        else;
    });
    $('#nickName').keypress(function(e){
        if(e.which == 13){
            Global.nickname = $('#nickName').val();
            if(Global.nickname.length > 15)
            {
                Global.nickname = Global.nickname.substring(0 ,12)+'...';
            }
            else;            
            alert('Запуск проверки по Enter');
            Global.userCheck();
        }
        else;
    });
    $('#nickName').focus(function(){
        $(this).val('');
    });
        
    
    
    $('#msgSend').click(function(){
        if($('#msgBox').val()){
           Global.sendMsg();
        }
        else;
    });
    $('#msgBox').keypress(function(e) {
        if(e.which == 13){
            if($('#msgBox').val()){
                Global.sendMsg();
            }
            else;
        }
        else;
    });
    $('#exitSubmit').click(function() {
        Global.exitSubmit();
    });
    $('#autoscroll').click(function() {
        $(this).toggleClass('autoscrollOn');
        Global.autoscroll=!Global.autoscroll;
    });
    $('#soundToggle').click(function() {
        $(this).toggleClass('autoscrollOn');
        Global.soundToggle=!Global.soundToggle;
    });
    
    
});

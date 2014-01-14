$(document).ready(function() {
    
    //первичное затухание иконки "стереть историю" 
    $('#chatClear').fadeTo(5000, 0.2,function(){
        $(this).hover(
            function(){
                Global.historyShow(true);
            },
            function(){
                Global.historyShow(false);
            }
        );
    });
    
    Global.historyShow = function(show){
        if(show){
            $('#chatClear').fadeTo(500, 1);
        }
        else{
            $('#chatClear').fadeTo(1000, 0.2);
        }
    };
    //Обработчик очистки чата
    $('#chatClear').click(function(){
        $('.chatCellSys, .chatCell, .chatCellSelf').fadeOut(500,function(){
            $(this).remove();
        });
    });
    
    
});
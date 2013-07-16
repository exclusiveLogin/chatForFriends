var io = require('socket.io').listen(Number(process.env.PORT));
var members={};
io.configure(function () {
    io.set('transports', [
    'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);
    //io.set("polling duration", 10); 
});
	io.sockets.on('connection', function (socket) {		
        var id = socket.id.substring(0,7);
        members[socket.id]='Гость:'+id+'...';
        socket.emit('connected');
        io.sockets.emit('cl', {'members':members});
		socket.on('msg', function(data){
			io.sockets.emit('send',{'nick':members[socket.id],'msg':data});			
			});
		socket.on('nickname',function(data){
			members[socket.id]=data;
			io.sockets.emit('welcome','К нам входит '+data+'. Добро пожаловать!');
            io.sockets.emit('cl', {'members':members});
			});
        socket.on('disconnect',function(){
            var userDis = members[socket.id];
            delete members[socket.id];
            io.sockets.emit('cl', {'members':members,'msg':userDis+' покидает нас..:('});
			});
  	});
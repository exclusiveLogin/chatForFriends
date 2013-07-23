var io = require('socket.io').listen(Number(process.env.PORT));
var members={};
var users={};
io.configure(function () {
    io.set('transports', ['websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);
    //io.set("polling duration", 10); 
});
	io.sockets.on('connection', function (socket) {		
        var id = socket.id.substring(0,7);
        members[socket.id]='Гость:'+id+'...';
        io.sockets.emit('cl', {'members':members});
        io.sockets.emit('users',users);
		socket.on('msg', function(data){
			io.sockets.emit('send',{'nick':members[socket.id],'msg':data});			
			});
        socket.on('exit', function(){
            var userDis = members[socket.id];
    		members[socket.id]='Гость:'+id+'...';
            io.sockets.emit('cl', {'members':members,'msg':userDis+' выходит, его новый ник: '+members[socket.id]});
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
        var userAdd = function(data){
            var username = members[socket.id];
            users[username] = data;
            io.sockets.emit('cl', {'members':members,'msg':'Регистрация нового участника, '+username+' Добро пожаловать!!! :)'});
            io.sockets.emit('users',users);
			};
        var userRemove = function(){
            var username = members[socket.id];
            delete users[username];
			};
        socket.on('existsUser', function(data){
            var username = members[socket.id];
            var userPwd = users[username];
            if(data.password == userPwd){
                socket.emit('userAccess');
            }
            else{
                socket.emit('userDenied');
            }
    		});
        socket.on('registrationUser',function(data){
            var userName = members[socket.id];
            var newUserPwd = data.password;
            if(!users[userName]){
                userAdd(newUserPwd);
            }
            else{
                socket.emit('welcome', 'Ошибка при регистрации, ник не прошел валидацию');
            }
            //io.sockets.emit('cl', {'members':members,'msg':userDis+' покидает нас..:('});
    		});
  	});
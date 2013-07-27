var io = require('socket.io').listen(Number(process.env.PORT));
var members={};
var users={};
console.log('НОД запущен');
io.configure(function () {
    io.set('transports', ['websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);
    //io.set("polling duration", 10); 
});
var mongo = require("mongoskin");
var collection = mongo.db('mongodb://serenity:serenityonline@dharma.mongohq.com:10049/chatforfriends').collection('users');
collection.find().toArray(function (err, items) {
  if(!err){
    console.log('items:'+items);
    for(var i in items){
        var pass = items[i].password;
        var nick = items[i].nickname;
        users[nick] = pass;
        console.log('users='+nick+'['+pass+']');
    }
  }
  else{
    console.log('error:'+err);
  }
});
	io.sockets.on('connection', function (socket) {		
        var id = socket.id.substring(0,7);
        members[socket.id]='Гость:'+id+'...';
        io.sockets.emit('users',users);
        io.sockets.emit('cl', {'members':members});
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
        var userAdd = function(nickname, password){
            users[nickname] = password;
            io.sockets.emit('users',users);
            collection.insert({'nickname':nickname,'password':password});
        }
            
        socket.on('existUser', function(data){
            var username = data.nickname;
            var userPwd = users[username];
            console.log('username:'+username+'userPwd:'+userPwd+'data:'+data);
            if(data.password == userPwd){
                socket.emit('userAccess', 'Вы успешно вошли как '+ username);
                io.sockets.emit('cl', {'members':members});
            }
            else{
                socket.emit('userDenied', 'Ошибка пароля, вход не выполнен');
            }
    		});
        socket.on('registrationUser',function(data){
            if(users[data.nickname]){
                socket.emit('welcome', 'Ошибка при регистрации, ник не прошел валидацию');
            }
            else{
                userAdd(data.nickname, data.password);
                io.sockets.emit('welcome','Регистрация нового пользователя прошла успешно. '+data.nickname+' Добро пожаловать!');
                members[socket.id]=data.nickname;
                io.sockets.emit('cl', {'members':members});
                io.sockets.emit('users',users);
            }
    		});
  	});
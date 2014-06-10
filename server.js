var io = require('socket.io').listen(Number(process.env.PORT));
var members={};
var users={};
var rooms={};
var Glo={};

Glo.clRefresh = function(msg){
    console.log('DEBUG:cl refreshing');
    for(var r in io.sockets.adapter.rooms){
        console.log('Roomslist: '+r);    
    }
    Glo.rooms = io.sockets.adapter.rooms['exampleRoom'];
    
    //Delete this section later
    for(var i in Glo.rooms){
        console.log('Room of '+i+' : '+io.sockets.connected[i].room);
        console.log('ID:'+i+'  flag: '+Glo.rooms[i]);
    }
    
    console.log(rooms['exampleRoom']);
    
    //---------------------------
    
    if(msg){//Если есть сообщение
        io.sockets.emit('cl', {'members':members, 'rooms':Glo.rooms,'msg':msg});
        console.log('cl with msg sended');
    }
    else{//Если нет сообщения
        io.sockets.emit('cl', {'members':members, 'rooms':Glo.rooms});
        for(var r in Glo.rooms){
            if(r){
                console.log('cl without msg sended');
            }
        }
    }
}

console.log('Node.js Server is started');

var mongo = require("mongoskin");
var collection = mongo.db('mongodb://serenity:serenityonline@dharma.mongohq.com:10049/chatforfriends').collection('users');
collection.find().toArray(function (err, items) {
  if(!err){
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
	    socket.nickname="unauthorized";
        var id = socket.id.substring(0,7);
        members[socket.id]={'nickname':'Гость:'+id+'...','client':'unknown'};
        io.sockets.emit('users',users);
        Glo.clRefresh();
        
		socket.on('msg', function(data){
            if(data.priv.length > 0){
                for(var i in data.priv){
                    var name = data.priv[i];
                    console.log('name:'+name);
                    var sock;
                    for (var j in members) {
                        if(members[j].nickname == name){
                            sock = j;
                            console.log('socket:'+sock);
                            io.sockets.sockets[sock].emit('send',{'nick':members[socket.id].nickname,'msg':data.msg,'to':name});
                            io.sockets.sockets[socket.id].emit('send',{'nick':members[socket.id].nickname,'msg':data.msg,'to':name});
                        }
                        else;
                    }                    
                }
            }
            else{
                io.sockets.emit('send',{'nick':members[socket.id].nickname,'msg':data.msg});
            }
			});
        socket.on('exit', function(){
            var userDis = members[socket.id].nickname;
            members[socket.id].nickname='Гость:'+id+'...';
            //io.sockets.emit('cl', {'members':members,'msg':userDis+' выходит, его новый ник: '+members[socket.id].nickname});
            Glo.clRefresh(userDis+' выходит, его новый ник: '+members[socket.id].nickname);
			});
		socket.on('nickname',function(data){
		    for(var i in members){
		        if(members[i].nickname==data.nickname){
		          io.sockets.sockets[i].emit('userDenied','Выполнен удаленный вход');
		          break;
		        }
		        else;
		    }
			members[socket.id]={'nickname':data.nickname,'client':data.client};
			socket.nickname=data.nickname;
			io.sockets.emit('welcome','К нам входит '+data.nickname+'. Добро пожаловать!');
            Glo.clRefresh();
			});
        socket.on('disconnect',function(){
            var userDis = members[socket.id].nickname;
            delete members[socket.id];
            //io.sockets.emit('cl', {'members':members,'msg':userDis+' покидает нас..:('});
            Glo.clRefresh(userDis+' покидает нас..:(');
			});
        var userAdd = function(nickname, password){
            users[nickname] = password;
            io.sockets.emit('users',users);
            collection.insert({'nickname':nickname,'password':password});
        }
            
        socket.on('existUser', function(data){
            var username = data.nickname;
            var userPwd = users[username];
            console.log('username:'+username+'userPwd:'+userPwd);
            if(data.password == userPwd){
                socket.emit('userAccess', 'Вы успешно вошли как '+ username);
                Glo.clRefresh();
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
                members[socket.id].nickname=data.nickname;
                Glo.clRefresh();
                io.sockets.emit('users',users);
            }
    		});
        socket.on('typing',function(data){
            if(data.status == true){
                io.sockets.emit('userTyping', {'nickname':data.nickname, 'status': true});
            }
    		else{
        	    io.sockets.emit('userTyping', {'nickname':data.nickname, 'status': false});
    		}
			});
		socket.on('addRoom',function(data){
		    if('exampleRoom' in rooms){
		        console.log('room is exist');
		        rooms['exampleRoom']=push(socket.id);
		    }
		    else{
		        rooms['exampleRoom']=socket.id;
		    }
		    socket.join('exampleRoom');
		    socket.room = 'exampleRoom';
		    Glo.clRefresh();
		});
  	});
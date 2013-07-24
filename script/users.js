alert('users = true');
Global.socket.on('users', function(users){
        Global.users = users;
        alert('Users: '+users);
    });
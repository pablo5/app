var socketio = require('socket.io');
var http = require('http');
var fs = require('fs');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-type': 'text/html'
    });
    fs.createReadStream('./index.html').pipe(res);
});
server.listen(8080);

var users = []; //Con esto manejamos el listado de nuestros usuarios
var io = socketio.listen(server); //Iniciamos la libreria con nuestro servidor

//Controlamos el evento cuando se conecte e imprimimos en consola el mensaje recibido
//emitiendo el evento hello hacia el cliente con un mensaje inicial.
io.on('connection', function(socket) {
    socket.on('hello', function(msg) {
        console.log('Received: %s', msg);
        socket.emit('hello', 'Hello from server');
    });

    socket.on('login', function(msg) {
        console.log('Received Login: %s', msg);
        socket.emit('login', {
            "user": "System",
            "text": "Welcome to the chat"
        });
        users.push(msg);
    });

    //Por defecto enviamos un mensaje de bienvenida para el evento message
    socket.emit('message', '<p class="message">Welcome from server!</p>');

    //Controlamos el evento message y replicamos el mensaje a todos los clientes
    //que se encuentren conectados
    socket.on('message', function(msg) {
        console.log('Received message: %s', msg);
        var text = '<p class="message"><b>' + msg.user + '</b>:' + msg.message + '</p>';
        io.sockets.emit('message', {
            "user": msg.user,
            "text": text
        });
    });

    //Controlamos el evento list que nos va servir para ver el listado de usuarios
    //conectados
    socket.on('list', function(msg) {
        console.log('Received list: %s', msg);
        socket.emit('list', users);
    });

});
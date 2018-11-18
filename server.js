var express = require('express');
var socket = require('socket.io');
var app = express();
var port = process.env.PORT || 8080;
var http = require('http').Server(app);
var io = require('socket.io')(http);





var server = app.listen(port, function () {
    console.log("listen to " + port);
})
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));
var io = socket(server);

io.on('connection', function (socket) {
    console.log("a user connected");
    socket.on("position", function (obj) {
        console.log(obj);

        socket.broadcast.emit('position', obj);
    })

})
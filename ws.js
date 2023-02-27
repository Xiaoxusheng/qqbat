const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000');

ws.on('error', console.error);

ws.on('open', function open() {
    console.log('客户端connected');
    ws.send(new Date().toLocaleString());

});
ws.on("message", (socket) => {
    console.log(socket.toString())
})


ws.on('close', function close() {
    console.log('客户端disconnected');
});


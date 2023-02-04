const {WebSocketServer} = require("ws")
const receive = require("./receive")
const SendMessage = require("./send")

const ws = new WebSocketServer({port: 5700});


exports.wsclint = () => {
    ws.on('connection', (socket) => {
        console.log('客户端连接成功')
        // 监听对方发送的消息
        socket.on('message', function message(res) {
            console.log(res.toString())
            data = JSON.parse(res)
            receive.receive(data)

        });
        socket.on("close", socket => {
            SendMessage.SendMessage
            console.log("推送服务器断开连接")
        })

    })
}

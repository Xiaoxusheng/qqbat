const {WebSocketServer} = require("ws")
const receive = require("../utility/receive")
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
    })
    ws.on("close", () => {
        console.log("客户端断开连接")
    })
    schedule.scheduleJob("01-02 * * * * * ", function () {
        console.log("启动任务:" + new Date());

    });
}

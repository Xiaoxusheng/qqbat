const ws = require("./Websocket/ws")
const schedule = require("QQbat/utility/schedule_scheduleJob");
const {readFileSync, writeFileSync} = require("fs");
const list = [3096407768, 2195986238]
const i = Math.round(Math.random(0, 1))
//监听消息

//初始化连接
ws.wsclint()

schedule.scheduleJob({hour: 0, minute: 0, second: 0}, function () {
    console.log("[INFO] 启动时间:", "-------->>", new Date().toLocaleString())
    let respset = JSON.parse(readFileSync("config.json"))
    respset.chatmessagenumber = 0
    writeFileSync("config.json", JSON.stringify(respset))
});




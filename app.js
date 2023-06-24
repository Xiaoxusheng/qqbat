const ws = require("./Websocket/ws")
// const schedule = require("QQbat/utility/schedule_scheduleJob");
const schedule = require("node-schedule");
const myclass = require('./utility/getCass')
const {readFileSync, writeFileSync} = require("fs");
const Path = require("path");
//初始化连接
ws.wsclint()

schedule.scheduleJob({hour: 0, minute: 0, second: 0}, function () {
    console.log("[INFO] 启动时间:", "-------->>", new Date().toLocaleString())
    let respset = JSON.parse(readFileSync(Path.join(__dirname, "config.json")))
    respset.chatmessagenumber = 0
    writeFileSync("config.json", JSON.stringify(respset))
});





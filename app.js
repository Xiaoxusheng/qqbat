const axios=require("axios")
const ws =require("./Websocket/ws")
const sendMessage= require("./Websocket/send")
const fs = require("fs");
const schedule = require("schedule_scheduleJob");
const {readFileSync, writeFile, writeFileSync} = require("fs");


let weather, hot, str = '', filestr
const list = [3096407768, 2195986238]
const i = Math.round(Math.random(0, 1))
//监听消息

//初始化连接
ws.wsclint()

schedule.scheduleJob({hour: 0, minute: 0, second: 0}, function ()  {
    console.log("[INFO] 启动时间:", "-------->>", new Date().toLocaleString())
    let respset=JSON.parse(readFileSync("config.json"))
    respset.chatmessagenumber=0
    writeFileSync("config.json",JSON.stringify(respset))
});




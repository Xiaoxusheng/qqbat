const send = require("./app")
const sendmessage = require("./send")
const read = require("./messagedeal")
const schedule_scheduleJob=require("./schedule_scheduleJob")
const getclass=require("./getCookie")
const group=require("./private/group")
const fs = require("fs")
const privatrchat=require("./private/private")


//处理消息函数
exports.receive = (data) => {
    if (data.message_type === "undefined" || data.message === "undefined") {
        schedule_scheduleJob.schedule(data.user_id)
        return
    }
    //戳一戳
    if (data.post_type === "notice") {
        sendmessage.SendMessage("private", "[CQ:poke,qq=3096407768]", data.sender_id,)
    }
    if (data.message) {
        //已读消息
        read.read(data.message_id)
        if(data.message_type==="group"){
            group.groupsreceive(data)
            return;
        }else {
              privatrchat.privates(data)
        }
    }


    console.log("消息类型：", data.message_type, "\n")
    console.log("接收ID：", data.target_id, "\n")
    console.log("消息内容：", data.message, "\n")
    console.log("发送人ID：", data.user_id, "\n")


}


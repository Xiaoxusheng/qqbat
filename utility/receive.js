const sendmessage = require("../Websocket/send")
const read = require("./messagedeal")
const schedule_scheduleJob=require("./schedule_scheduleJob")
const group=require("../private/group")
const privatrchat=require("../private/private")
const messagedeal = require("./messagedeal");
const chatgpt= require("../chatgpt/chatgpt");



//处理消息函数
exports.receive = (data) => {
    //数据验证
    chatgpt.moderations(data.message_type, data.message,data.user_id)

    if (data.message_type === "undefined" || data.message === "undefined") {
        schedule_scheduleJob.schedule(data.user_id)
        return
    }
    //消息防撤回
    messagedeal.banrecall(data)
    //戳一戳
    /*{"post_type":"notice","notice_type":"notify","time":1677068043,"self_id":2673893724,"sub_type":"poke","user_id":3096407768,"sender_id":3096407768,"target_id":2673893724}*/
    if (data.post_type === "notice") {
        sendmessage.SendMessage("private", `[CQ:poke,qq=${data.sender_id}]`, data.sender_id,)
        return;
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


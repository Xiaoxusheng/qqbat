const sendmessage = require("../Websocket/send")
const read = require("./messagedeal")
const schedule_scheduleJob = require("./schedule_scheduleJob")
const group = require("../private/group")
const privatrchat = require("../private/private")
const messagedeal = require("./messagedeal");
const chatgpt = require("../chatgpt/chatgpt");


//处理消息函数
exports.receive = (data) => {
    //数据验证
    chatgpt.moderations(data.message_type, data.message, data.user_id)

    if (data.message_type === "undefined" || data.message === "undefined") {
        schedule_scheduleJob.schedule(data.user_id)
        return
    }
    //消息防撤回
    messagedeal.banrecall(data)
    //戳一戳
    // {"post_type":"notice","notice_type":"notify","time":1677152605,"self_id":2673893724,"sub_type":"poke","sender_id":3096407768,"target_id":2673893724,"user_id":3096407768}
    /*{"post_type":"notice","notice_type":"notify","time":1677068043,"self_id":2673893724,"sub_type":"poke","user_id":3096407768,"sender_id":3096407768,"target_id":2673893724}*/
    //{"post_type":"notice","notice_type":"notify","time":1677152688,"self_id":2673893724,"sub_type":"poke","sender_id":3096407768,"target_id":2673893724,"group_id":682671449,"user_id":3096407768}
    if (data.post_type === "notice" && data.notice_type === "notify" && data.sub_type === "poke") {
        sendmessage.SendMessage("group", `[CQ:poke,qq=${data.sender_id}]`, data.group_id,)
        return;
    }
    /*群成员退出
* {"post_type":"notice","notice_type":"group_decrease","time":1677764209,"self_id":2673893724,
* "sub_type":"leave","group_id":682671449,"operator_id":3096407768,"user_id":3096407768}*/

    /*群成员加入
    *  {"post_type":"notice","notice_type":"group_increase","time":1677764267,
    * "self_id":2673893724,"sub_type":"approve","group_id":682671449,"operator_id":0,"user_id":3096407768}*/

    if (data.post_type === "notice" && data.notice_type === "group_decreas") {
        if (data.notice_type === "group_decreas") {
            //退群
            SendMessage.SendMessage("group", `[CQ:at,qq=${data.user_id}]退出群聊`, data.group_id)

        } else if (data.notice_type === "group_increase") {
            //进群
            SendMessage.SendMessage("group", `欢迎新成员[CQ:at,qq=${data.user_id}]`, data.group_id)
        }

    }
    //进群
    // if (data.post_type === "notice" && data.notice_type === "group_increase") {
    //     SendMessage.SendMessage("group", `欢迎新成员[CQ:at,qq=${data.user_id}]`, data.group_id)
    // }
    if (data.message) {
        //已读消息
        read.read(data.message_id)

        if (data.message_type === "group") {
            group.groupsreceive(data)
            return;
        } else {
            privatrchat.privates(data)
        }
    }
    console.log("消息类型：", data.message_type, "\n")
    console.log("接收ID：", data.target_id, "\n")
    console.log("消息内容：", data.message, "\n")
    console.log("发送人ID：", data.user_id, "\n")


}


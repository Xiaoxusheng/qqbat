const SendMessage = require("../send")
const getVideo = require("../app")
const fs = require("fs");
const chatgpt=require("../chatgpt/chatgpt")
const messagedeal=require("../messagedeal")
let lastMessage

//处理群消息逻辑函数
exports.groupsreceive = (data) => {

    console.log(data.message)
    console.log(data.sender.nickname === "Ra")

    // 判断是否有新成员
    let groupList1 = fs.readFileSync("./private/group.json").toString()
    if(groupList1===""){
       messagedeal.get_group_member_list(data.group_id)
        return;
    }
    groupList1 = JSON.parse(groupList1)
    get_group_member_list(data.group_id)
    let groupList2 = JSON.parse(fs.readFileSync("./private/group.json"))
    if (groupList1 !== groupList2) {
        for (let i = 0; i < groupList1.length; i++) {
            if (groupList1[i].user_id !== groupList1[i].user_id) {
                SendMessage.SendMessage(data.message_type, "欢迎新成员[CQ:at,qq=" + groupList2.user_id + "]", data.group_id)
            }
        }

    }

    if (data.sender.nickname === "Ra") {
        // console.log(data.message.includes("[CQ:at,qq=3096407768] "))注意这里的]后面有一个空格,不然会出问题
        if (data.message.includes("[CQ:at,qq=3096407768] ")) {
            SendMessage.SendMessage(data.message_type, "[CQ:at,qq=" + data.sender.user_id + "]", data.group_id,)
            SendMessage.SendMessage(data.message_type, "伟大的主人，我来了[CQ:face,id=123]，有什么吩咐", data.group_id)
        }
        if (data.message.includes("禁言")) {
            let QQid = data.message.slice(data.message.indexOf("=") + 1, data.message.indexOf("]"))
            console.log(QQid)
            let time = 60 * (data.message.slice(data.message.indexOf("]"), data.message.indexOf("分")))
            messagedeal.banchat(data.group_id, QQid, time)
            return
        }
        if (data.message.includes("视频")) {
            getVideo.getVideo(data.message_type, data.group_id)

        }
        if (data.message.includes("撤回")) {
            messagedeal.recall(lastMessage, group_id, data.message_type)
        }

        lastMessage = data.message_id
    } else {
        if(data.message.includes("关闭")){
            return;
        }
        else {
            chatgpt.chatgpt(data.message_type,data.group_id,data.message)
        }
        if (data.message.includes("视频")) {
            getVideo.getVideo(data.message_type, data.group_id)
            return;
        }
        SendMessage.SendMessage(data.message_type, "正在更新功能", data.group_id)
    }


}


/*
* {"post_type":"message","message_type":"group","time":1676375983,"self_id":2673893724,
* "sub_type":"normal","anonymous":null,"group_id":682671449,"message":"123456","message_seq":824,
* "raw_message":"123456","message_id":1996732370,"font":0,
* "sender":{"age":0,"area":"","card":"","level":"","nickname":"Ra","role":"member","sex":"unknown","title":"","user_id":3096407768},"user_id":3096407768}*/








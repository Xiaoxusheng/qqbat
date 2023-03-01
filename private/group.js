const SendMessage = require("../Websocket/send")
const getVideo = require("../app")
const fs = require("fs");
const chatgpt = require("../chatgpt/chatgpt")
const messagedeal = require("../utility/messagedeal")
const {readFileSync, writeFileSync} = require("fs");
const config = require("../config.json")
const sendmessage = require("../Websocket/send");


//处理群消息逻辑函数
exports.groupsreceive = (data) => {

    console.log(data.message)
    console.log(data.sender.nickname === "Ra")
    // 判断是否有新成员
    let groupList1 = fs.readFileSync("./private/group.json").toString()
    if (groupList1 === "") {
        messagedeal.get_group_member_list(data.group_id)
        return;
    }
    groupList1 = JSON.parse(groupList1)
    messagedeal.get_group_member_list(data.group_id)
    let groupList2 = JSON.parse(fs.readFileSync("./private/group.json"))
    if (groupList1 !== groupList2) {
        for (let i = 0; i < groupList1.length; i++) {
            if (groupList1[i].user_id !== groupList1[i].user_id) {
                SendMessage.SendMessage(data.message_type, "欢迎新成员[CQ:at,qq=" + groupList2.user_id + "]", data.group_id)
            }
        }

    }


    // {"post_type":"message","message_type":"group",
    //     "time":1677149263,"self_id":2673893724,"sub_type":"normal","anonymous":null,"message":"你好","" +
    // "sender":{"age":0,"area":"","card":"","level":"","nickname":"Ra","role":"member","sex":"unknown","title":"","user_id":3096407768},
    //     "message_id":-2062953045,"font":0,"group_id":682671449,"message_seq":2341,"raw_message":"你好","user_id":3096407768}

    if (data.user_id === config.manager[0]) {
        // console.log(data.message.includes("[CQ:at,qq=3096407768] "))注意这里的]后面有一个空格,不然会出问题
        if (data.message.includes("[CQ:at,qq=3096407768] ")) {
            SendMessage.SendMessage(data.message_type, "[CQ:at,qq=" + data.sender.user_id + "]", data.group_id,)
            SendMessage.SendMessage(data.message_type, "伟大的主人，我来了[CQ:face,id=123]，有什么吩咐", data.group_id)
        }
        if (data.message.includes("禁言") || data.message.includes("取消禁言")) {
            let QQid = data.message.slice(data.message.indexOf("=") + 1, data.message.indexOf("]"))
            console.log(QQid)
            let time = 60 * (data.message.slice(data.message.indexOf("]"), data.message.indexOf("分")))
            if (data.message.includes("取消禁言")) {
                time = 0
            }
            messagedeal.banchat(data.group_id, QQid, time)
            return
        }
        if (data.message.includes("关闭防撤功能") || data.message.includes("打开防撤功能")) {
            try {
                const res = JSON.parse(readFileSync("../config.json"))
                if (res.recallswith && data.message.includes("打开防撤功能")) {
                    SendMessage.SendMessage(data.message_type, "当前已经打开,请不要重复打开", data.group_id)
                    return;
                }
                if (!res.recallswith && data.message.includes("关闭防撤功能")) {
                    SendMessage.SendMessage(data.message_type, "当前已经关闭,请不要重复关闭", data.group_id)
                    return;
                }
                res.recallswith = !res.recallswith
                writeFileSync("../config.json", JSON.stringify(res))
                SendMessage.SendMessage(data.message_type, `防撤功能更改成功|：：当前撤功能${res.recallswith ? "打开" : "关闭"}`, data.group_id)
            } catch (e) {
                SendMessage.SendMessage(data.message_type, "防撤回功能更改失败", data.group_id)
            }
        }

        if (data.message.includes("视频")) {
            getVideo.getVideo(data.message_type, data.group_id)

        }
        // [CQ:reply,id=-1292667580][CQ:at,qq=2673893724] [CQ:at,qq=2673893724] 撤回
        if (data.message.includes("撤回")) {
            //[CQ:reply,id=-2019851725][CQ:at,qq=3096407768] 撤回
            // {"post_type":"message","message_type":"group","time":1677072224,"self_id":2673893724,"sub_type":"normal",
            //     "sender":{"age":0,"area":"","card":"","level":"","nickname":"Ra","role":"member","sex":"unknown","title":"","user_id":3096407768},"user_id":3096407768,"message_id":-67439232,"anonymous":null,"group_id":682671449,"message":"[CQ:reply,id=-331723533][CQ:at,qq=3096407768] 撤回",
            //     "raw_message":"[CQ:reply,id=-331723533][CQ:at,qq=3096407768] 撤回","font":0,"message_seq":2111}
            let message_id = data.message.slice(data.message.indexOf("=") + 1, data.message.indexOf("]"))
            messagedeal.recall(data.message_type, data.group_id, message_id,)
            messagedeal.recall(data.message_type, data.group_id, data.message_id)
        }
        if (data.message.includes("消息数")) {
            const number = JSON.parse(readFileSync("../config.json"))
            SendMessage.SendMessage(data.message_type, `已发消息|${number.chatmessagenumber}`, data.group_id)
        }
        if (data.message.includes("画图")) {
            chatgpt.getimg("group", data.group_id, data.message)
        }
        if (data.message.includes("CQ:image")) {
            messagedeal.gettext(data)
        }
        if (data.message.includes("关闭机器人") || data.message.includes("打开机器人")) {
            const datas = JSON.parse(readFileSync("../config.json"))
            datas.group_swith = !datas.group_swith
            writeFileSync("../config.json", JSON.stringify(datas))
            SendMessage.SendMessage(data.message_type, `机器人${datas.group_swith ? "打开" : "关闭"}`, data.group_id)
        }
        chatgpt.chatgpt(data.message_type, data.group_id, data.message_id, data.message)
    } else {
        if (data.message.includes("关闭")) {
            return;
        } else {
            const datas = JSON.parse(readFileSync("../config.json"))
            if (datas.group_swith) {
                chatgpt.chatgpt(data.message_type, data.group_id, data.message_id, data.message)
                return;
            }

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
//
// {"post_type":"message","message_type":"group","time":1676981347,"self_id":2673893724,"sub_type":"normal","font":0,"group_id":682671449,"sender":{"age":0,"area":"","card":"","level":"","nickname":"Ra","role":"member","sex":"unknown","title":"","user_id":3096407768},
//     "message_id":996411512,"anonymous":null,"message":"1","message_seq":1933,"raw_message":"1","user_id":3096407768}
// message_id: 996411512


//
// {"post_type":"notice","notice_type":"group_recall","time":
//     1676981378,"self_id":2673893724,"user_id":3096407768,"operator_id":2673893724,"message_id":1259273463,"group_id":682671449}

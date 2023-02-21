const axios = require("axios")
const fs = require("fs");
const SendMessage = require("../Websocket/send");
const getmessage = require("./getmessage")
//已读消息
exports.read = async ({message_id}) => {
    const {data: res} = await axios({
        method: "post",
        url: "http://127.0.0.1:5000/mark_msg_as_read",
        data: {
            message_id: message_id
        },

    })
    console.log(res)
}

//撤回消息
exports.recall = async ( message_type,group_id, message_id,) => {
    try {
        const {data: res} = await axios({
            method: "post",
            url: "http://127.0.0.1:5000/delete_msg",
            data: {
                message_id: message_id
            },

        })
        await SendMessage.SendMessage(message_type, "撤回成功", group_id,)
        console.log(res)
    } catch (e) {
        if (e) {
            await SendMessage.SendMessage(message_type, `撤回失败:${e}`, group_id,)
        }

    }
}

//禁言处理
exports.banchat = async (group_id, user_id, duration) => {
    try {
        if (duration < 0) {
            await SendMessage.SendMessage("group", "设置禁言的时间不能小于0", group_id,)
            return
        }
        //duration禁言时长, 单位秒, 0 表示取消禁言
        const {data: res} = await axios({
            url: "http://127.0.0.1:5000/set_group_ban",
            method: "post",
            data: {
                user_id,
                group_id,
                duration,
            }

        })
        await SendMessage.SendMessage("group", "设置禁言成功", group_id,)
    } catch (e) {
        if (e) {
            await SendMessage.SendMessage("group", `设置失败:${e}`, group_id,)
        }
    }

}
//群成员列表
exports.get_group_member_list = async (group_id) => {
    try {
        const res = await axios({
            method: "get",
            url: "http://127.0.0.1:5000/get_group_member_list",
            params: {
                group_id
            }
        })
        console.log(res.data.data)
        fs.writeFileSync("./private/groupList.json", res.data.data)


    } catch (e) {
        if (e) {
            console.log(e)
        }

    }

}
/*
*  {"post_type":"notice","notice_type":"group_recall","time":1676808367,"self_id":2673893724,
* "group_id":682671449,"user_id":3096407768,"operator_id":2673893724,"message_id":-1087124037}
*私人聊天撤回
*{"post_type":"notice","notice_type":"friend_recall","time":1676811122,"self_id":2673893724,"message_id":-319033038,"user_id":3096407768}
* 群聊天撤回
* {"post_type":"notice","notice_type":"group_recall","time":1676809270,"self_id":2673893724,
* "group_id":682671449,"user_id":3096407768,"operator_id":3096407768,"message_id":-1460439864}
* 视频
* [CQ:video,file=3f1451647056a4df574c1afbdc94ac62.video,
* url=http://180.102.109.121:80/qqdownload?
* ver=537118796&amp;rkey=3081fd0201010481f53081f202010102010002049f60615c0481a63330353130323031303030343336333033343032303130303032303462383866
* 366564383032303337613133663730323034323830333166366630323034363366333031613330343130336631343531363437303536613464663537346331616662646339346163363230
* 3230333761316166663032303130303034313430303030303030383636363936633635373437393730363530303030303030343331333033303331020463f301a404350000000866696c657479
* 706500000004313030330000000b646f776e656e63727970740000000130000000047175696300000001300400&amp;filetype=1003&amp;videotype=1&amp;subvideotype=0&amp;term=unknow]
*
* */
//防撤回
exports.banrecall = async ({notice_type, operator_id, message_id, user_id, group_id}) => {
    if (notice_type === "group_recall" && operator_id === user_id) {
        const message1 = await getmessage.getmessage("group", message_id, user_id)
        await SendMessage.SendMessage("group", `[CQ:at,qq=${user_id}]撤回消息：\n ${message1.data.data.message}`, user_id)
    } else if (notice_type === "friend_recall") {
        const message2 = await getmessage.getmessage("private", message_id, user_id)
        await SendMessage.SendMessage("private", `[CQ:at,qq=${user_id}]撤回消息：\n${message2.data.data.message}`, user_id)
    }else if(notice_type === "group_recall" && operator_id !== operator_id){

    }

}

/*
*  {"post_type":"message","message_type":"group","time":1676787192,"self_id":2673893724,"sub_type":"normal","raw_message":"你会什么",
* "sender":{"age":0,"area":"","card":"","level":"","nickname":"Ra","role":"member","sex":"unknown","title":"","user_id":3096407768},
* "message_id":592689879,"message_seq":1672,"user_id":3096407768,"anonymous":null,"font":0,"group_id":682671449,"message":"你会什么"}*/
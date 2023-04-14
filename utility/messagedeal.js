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
exports.recall = async (message_type, group_id, message_id,) => {
    try {
        const {data: res} = await axios({
            method: "post",
            url: "http://127.0.0.1:5000/delete_msg",
            data: {
                message_id: message_id
            },

        })
        // await SendMessage.SendMessage(message_type, "撤回成功", group_id,)
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


//防撤回
exports.banrecall = async ({notice_type, operator_id, message_id, user_id, group_id}) => {
    let res = JSON.parse(fs.readFileSync("config.json"))
    if (!res.recallswith) {
        return
    }
    if (notice_type === "group_recall" && operator_id === user_id) {
        const message1 = await getmessage.getmessage("group", message_id, group_id)
        await SendMessage.SendMessage("group", `[CQ:at,qq=${user_id}]撤回消息：\n ${message1.data.data.message}`, group_id)
    } else if (notice_type === "friend_recall") {
        const message2 = await getmessage.getmessage("private", message_id, user_id)
        await SendMessage.SendMessage("private", `[CQ:at,qq=${user_id}]撤回消息：\n${message2.data.data.message}`, user_id)
    }
}

/*
*  {"post_type":"message","message_type":"group","time":1676787192,"self_id":2673893724,"sub_type":"normal","raw_message":"你会什么",
* "sender":{"age":0,"area":"","card":"","level":"","nickname":"Ra","role":"member","sex":"unknown","title":"","user_id":3096407768},
* "message_id":592689879,"message_seq":1672,"user_id":3096407768,"anonymous":null,"font":0,"group_id":682671449,"message":"你会什么"}*/
//图片ocr /ocr_image
/*{"post_type":"message","message_type":"private","time":1677214960,"self_id":2673893724,
    "sub_type":"friend","sender":{"age":0,"nickname":"Ra","sex":"unknown","user_id":3096407768},
    "message_id":1190212098,"user_id":3096407768,"target_id":2673893724,
    "message":"[CQ:image,file=0a99369c2c0c65aa57c5978118d656f1.image," +
    "url=https://c2cpicdw.qpic.cn/offpic_new/3096407768//3096407768-1562379565-0A99369C2C0C65AA57C5978118D656F1/0?term=3\u0026amp;is_origin=0]",
    "raw_message":"[CQ:image,file=0a99369c2c0c65aa57c5978118d656f1.image," +
   "url=https://c2cpicdw.qpic.cn/offpic_new/3096407768//3096407768-1562379565-0A99369C2C0C65AA57C5978118D656F1/0?term=3\u0026amp;is_origin=0]","font":0}*/
exports.gettext = async ({message_type, user_id, message_id, group_id, url}) => {
    const res = await axios({
        url: "http://127.0.0.1:5000/ocr_image",
        method: "get",
        params: {
            image: message_id
        }
    })
    await SendMessage.SendMessage(message_type, res.data, group_id ? group_id : user_id)
    console.log(res)
}
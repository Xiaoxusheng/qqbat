const Sendmessage = require("../Websocket/send")
//此函数是根据message_id获取消息，相互用于撤回消息查询
const axios = require("axios");
exports.getmessage = async (types, message_id, id) => {
    try {
        const res = axios({
            url: "http://127.0.0.1:5000/get_msg",
            method: "get",
            params: {
                message_id
            }
        })
        console.log(res.data.data.message)
        return res
    } catch (e) {
        await Sendmessage.SendMessage(types, `获取撤回消息出错了:${e}`, id)
        return null
    }

}

/*
message1: {
group: true,
group_id: 682671449,
message: '123',
message_id: -891357637,
message_id_v2: '0000000028b0bd5900000721',
message_seq: 1825,
message_type: 'group',
real_id: 1825, user_id: 3096407768 },
time: 1676873066
}
*/
const axios = require("axios")
const fs = require("fs");
const SendMessage = require("./send");
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
exports.withdraw = async ( group_id,message_id, message_type) => {
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
        if(e){
            await SendMessage.SendMessage(message_type, "撤回失败:"+e, group_id,)
        }

    }
}

//禁言处理
exports.banchat=async (group_id, user_id, duration)=>{
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
            await SendMessage.SendMessage("group", "设置失败:"+e, group_id,)
        }
    }

}
//群成员列表
exports.get_group_member_list=async (group_id)=> {
    try {
        const res = await axios({
            method: "get",
            url: "http://127.0.0.1:5000/get_group_member_list",
            params: {
                group_id
            }
        })
        console.log(res.data.data)
        fs.writeFileSync("./private/groupList.json",res.data.data)


    } catch (e) {
        if(e){
            console.log(e)
        }

    }

}
/*
*  {"post_type":"message","message_type":"group","time":1676787192,"self_id":2673893724,"sub_type":"normal","raw_message":"你会什么",
* "sender":{"age":0,"area":"","card":"","level":"","nickname":"Ra","role":"member","sex":"unknown","title":"","user_id":3096407768},
* "message_id":592689879,"message_seq":1672,"user_id":3096407768,"anonymous":null,"font":0,"group_id":682671449,"message":"你会什么"}*/
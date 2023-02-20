const {writeFileSync,readFileSync} =require( "fs");
const {SendMessage} = require("../Websocket/send");
const send =require ("../app");
const {setTime}= require ("../schedule_scheduleJob");
const {getCookie, getclass} =require( "../getCookie");
const chatgpt=require("../chatgpt/chatgpt")

exports.privates = (data) => {
    let status = readFileSync("./private/status.txt").toString()
    let list = ["f", "img", "chat", "t", "y", "h", "w"]
    let model = true
    if (status) {
        while (model) {
            if (list.includes(data.message)) {
                writeFileSync("./private/status.txt", data.message)
                SendMessage(data.message_type, "模式更改为: " + data.message, data.user_id)
            }
            if (data.message === "y") {
                writeFileSync("./private/status.txt", "")
                SendMessage(data.message_type, "模式重置: ", data.user_id)

                SendMessage("[CQ:at,qq=" + data.user_id + "]" + "\n" + "请选择：" + "\n" + "重置模式: (y)" + "\n" + "天气模式：(t 例：武汉的天气)" + "\n" + "聊天模式：(chat)" + "\n" + "图片模式: (img)" + "\n" + "今日新闻：(f) " + "\n" + "看抖音视频：(v)" + "\n" + "(y,t,chat,img 全局生效)\n", data.user_id)
            }
            break
        }
        status = readFileSync("./private/status.txt").toString()

        switch (status) {
            case "chat":
                if (data.message === status) {
                    return;
                }
                // send.QQcaht(data.message_type, data.user_id, data.message)
                chatgpt.chatgpt(data.message_type, data.user_id,data.message_id, data.message)
                break
            case "t":
                if (data.message === status) {
                    return;
                }
                let city = data.message.slice(0, data.message.indexOf("的"))
                send.WeatherMessage(data.message_type, data.user_id, city)
                break
            case "img":
                if (data.message === status) {
                    return;
                }
                send.imgIs(data.message_type, data.user_id)
                break
            case "f":
                if (data.message === status) {
                    return;
                }
                send.hotmessage(data.message_type, data.user_id)
                break
            case "h":
                if (data.message === status) {
                    return;
                }
                setTime(data.message_type, data.message, data.user_id)
                break
            case "w":
                if (data.message === status) {
                    return;
                }
                getclass(data.message_type, data.message, data.user_id)
                break
            // default:
            //     sendmessage.SendMessage(data.message_type,
            //         "模式已选择:" +
            //         "可选择 \n-->天气模式：(t),\n\-->聊天模式：(chat)\,\n-->图片模式: (img)\n模式更改"
            //         , data.user_id)
            //     break

        }
    } else {
        if (!list.includes(data.message)) {
            SendMessage(data.message_type, "[CQ:record,file=http://39.98.40.255:3000/img/1.mp3]", data.user_id)
            SendMessage(data.message_type, "输入的不对呦，靓仔", data.user_id)
            SendMessage(data.message_type, "[CQ:at,qq=" + data.user_id + "]" + "\n" + "请选择：" + "\n" + "重置模式: (y)" + "\n" + "天气模式：(t 例：武汉的天气)" + "\n" + "聊天模式：(chat)" + "\n" + "图片模式: (img)" + "\n" + "今日新闻：(f) " + "\n" + "消息推送：(h 例 12,4,3096407768,早早早) " + "\n" + "看抖音视频：(v)" + "\n" + "(y,t,chat,img 全局生效)\n"

                , data.user_id)
            writeFileSync("./private/status.txt", "")
            return
        }

        if (data.message === "y") {
            SendMessage(data.message_type, "已处于重置模式", data.user_id)
            return
        }
        writeFileSync("./private/status.txt", data.message)
        SendMessage(data.message_type, "模式更改为: " + data.message, data.user_id)


    }
}

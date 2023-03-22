const {writeFileSync, readFileSync} = require("fs");
const {SendMessage} = require("../Websocket/send");
const getmessage = require("../utility/getmessage")
const setTime = require("../utility/schedule_scheduleJob");
const getclass = require("../utility/getCass");
const chatgpt = require("../chatgpt/chatgpt")


exports.privates = (data) => {
    let status = readFileSync("status.txt").toString()
    let list = ["f", "img", "chat", "t", "y", "h", "w", "v"]
    let model = true
    if (status) {
        while (model) {
            if (list.includes(data.message)) {
                writeFileSync("status.txt", data.message)
                SendMessage(data.message_type, "模式更改为: " + data.message, data.user_id)
            }
            if (data.message === "y") {
                writeFileSync("status.txt", "")
                SendMessage(data.message_type, "模式重置: ", data.user_id)
                SendMessage(data.message_type,"[CQ:at,qq=" + data.user_id + "]" + "\n"
                    + "请选择：" + "\n"
                    + "重置模式: 【y】" + "\n"
                    + "天气模式：【t 例：武汉的天气】⚡️" + "\n"
                    + "聊天模式：【chat】🐼" + "\n"
                    + "图片模式: 【img】☂️" + "\n"
                    + "今日新闻：【f】  🎈" + "\n"
                    + "看抖音视频：【v】 🚀"  + "\n"
                    + "查课表 【w 第三周 3】🤔"
                    + "【y,t,chat,img 全局生效】❤️\n", data.user_id)
            }
            break
        }
        status = readFileSync("status.txt").toString()

        switch (status) {
            case "chat":
                if (data.message === status) {
                    return;
                }
                if (data.message.includes("消息数")) {
                    const number = JSON.parse(readFileSync("config.json"))
                    SendMessage.SendMessage(data.message_type, `已发消息|${number.chatmessagenumber}`, data.group_id)
                }
                // send.QQcaht(data.message_type, data.user_id, data.message)
                chatgpt.chatgpt(data.message_type, data.user_id, data.message_id, data.message)
                break
            case "t":
                if (data.message === status) {
                    return;
                }
                let city = data.message.slice(0, data.message.indexOf("的"))
                getmessage.WeatherMessage(data.message_type, data.user_id, city)
                break
            case "img":
                if (data.message === status) {
                    return;
                }
                getmessage.imgIs(data.message_type, data.user_id)
                break
            case "f":
                if (data.message === status) {
                    return;
                }
                getmessage.hotmessage(data.message_type, data.user_id)
                break
            case "h":
                if (data.message === status) {
                    return;
                }
                setTime.setTime(data.message_type, data.message, data.user_id)
                break
            case "w":
                if (data.message === status) {
                    return;
                }
                getclass.getclass(data.message_type, data.message, data.user_id)
                break
            case "v":
                if (data.message === status) {
                    return;
                }
                getmessage.getVideo(data.message_type, data.user_id)
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
            SendMessage(data.message_type, "[CQ:record,file=XXX]", data.user_id)
            SendMessage(data.message_type, "输入的不对呦，靓仔", data.user_id)
            SendMessage(data.message_type, "[CQ:at,qq=" + data.user_id + "]" + "\n"
                + "请选择：" + "\n"
                + "重置模式: 【y】" + "\n"
                + "天气模式：【t 例：武汉的天气】⚡️" + "\n"
                + "聊天模式：【chat】🐼" + "\n"
                + "图片模式: 【img】☂️" + "\n"
                + "今日新闻：【f】 🎈 " + "\n"
                + "看抖音视频：【v】🚀 "  + "\n"
                + "查课表 【w 第三周 3】🤔"
                + "【y,t,chat,img 全局生效】❤️\n"
                , data.user_id)
            writeFileSync("status.txt", "")
            return
        }

        if (data.message === "y") {
            SendMessage(data.message_type, "已处于重置模式❤️", data.user_id)
            return
        }
        writeFileSync("status.txt", data.message)
        SendMessage(data.message_type, "模式更改为: " + data.message, data.user_id)


    }
}

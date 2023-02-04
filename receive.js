const send = require("./qqbat")
const sendmessage = require("./send")
const read = require("./aready")
const fs = require("fs")
exports.receive = (data) => {
    if (data.message_type === "undefined" || data.message === "undefined") {

        return
    }
    //戳一戳
    if (data.post_type === "notice") {
        sendmessage.SendMessage("private", "[CQ:poke,qq=3096407768]", data.sender_id,)
    }


    if (data.message) {
        //已读消息
        read.read(data.message_id)
        let status = fs.readFileSync("./QQbat/status.txt").toString()
        let list = [f, img, chat, t]
        let model = true
        if (status) {
            while (model) {
                if (list.includes(data.message)) {
                    fs.writeFileSync("./QQbat/status.txt", data.message)
                    sendmessage.SendMessage(data.message_type, "模式更改为: " + data.message, data.user_id)
                }
                if (data.message === "y") {
                    fs.writeFileSync("./QQbat/status.txt", "")
                    sendmessage.SendMessage(data.message_type, "模式重置: ", data.user_id)

                    sendmessage.SendMessage("[CQ:at,qq=" + data.user_id + "]" + "\n" + "请选择：" + "\n" + "重置模式: (y)" + "\n" + "天气模式：(t 例：武汉的天气)" + "\n" + "聊天模式：(chat)" + "\n" + "图片模式: (img)" + "\n" + "今日新闻：(f) " + "\n" + "(y,t,chat,img 全局生效)\n", data.user_id)
                }
                break
            }
            status = fs.readFileSync("./QQbat/status.txt").toString()

            switch (status) {
                case "chat":
                    if (data.message === status) {
                        return;
                    }
                    send.QQcaht(data.message_type, data.user_id, data.message)
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
                // default:
                //     sendmessage.SendMessage(data.message_type,
                //         "模式已选择:" +
                //         "可选择 \n-->天气模式：(t),\n\-->聊天模式：(chat)\,\n-->图片模式: (img)\n模式更改"
                //         , data.user_id)
                //     break

            }
        } else {
            if (!list.includes(data.message)) {
                sendmessage.SendMessage(data.message_type, "[CQ:record,file=http://39.98.40.255:3000/img/1.mp3]", data.user_id)
                sendmessage.SendMessage(data.message_type, "输入的不对呦，靓仔", data.user_id)
                sendmessage.SendMessage(data.message_type, "[CQ:at,qq=" + data.user_id + "]" + "\n" + "请选择：" + "\n" + "重置模式: (y)" + "\n" + "天气模式：(t 例：武汉的天气)" + "\n" + "聊天模式：(chat)" + "\n" + "图片模式: (img)" + "\n" + "今日新闻：(f) " + "\n" + "(y,t,chat,img 全局生效)\n"

                    , data.user_id)
                fs.writeFileSync("./QQbat/status.txt", "")
                return
            }

            if (data.message === "y") {
                sendmessage.SendMessage(data.message_type, "已处于重置模式", data.user_id)
                return
            }
            fs.writeFileSync("status.txt", data.message)
            sendmessage.SendMessage(data.message_type, "模式更改为: " + data.message, data.user_id)
            return

        }


    }


    console.log("消息类型：", data.message_type, "\n")
    console.log("接收ID：", data.target_id, "\n")
    console.log("消息内容：", data.message, "\n")
    console.log("发送人ID：", data.user_id, "\n")


}


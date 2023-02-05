const schedule = require("node-schedule");
const sendmessage = require("./send")
const fs=require("fs")
const send = require("./qqbat")
exports.schedule = () => {
    const data= fs.readFileSync("time.json")
    let time=new Date()

    schedule.scheduleJob({hour: data.hour, minute: data.min, second: 0}, function ()  {
        console.log("[INFO] 启动时间:", "-------->>", new Date().toLocaleString())
        sendmessage.SendMessage(data.types, data.data, data.user_id,)
    });
}
//设定时间推送消息
exports.setTime = (types,res,id) => {
    res=res.split(",")
    console.log(res)
    if ((0 <=res[0] && res[0] <= 24) &&( 0 <= res[1] && res[1]<= 60)) {
        const data = {
            hour: res[0],
            min: res[1],
            user_id:res[2],
            data:res[3]+"(消息为qq机器人自动推送)",
            types:"private"

        }
        fs.writeFileSync("./QQbat/time.json", JSON.stringify(data))
        sendmessage.SendMessage(types, "设置成功了，靓仔", id,)
    } else {
        sendmessage.SendMessage(types, "输入时间格式不对", id,)
    }
}
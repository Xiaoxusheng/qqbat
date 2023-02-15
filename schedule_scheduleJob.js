const schedule = require("node-schedule");
const sendmessage = require("./send")
const fs = require("fs")
const send = require("./app")
exports.schedule = () => {
    const data = fs.readFileSync("time.json")
    let time = new Date()
    let j = schedule.scheduleJob({hour: data.hour, minute: data.min, second: 0}, function () {
        console.log("[INFO] 启动时间:", "-------->>", new Date().toLocaleString())
        sendmessage.SendMessage(data.types, data.data, data.user_id,)
    });


    j.cancel()
}
//设定时间推送消息
exports.setTime = (types, res, id) => {
  try {
      res = res.split(",")
      console.log(res[0].dayOfWeek)
      if ((0 <= res[0] && res[0] <= 24) && (0 <= res[1] && res[1] <= 60)) {
          if (res[2].length < 9) {
              sendmessage.SendMessage(types, "QQ位数错误", id,)
              return
          }

          const data = {
              hour: res[0],
              min: res[1],
              user_id: res[2],
              data: res[3] + "(消息为qq机器人自动推送)",
              types: "private",
              id: id

          }
          fs.writeFileSync("time.json", JSON.stringify(data))
          sendmessage.SendMessage(types, "设置成功了，靓仔", id,)
      } else {
          sendmessage.SendMessage(types, "输入时间格式不对", id,)
      }
  }catch (e) {
      if(e){
          sendmessage.SendMessage(types, "输入的,不对 ", id,)
          fs.writeFileSync("time.json", "")
      }
  }
}
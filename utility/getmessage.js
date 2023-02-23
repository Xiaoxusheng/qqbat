const Sendmessage = require("../Websocket/send")
const axios = require("axios");
const {readFile,writeFile} = require("fs");
let weather, hot, str = '', filestr

//此函数是根据message_id获取消息，用于撤回消息查询
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

//获取今日天气
exports.WeatherMessage = async (types, id, citys) => {


    try {
        const {data: res} = await axios({
            methods: "post",
            url: "https://way.jd.com/he/freeweather",
            params: {city: citys, appkey: "da39dce4f8aa52155677ed8cd23a6470"},
        })
        console.log(res)
        if (res.code === '10000') {
            weather = `主人查询时间: ${new Date().toLocaleString()},\n城市:${res.result.HeWeather5[0].basic.city},\n日期:${res.result.HeWeather5[0].hourly_forecast[0].date},\n天气:${res.result.HeWeather5[0].hourly_forecast[0].cond.txt},\n风向:${res.result.HeWeather5[0].hourly_forecast[0].wind.dir},\n风速:${res.result.HeWeather5[0].hourly_forecast[0].wind.spd},\n运动:${res.result.HeWeather5[0].suggestion.sport.txt}\n温度:${res.result.HeWeather5[0].hourly_forecast[0].tmp},\n穿衣:${res.result.HeWeather5[0].suggestion.drsg.txt}\n生活指数:${res.result.HeWeather5[0].suggestion.drsg.brf}\n感冒指数:${res.result.HeWeather5[0].suggestion.flu.brf}\n提示:${res.result.HeWeather5[0].suggestion.flu.txt}`

            await sendMessage.SendMessage(types, weather, id)
            return
        }
        weather = "获取今日天气失败，请联系主人"
        await sendMessage.SendMessage(types, weather, id)
    } catch (e) {
        console.log(e)
        if (e) {
            await sendMessage.SendMessage(types, "输入有误", id)
        }
    }
}

//热点http://v.juhe.cn/toutiao/index
//新的接口
exports.hotmessage = async (types, id) => {
    try {
        const {data: res} = await axios({
            method: "get",
            url: "http://v.juhe.cn/toutiao/index",
            params: {
                key: "d268884b9b07c0eb9d6093dc54116018",

            }
        })
        console.log(res.result.data)
        if (res.reason === "success!") {
            let str = ""
            let x = 1
            res.result.data.forEach(i => {
                str += x + "." + i.title + "\n"
                x++
            })
            await sendMessage.SendMessage(types, str, id)
        } else {
            await sendMessage.SendMessage(types, "联系管理员，获取热点失败", id)
        }
    } catch (e) {
        if (e) {
            console.log(e)
            await sendMessage.SendMessage(types, "热点出错了:"+e, id)
        }
    }
}

//百度热搜
function BaiduHot() {
    readFile("../goserve/test/hot.txt", (err, file) => {
        if (err) {
            console.log("读文件出错:", err)
            throw err
        }
        hot = file.toString()
        console.log((hot))
    })
}

//设置为12
async function getphone() {

    const {data: res} = await axios({
        method: "post",
        url: "http://127.0.0.1:5000/_set_model_show",
        data: {
            model: "go-cqhttp",
            model_show: "go-cqhttp (黑色)"

        }

    })
    console.log(res)
}

//发送图片
exports.imgIs = (types, id,) => {
    try {
        let imglist = JSON.parse(fs.readFileSync("../imgUrl.json"))
        filestr = "[CQ:image,file=" + imglist[Math.floor(Math.random(0, 1) * imglist.length) + 1].url + "]"
        sendMessage.SendMessage(types, filestr, id)
    } catch (e) {
        if (e) {
            sendMessage.SendMessage(types, "图片出错了:"+e, id)
        }
    }


}

async function getlist() {
    const {data: response} = await axios({
        method: "post",
        url: "http://127.0.0.1:5000/get_friend_list",
    })
    console.log(response)
    response.data.forEach(dataKey => {
        str += "网名:\t" + dataKey.nickname + "\t," + "备注：\t" + dataKey.remark + ",\t" + "QQ: \t" + dataKey.user_id + "\n"

    })
    writeFile("好友列表.txt", str, (err) => {
        if (err) {
            throw err

        }
        console.log("写入完成")
    })
}


exports.QQcaht = async (types, id, msg) => {
    try {
        const {data: res} = await axios({
            url: "http://api.qingyunke.com/api.php",
            method: "get",
            params: {
                key: "free",
                appid: 0,
                msg: msg
            }
        })
        console.log(res)
        if (res.result === 0) {
            sendMessage.SendMessage(types, res.content.replace(/\{br\}/g, ""), id)
        } else {
            sendMessage.SendMessage(send.SendMessage(types, "机器人出错了", id))
        }
    } catch (e) {
        if (e) {
            sendMessage.SendMessage(send.SendMessage(types, "输入有误", id))
        }
    }

}
//[CQ:video,file=http://baidu.com/1.mp4]
//获取视频
exports.getVideo = async (types, id) => {
    try {
        const {data: res} = await axios({
            method: "get",
            url: "https://zj.v.api.aa1.cn/api/video_dyv2",
        })
        //https://zj.v.api.aa1.cn/api/video_dyv2
        //https://tucdn.wpon.cn/api-girl/index.php?wpon=json
        // console.log("https:" + res.mp4)
        // let vedioUrl = "[CQ:video,file=" + "https:" + res.mp4 + "]"
        await sendMessage.SendMessage(types,` [CQ:video,file=${res.url}`, id,)
    } catch (e) {
        if (e) {
            await sendMessage.SendMessage(types, "获取视频接口出错了,联系管理员,错误原因："+e, id)
        }
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
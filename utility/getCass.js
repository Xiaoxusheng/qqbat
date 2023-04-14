const axios = require("axios")
const {writeFileSync, readFileSync} = require("fs");
const sendMessage = require("../Websocket/send")
const config = require("../config.json")



//获取cookie
async function getCookie(types, id) {
    try {

        let cookie = []
        const res = await axios({
            method: "get",
            url: "https://passport2.chaoxing.com/api/login",
            params: {
                 // name: 电话号,
                 // pwd:"密码"
            },
            withCredentials: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
                'Accept-Language': ' zh-CN,zh;q=0.9',
                'Accept-Encoding': ' gzip, deflate',
                'X-Requested-With': 'XMLHttpRequest',
            }
        })

        if (res.status === 200) {
            for (let i of res.headers["set-cookie"]) {
                cookie.push(i.slice(0, i.indexOf(";")))
            }
            // console.log(cookie)
            return cookie
        } else {
            return ""
        }


    } catch (e) {
        await sendMessage.SendMessage(types, `获取cookie出错,错误为:${e}`, id)
        return ""
    }
}

exports.getclass = async (types, week,id,) => {
    let str = ""
    let  date = new Date()
    // console.log(date)
    // 将日期设置为当年的2月6日
    const firstDayOfYear = new Date('2023-02-06').getTime()
    // 计算日期与当年2月6日的时间差
    const timeDiff = date - firstDayOfYear;
    // 计算时间差对应的天数
    const dayOfYear = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    // 计算当前日期属于第几周
    const weekNumber = Math.ceil(dayOfYear / 7);
    const cookie = await getCookie(types, id)
    if (week < 2 || week > 19) {
        await sendMessage.SendMessage(types, "没课啊靓仔", id)
        return
    }
    try {
        const {data: res} = await axios({
            method: "get",
            url: "https://kb.chaoxing.com/pc/curriculum/getMyLessons",
            params: {
                week:  typeof (week)==="number"? week:weekNumber
            },
            withCredentials: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                Cookie: cookie
            },
        })
        writeFileSync("class.json", JSON.stringify(res.data.lessonArray))
        let k = res.data.lessonArray.sort((a, b) => {
            return a.dayOfWeek - b.dayOfWeek
        })
        // console.log(k)
        k.forEach(i => {
            str += "周" + i.dayOfWeek + "\n"+"课程[" + i.name + "]" +"\n"+ "节次[" + i.beginNumber + "--" + (i.beginNumber + 1) + "]" +"\n"+ "教室[" + i.location + "]" + "\n"
            // console.log(str += "周[" + i.dayOfWeek + "]" + "课程[" + i.name + "]" + "节次[" + i.beginNumber + "-" + (i.beginNumber + 1) + "]" + "教室[" + i.location + "]" + "任课教师[" + i.teacherName + "]" + "\n")
        })

        await sendMessage.SendMessage(types, str, id)
    } catch (e) {
        await sendMessage.SendMessage(types, `输入有误:${e}`, id)
    }
}









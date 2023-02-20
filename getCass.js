function get(...agaent){
    console.log(agaent[0])
}
get({
    data:12,
    id:23
},100)


console.log(Date.now())

const axios = require("axios")
const {writeFileSync, readFileSync} = require("fs");
const sendMessage = require("./Websocket/send")
const config=require("./config")

let str = "",str1=""

//获取cookie
async function getCookie(t)  {
    try{

        let cookie = []
        const res = await axios({
            method: "get",
            url: "https://passport2.chaoxing.com/api/login",
            params: {
                // name: 账号,
                // pwd:密码
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
            console.log(cookie)
            return cookie
        }
        else {
           return ""
        }
    }catch (e) {
        await   sendMessage.SendMessage(types,"获取cookie出错,错误为:"+e,id)
        return ""
    }


}
async function a(){
    const a=await getCookie()
    console.log(a)
}
a()
console
async function getclass(cookie, types, id, week) {
    if (week < 2 || week > 19) {
        await sendMessage.SendMessage(types, "没课啊靓仔", id)
        return
    }
    console.log(config.obj.week,week)
    if (config.obj.week===week) {
        let resp = JSON.parse(readFileSync("chet.json"))
        console.log(resp)
        let j = resp.sort((a, b) => {
            return a.dayOfWeek - b.dayOfWeek
        })
        j.forEach(i => {
            str1 += "周[" + i.dayOfWeek + "]" + "课程[" + i.name + "]" + "节次[" + i.beginNumber + "-" + (i.beginNumber + 1) + "]" + "教室[" + i.location + "]" + "任课教师[" + i.teacherName + "]" + "\n"
            console.log("周[" + i.dayOfWeek + "]" + "课程[" + i.name + "]" + "节次[" + i.beginNumber + "-" + (i.beginNumber + 1) + "]" + "教室[" + i.location + "]" + "任课教师[" + i.teacherName + "]")
        })
        await   sendMessage.SendMessage(types, str1, id)
        console.log(4444)
        return
    }
    try{
        const {data: res} = await axios({
            method: "get",
            url: "https://kb.chaoxing.com/pc/curriculum/getMyLessons",
            params: {
                week: week
            },
            withCredentials: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                Cookie: cookie
            },
        })
        console.log(res.data)
        writeFileSync("chet.json", JSON.stringify(res.data.lessonArray))
        let  k = res.data.lessonArray.sort((a, b) => {
            return a.dayOfWeek - b.dayOfWeek
        })
        // console.log(k)
        k.forEach(i => {
            str += "周[" + i.dayOfWeek + "]" + "课程[" + i.name + "]" + "节次[" + i.beginNumber + "-" + (i.beginNumber + 1) + "]" + "教室[" + i.location + "]" + "任课教师[" + i.teacherName + "]" + "\n"
            // console.log(str += "周[" + i.dayOfWeek + "]" + "课程[" + i.name + "]" + "节次[" + i.beginNumber + "-" + (i.beginNumber + 1) + "]" + "教室[" + i.location + "]" + "任课教师[" + i.teacherName + "]" + "\n")
        })
        console.log(str)
        await sendMessage.SendMessage(types, str, id)
        config.obj.week=week
    }catch (e) {
        await   sendMessage.SendMessage(types,"输入有误",id)
    }
}









const axios = require("axios")
const {writeFileSync, readFileSync} = require("fs");
const sendMessage = require("./send")
const config = require("./config")
let cookie = []
let str = "", str1 = ""

//获取cookie
async function getCookie() {
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
    }
    console.log(cookie)
     getclass(cookie)


}
async function getclass(cookie) {

    try {
        const {data: res} = await axios({
            method: "get",
            url: "https://kb.chaoxing.com/pc/curriculum/getMyLessons",
            params: {
                week:2
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
        k = res.data.lessonArray.sort((a, b) => {
            return a.dayOfWeek - b.dayOfWeek
        })
        // console.log(k)
        k.forEach(i => {
            str += "周[" + i.dayOfWeek + "]" + "课程[" + i.name + "]" + "节次[" + i.beginNumber + "-" + (i.beginNumber + 1) + "]" + "教室[" + i.location + "]" + "任课教师[" + i.teacherName + "]" + "\n"
            // console.log(str += "周[" + i.dayOfWeek + "]" + "课程[" + i.name + "]" + "节次[" + i.beginNumber + "-" + (i.beginNumber + 1) + "]" + "教室[" + i.location + "]" + "任课教师[" + i.teacherName + "]" + "\n")
        })
        console.log(str)

    } catch (e) {
    }
}




getCookie()




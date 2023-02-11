const axios = require("axios")
const {writeFileSync, readFileSync} = require("fs");
const sendMessage=require("./send")
let cookie = []
let str=""

exports.getCookie=async (types,week,id)=> {

    const res = await axios({
        method: "get",
        url: "https://passport2.chaoxing.com/api/login",
        params: {
            name: 13277626850,
            pwd: "lei125608"
        },
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
            'Accept-Language': ' zh-CN,zh;q=0.9',
            'Accept-Encoding': ' gzip, deflate',
            'X-Requested-With': 'XMLHttpRequest',


        }
    })

    if(res.status===200){
        for (let i of res.headers["set-cookie"]) {
            cookie.push(i.slice(0, i.indexOf(";")))
        }
    }
    console.log(cookie)
    getclass(cookie,types,id,week)

}



async function getclass(cookie,types,id,week){
    if(typeof week!=="number"){
        sendMessage.SendMessage(types,"week只能为数字",id)
        return
    }

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
        writeFileSync("chet.json",JSON.stringify(res.data.lessonArray))

        // console.log(res.data.lessonArray)
     k=res.data.lessonArray.sort((a,b)=>{
        return a.dayOfWeek-b.dayOfWeek
    })
    console.log(k)
    k.forEach(i=>{
        str="周【"+i.dayOfWeek+"】"+"教室"+"【"+i.location+"】"+"课程 "+"【"+i.name+"】"+"节次"+"【"+i.beginNumber+"-"+(i.beginNumber+1)+"】" +"任课教师"+"【"+i.teacherName+"】"
        console.log("周【"+i.dayOfWeek+"】"+"教室"+"【"+i.location+"】"+"课程 "+"【"+i.name+"】"+"节次"+"【"+i.beginNumber+"-"+(i.beginNumber+1)+"】" +"任课教师"+"【"+i.teacherName+"】")
    })
    sendMessage.SendMessage(types,str,id)
}





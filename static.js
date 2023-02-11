// const express = require("express")
// const path = require("path");
// const sendmessage = require("./send");
// const app = express()
// const axios=require("axios")
// const {writeFileSync,readFileSync} = require("fs")
//
// app.use("/img", express.static(path.join(__dirname, "/")));
//
// function get(){
//       //  let j=JSON.parse(readFileSync("chet.json"))
//       //  console.log(j)
//       // if(j==="undefined:1"){
//       //     console.log(j.data.kckbData)
//       //    let m=j.data.kckbData.sort((a,b)=>{
//       //         return a.rqxl-b.rqxl
//       //     })
//       //     m.forEach(i=>{
//       //         return console.log("节次:"+i.rqxl +","+"课程:"+i.kcmc+","+"教室:"+i.croommc+","+"授课老师:"+i.tmc+","+"类型:"+i.kcxz+"\n")
//       //     })
//       //     return
//       // }
//             axios({
//                 method:"get",
//                 url:"https://kb.chaoxing.com/pc/curriculum/getMyLessons",
//                 params:{
//                     week:2
//                 },
//                 withCredentials:true,
//                 headers: {
//                     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
//                     'Accept-Language': 'zh-CN,zh;q=0.9',
//                     Cookie: [ 'JSESSIONID=9D041D5DFBBD3CFD1E8BB1DC47236DB1',
//                     'lv=0',
//                     'fid=170118',
//                     '_uid=192200441',
//                     'uf=b2d2c93beefa90dc7cbcaf879eb42210924d42fe10f75a07fe3ef8b32cb9cfef2de8e0d48059ada5789df8555648ecd3edc54714a477d0eb17a3131c5323ef268f160e7a6d7807818b3e6e5f395dd356f54d1284ac97289d7890927d73926b77efec3fcaf9418bc4e7fafd565af53bf2',
//                     '_d=1676115446701',
//                     'UID=192200441',
//                     'vc=523DD3A9EBA73416507D8B03904E7D25',
//                     'vc2=FD8E8DFCA956858D577E86848FC5C414',
//                     'vc3=aI%2B%2BjfG5eQMmjYUSa9XL626B5wJc6iR2byQA1gH2SU0YCvMHiQg6Y6rRMt555mOAbqydmB1YKUpcCVm7t8gzk3QAZgyi%2BeNGcMoZcbLtEQ0nx9gE0WkwbdjS7ljuUo1wtOmV5SkOxLhI5irJcR3WkIwrQw0ndnJREMLJLpt4%2BRg%3D847a9aa1096462e978624f20f3d6b131',
//                     'xxtenc=d747f840d58a945c403a6cd2f338055d',
//                     'DSSTASH_LOG=C_38-UN_2181-US_192200441-T_1676115446703',
//                     'route=2751c02f853f6479988f0b3d8a5cb9ce']
//
//                 },
//             }).then(req=>{
//                 console.log(req.data)
//                 writeFileSync("chet.json",JSON.stringify(req.data))
//                 j=readFileSync("chet.json")
//                 j=j.data.kckbData.sort((a,b)=>{
//                     return a.rqxl-b.rqxl
//                 })
//                 j.forEach(i=>{
//                     return console.log("节次:"+i.rqxl +","+"课程:"+i.kcmc+","+"教室:"+i.croommc+","+"授课老师:"+i.tmc+","+"类型:"+i.kcxz+"\n")
//                 })
//
//             })
//
//
//
// }
//
// get()
//
// console.log(path.join(__dirname, "/"))
// app.listen(3000, (req, reqs) => {
//     console.log("服务器打开")
// })



let num=11
console.log(typeof num==="number")
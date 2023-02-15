
const axios=require("axios")




async function chat(){
  const {data:res}=await axios({
        method:"get",
        url:"https://zj.v.api.aa1.cn/api/video_dyv2",


    })
    console.log(res.url)

}
chat()



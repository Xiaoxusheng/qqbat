const  axios=require("axios")
const {json} = require("express");



async function chat(){
  const {data:res}=await axios({
        method:"get",
        url:"http://tx.beijing.v.api.aa1.cn/tiktok?aweme_id=7188370071226551589&raw=true",


    })
    console.log(res)

}
chat()
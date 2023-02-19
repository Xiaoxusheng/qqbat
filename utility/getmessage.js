const Sendmessage=require("../send")
//此函数是根据message_id获取消息，相互用于撤回消息查询
const axios = require("axios");
exports.getmessage=async (types,message_id,id)=>{
  try {
      const res= axios({
          url:"http://127.0.0.1:5000/get_msg",
          method:"get",
          params:{
              message_id
          }
      })
      console.log(res.data.data.message)
      return res.data.data.message
  }catch (e){
          await Sendmessage.SendMessage(types,"获取撤回消息出错了:"+e,id)
          return null
  }

}

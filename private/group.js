const SendMessage=require("../send")
const axios=require("axios")
const getVideo =require("../app")
//处理群消息逻辑函数
exports.groupsreceive=(data)=>{

   console.log(data.message)
    console.log(data.sender.nickname==="Ra" )
    if(data.sender.nickname==="Ra"){
        // console.log(data.message.includes("[CQ:at,qq=3096407768] "))注意这里的]后面有一个空格,不然会出问题
        if(data.message.includes("[CQ:at,qq=3096407768] ")){
           SendMessage.SendMessage(data.message_type,"[CQ:at,qq="+data.sender.user_id+"]",data.group_id,)
            SendMessage.SendMessage(data.message_type,"伟大的主人，我来了[CQ:face,id=123]，有什么吩咐",data.group_id)
        }
       if(data.message.includes("禁言")){
           let QQid=  data.message.slice(data.message.indexOf("=")+1,data.message.indexOf("]"))
           console.log(QQid)
           let time=60*(data.message.slice(data.message.indexOf("]"),data.message.indexOf("分")))
           gag(data.group_id,QQid,time)
           return
       }
       if(data.message.includes("视频")){
           getVideo.getVideo(data.message_type, data.group_id)

       }

    }else {
      SendMessage(data.message_type,"正在更新功能",data.group_id)
    }





}


/*
* {"post_type":"message","message_type":"group","time":1676375983,"self_id":2673893724,
* "sub_type":"normal","anonymous":null,"group_id":682671449,"message":"123456","message_seq":824,
* "raw_message":"123456","message_id":1996732370,"font":0,
* "sender":{"age":0,"area":"","card":"","level":"","nickname":"Ra","role":"member","sex":"unknown","title":"","user_id":3096407768},"user_id":3096407768}*/

//禁言处理
async function gag(group_id, user_id, duration){
  try {
      if(duration<0){
          await send.SendMessage("group", "设置禁言的时间不能小于0", group_id,)
          return
      }
      //duration禁言时长, 单位秒, 0 表示取消禁言
      const {data:res}=await axios({
          url:"http://127.0.0.1:5000/set_group_ban",
          method:"post",
          data:{
              user_id,
              group_id,
              duration,
          }

      })
      send.SendMessage("group","设置禁言成功",group_id,)
  }catch (e) {
      if(e){
          send.SendMessage("group","设置失败",group_id,)
      }
  }

}




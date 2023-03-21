const axios=require("axios")

//{"post_type":"request","request_type":"friend","time":1679385946,"self_id":2673893724,"user_id":1978150028,"comment":"12","flag":"1679385946000000"}
//{"post_type":"request","request_type":"friend","time":1679386108,"self_id":2673893724,"user_id":1978150028,"comment":"信息","flag":"1679386108000000"}
exports.addfriends =async ({flag,comment})=>{
    console.log("commit:",comment)
     const  {data:res}= await axios({
            method:"post",
            url:"http://127.0.0.1:5000/set_friend_add_request",
            data:{
                flag:flag,
                approve:true,
            }
        })
        console.log(res)

}
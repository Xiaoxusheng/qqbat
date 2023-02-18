const axios = require("axios");
const fs = require("fs");
const e = require("express");

async function get(){
   const res= await axios({
        method:"get",
        url:"http://www.lpv4.cn:10000/api/60s"
    })
     console.log(res)
    if(res){
        fs.writeFile("",res.data,(err => {
            if (err) {
                console.log(err)
            }

        }))
    }
}
get()
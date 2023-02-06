const express = require("express")
const path = require("path");
const sendmessage = require("./send");
const app = express()


app.use("/img", express.static(path.join(__dirname, "/")));
str="1234567"
console.log(str.length)
let i=1
let time = new Date()
console.log(21===time.getHours()&&10===time.getMinutes())
if(21===time.getHours()&&10===time.getMinutes()){
    i++
    if(i>=2){
        console.log(111)
    }
}



console.log(path.join(__dirname, "/"))
app.listen(3000, (req, reqs) => {
    console.log("服务器打开")
})
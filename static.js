const express = require("express")
const path = require("path");
const app = express()


app.use("/img", express.static(path.join(__dirname, "/")));
str="12,34,lll,d"
console.log(str)

console.log(path.join(__dirname, "/"))
app.listen(3000, (req, reqs) => {
    console.log("服务器打开")
})
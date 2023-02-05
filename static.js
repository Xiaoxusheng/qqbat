const express = require("express")
const path = require("path");
const app = express()


app.use("/img", express.static(path.join(__dirname, "/")));
str="1234567"
console.log(str.length)

console.log(path.join(__dirname, "/"))
app.listen(3000, (req, reqs) => {
    console.log("服务器打开")
})
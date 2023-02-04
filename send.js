//发送qq消息
const axios = require("axios");
exports.SendMessage = async (types, weather, id) => {
    if (types === "private") {
        console.log(weather)
        const {data: res} = await axios({
            method: "post",
            url: "http://127.0.0.1:5000/send_private_msg",
            data: {
                user_id: id,
                message: weather,
                auto_escape: false,

            }

        })
        console.log(res)
    } else {
        console.log(weather)
        const {data: res} = await axios({
            method: "post",
            url: "http://127.0.0.1:5000/send_group_msg",
            data: {
                group_id: id,
                message: weather,
                auto_escape: false,

            }

        })
        console.log(res)
    }

}
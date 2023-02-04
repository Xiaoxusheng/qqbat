const axios = require("axios")
exports.read = async (message_id) => {
    const {data: res} = await axios({
        method: "post",
        url: "http://127.0.0.1:5000/mark_msg_as_read",
        data: {
            message_id: message_id
        },

    })
    console.log(res)
}
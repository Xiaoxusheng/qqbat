const {Configuration, OpenAIApi} = require("openai");
const {readFile, readFileSync} = require("fs");
const SendMessage = require("../Websocket/send")
const getmessage = require("../utility/getmessage")
const axios = require("axios");
const fs = require("fs");
const token = JSON.parse(
    readFileSync("./appkey.json")
)
const configuration = new Configuration({
    apiKey: token.apikey,
});
const openai = new OpenAIApi(configuration);
//{"post_type":"message","message_type":"private","time":1676870513,"self_id":2673893724,"sub_type":"friend","target_id":2673893724,"message":"，23","raw_message":"，23","
// font":0,"sender":{"age":0,"nickname":"Ra","sex":"unknown","user_id":3096407768},"message_id":-1073489619,"user_id":3096407768}
exports.chatgpt = async (types, id, message_id, propmt) => {
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            temperature: 0.5,
            max_tokens: 500,
            prompt: propmt,
        });
        console.log(completion.data.choices[0]);
        let resopone = completion.data.choices[0].text.replace("/\n\t\\\\b/g", "")
        // console.log(resopone)
        // 回复消息
        if (types === "private") {
            await SendMessage.SendMessage(types, resopone, id,)
            return
        }
        await SendMessage.SendMessage(types, `[CQ:reply,id=${message_id}]${resopone}`, id,)
        //
    } catch (e) {
        if (e) {
            await SendMessage.SendMessage(types, "chatgpt机器人出错了", id,)
        }
    }


}

//  prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: 写一首诗\n\n花开时百色缤纷 春的温度醉我心\n无尽的想象伴随翱翔 尽牵动我晨夕思\n红叶落下无久别 尘世曲与尚未完\n而你何品芳华流离尽 天上月影跟随我心",
async function img(types, id, propmt) {
    try {
        let data = JSON.parse(readFileSync("chatgpt.txt"))

        const response = await openai.createImage({
            prompt: data + "Human:" + propmt + "\n",
            n: 1,
            size: "1024x1024",
        });
        image_url = response.data.data[0].url;
        // console.log(image_url)
        fs.writeFileSync("chatgpt.txt", "Human:" + propmt + "\n" + image_url)
        await SendMessage.SendMessage(types, image_url, id)

    } catch (e) {
        if (e) {
            await SendMessage.SendMessage(types, "图片出错了", id)
        }
    }

}

img()
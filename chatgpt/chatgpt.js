const {Configuration, OpenAIApi} = require("openai");
const {readFileSync, writeFileSync} = require("fs");
const SendMessage = require("../Websocket/send")
const fs = require("fs");
const token = JSON.parse(
    readFileSync("../appkey.json")
)
const configuration = new Configuration({
    apiKey: token.apikey,
});
const openai = new OpenAIApi(configuration);
//{"post_type":"message","message_type":"private","time":1676870513,"self_id":2673893724,"sub_type":"friend","target_id":2673893724,"message":"，23","raw_message":"，23","
// font":0,"sender":{"age":0,"nickname":"Ra","sex":"unknown","user_id":3096407768},"message_id":-1073489619,"user_id":3096407768}
exports.chatgpt = async (types, id, message_id, propmt) => {
    try {
        let data = JSON.parse(readFileSync("chatgpt.json"))
        data.push({role: "user", content: `${propmt}`})
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: data,
            temperature: 0.0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            // stop: [" Human:", " AI:"],
            // prompt: data + "Human:" + propmt,
        });
        console.log(completion.data.choices[0].message);
        let resopone = completion.data.choices[0].message.content.replace("/\n\t\\\\b/g", "")
        resUser = [{role: "user", content: `${propmt}`}].push(completion.data.choices[0].message)
        writeFileSync("chatgpt.json", JSON.stringify(resUser))
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
            await await SendMessage.SendMessage(types, `chatgpt机器人出错了,错误在:${e}`, id,)
        }
    }


}

//  prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: 写一首诗\n\n花开时百色缤纷 春的温度醉我心\n无尽的想象伴随翱翔 尽牵动我晨夕思\n红叶落下无久别 尘世曲与尚未完\n而你何品芳华流离尽 天上月影跟随我心",
exports.getimg = async (types, id, propmt) => {
    try {
        propmt = propmt.slice(propmt.indexOf("图"), propmt.length - 1)
        const resonse = await openai.createImage({
            prompt: propmt,
            n: 1,
            size: "512x512",
        });
        image_url = response.data.data[0].url;
        // console.log(image_url)
        // fs.writeFileSync("chatgpt.json", "Human:" + propmt + "\n" + image_url)
        await SendMessage.SendMessage(types, `[CQ:image,file=${image_url}]`, id)

    } catch (e) {
        if (e) {
            await SendMessage.SendMessage(types, `图片出错了${e}`, id)
        }
    }

}

exports.moderations = async (types, input, id) => {
    const response = await openai.createModeration({
        input,
    });
    let iS = false
    // console.log(response.data.results[0] )
    for (let i in response.data.results[0].categories) {
        console.log(response.data.results[0].categories[i])
        console.log(i)
        if (response.data.results[0].categories[i]) {
            await SendMessage.SendMessage(types, "存在敏感词", id)
            iS = true
            break
        }

    }
    for (let i in response.data.results[0].category_scores) {
        if (response.data.results[0].category_scores[i] > 0.8 || parseInt(response.data.results[0].category_scores[i])) {

            await SendMessage.SendMessage(types, "存在违规词语", id)
            // console.log("存在违规词语")
            iS = true
            break
        }
    }
    if (iS) {
        return ""
    }
}


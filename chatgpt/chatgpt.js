const { Configuration, OpenAIApi } = require("openai");
const {readFile, readFileSync} = require("fs");
const SendMessage=require("../send")
const axios = require("axios");
const token=JSON.parse(
    readFileSync("../appkey.json")
)
const configuration = new Configuration({
    apiKey:token.apikey,
});
const openai = new OpenAIApi(configuration);
exports.chatgpt=async(types,id,propmt)=>{
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-001",
            temperature: 0.5,
            max_tokens:500,
            prompt: propmt,
        });
        console.log(completion.data.choices[0]);
        let resopone=completion.data.choices[0].text.replace("/\n\t\\\\b/g","")
        console.log(resopone)
    }catch (e) {
        if(e){
        await    SendMessage.SendMessage(types,id,"chatgpt机器人出错了")
        }
    }
       await SendMessage.SendMessage(types,resopone,id,)

}

async function img(types,id,propmt){
  try{
      const response = await openai.createImage({
          prompt: propmt,
          n: 1,
          size: "1024x1024",
      });
      image_url = response.data.data[0].url;
      // console.log(image_url)
      await SendMessage.SendMessage(types,image_url,id)

  }catch (e) {
   if(e){
       await SendMessage.SendMessage(types,"图片出错了",id)
   }
  }

}

img()
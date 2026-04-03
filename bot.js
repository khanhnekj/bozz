require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

bot.on("ready", () => {
  console.log(`🤖 Bot login: ${bot.user.tag}`);
});

bot.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  const args = msg.content.split(" ");

  // 💰 nạp tiền test
  if (args[0] === "!add") {
    const amount = parseInt(args[1]);
    if (!amount) return msg.reply("❌ !add 100");

    try {
      const res = await axios.post("https://api-buff.onrender.com/addmoney", {
        user_id: msg.author.id,
        amount
      });

      msg.reply(`💰 Balance: ${res.data.balance}`);
    } catch (e) {
      msg.reply("⚠️ Lỗi API");
    }
  }

  // 🚀 buff
  if (args[0] === "!buff") {
    const link = args[1];
    const amount = parseInt(args[2]);

    if (!link || !amount) {
      return msg.reply("❌ !buff link amount");
    }

    try {
      const res = await axios.post("https://api-buff.onrender.com/buff", {
        user_id: msg.author.id,
        link,
        amount
      }, {
        headers: {
          "x-api-key": process.env.API_KEY
        }
      });

      msg.reply(`📦 ${JSON.stringify(res.data)}`);
    } catch (e) {
      msg.reply("⚠️ Lỗi buff");
    }
  }

  // 📊 check
  if (args[0] === "!check") {
    const id = args[1];
    if (!id) return msg.reply("❌ !check order_id");

    try {
      const res = await axios.post("https://api-buff.onrender.com/status", {
        order_id: id
      }, {
        headers: {
          "x-api-key": process.env.API_KEY
        }
      });

      msg.reply(`📊 ${JSON.stringify(res.data)}`);
    } catch {
      msg.reply("⚠️ lỗi check");
    }
  }
});

bot.login(process.env.DISCORD_TOKEN);

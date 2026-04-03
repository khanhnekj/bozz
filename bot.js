require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const API_URL = "https://tik-api.onrender.com";

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🚫 cooldown user
const cooldown = {};

bot.on("ready", () => {
  console.log(`🤖 ${bot.user.tag}`);
});

bot.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  const now = Date.now();
  if (cooldown[msg.author.id] && now - cooldown[msg.author.id] < 5000) {
    return msg.reply("⏳ chậm lại (5s)");
  }
  cooldown[msg.author.id] = now;

  const args = msg.content.split(" ");

  // buff
  if (args[0] === "!buff") {
    const link = args[1];
    const amount = args[2];

    try {
      const res = await axios.post(`${API_URL}/buff`, {
        link,
        amount
      }, {
        headers: {
          "x-api-key": process.env.API_KEY
        }
      });

      msg.reply(`📦 ${JSON.stringify(res.data)}`);
    } catch {
      msg.reply("⚠️ lỗi buff");
    }
  }

  // check
  if (args[0] === "!check") {
    const id = args[1];

    try {
      const res = await axios.post(`${API_URL}/status`, {
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

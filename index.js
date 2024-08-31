require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const telegram_bot = new TelegramBot(process.env.KEY_BOT, { polling: true });
telegram_bot.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text == "/start") {
      await telegram_bot.sendMessage(chatId, "Log In", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Come to our store",
                web_app: { url: process.env.WEB_URL },
              },
            ],
          ],
        },
      });
      await telegram_bot.sendMessage(chatId, "Log In to our store", {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Come to our store now",
                web_app: { url: process.env.WEB_URL },
              },
            ],
          ],
        },
      });
    }
  } catch (error) {
    console.log(err);
  }
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const TelegramBot = require("node-telegram-bot-api");
const telegram_bot = new TelegramBot(process.env.KEY_BOT, { polling: true });
const url = process.env.WEB_URL;

telegram_bot.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text == "/start") {
      await telegram_bot.sendMessage(chatId, "Log In to our store", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Come to our store",
                web_app: { url },
              },
            ],
          ],
        },
      });
      await telegram_bot.sendMessage(
        chatId,
        "Button will appear below, fill out the form",
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Fill out the form",
                  web_app: { url: url + "form" },
                },
              ],
            ],
          },
        }
      );
    }
    if (msg?.web_app_data?.data) {
      const data = JSON.parse(msg?.web_app_data?.data);
      await telegram_bot.sendMessage(chatId, "Thank you, to you are with as");
      await new Promise((res) => {
        setTimeout(res, 1000);
      });

      await telegram_bot.sendMessage(chatId, `Your city is: ${data.city}`);
      await new Promise((res) => {
        setTimeout(res, 1000);
      });

      await telegram_bot.sendMessage(chatId, `Your street is: ${data.street}`);
    }
  } catch (error) {
    console.log(err);
  }
});

app.post("/web-app", async (req, res) => {
  try {
    const { products, queryId, totalPrice } = await req.body();
    console.log(products, queryId, totalPrice);

    await telegram_bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Success",
      input_message_content: {
        message_text: `Thank to buy products for ${totalPrice} dollars`,
      },
    });
    res.status(200).json({});
  } catch (error) {
    await telegram_bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Unsuccess",
      input_message_content: {
        message_text: `Sorry, please try again`,
      },
    });
    res.status(500).json({});
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log("server started on " + PORT + " port"));

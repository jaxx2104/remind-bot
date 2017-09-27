const Botkit = require("botkit");
const CronJob = require("cron").CronJob;
const client = require("./src/client");
const { devChannel } = require("./config");

const controller = Botkit.slackbot({
  debug: false
});

const bot = controller
  .spawn({
    token: process.env.TOKEN
  })
  .startRTM();

controller.hears(
  "ほげ(.+)$",
  "mention,direct_mention,direct_message",
  (bot, msg) => {
    console.log("1", msg.match[1], msg.channel);
    bot.say({ text: msg.match[1], channel: msg.channel });
  }
);

controller.hears(
  "腹筋(.*?)$",
  "ambient,mention,direct_mention,direct_message",
  (bot, msg) => {
    console.log("2", msg.match[1], msg.channel);
    bot.startConversation(msg, (err, convo) => {
      convo.ask("何回した？", [
        {
          pattern: bot.utterances.yes,
          callback: (response, convo) => {
            bot.api.reactions.add({
              timestamp: response.ts,
              channel: response.channel,
              name: "+1"
            });
            convo.next();
          }
        },
        {
          pattern: bot.utterances.no,
          callback: (response, convo) => {
            bot.api.reactions.add({
              timestamp: response.ts,
              channel: response.channel,
              name: "-1"
            });
            convo.next();
          }
        }
      ]);
    });
  }
);

let ts = null;

bot.say(
  {
    channel: devChannel,
    text: `腹筋した？ ${client.countAct()}`
  },
  (err, response) => {
    ts = response.ts;
  }
);

new CronJob({
  cronTime: "* * * * *",
  onTick: () => {
    // アクション数の追加
    client.addAct();
    // アクション数を投稿
    bot.say(
      {
        channel: devChannel,
        text: `腹筋した？ ${client.countAct()}`
      },
      (err, response) => {
        ts = response.ts;
      }
    );
  },
  start: true,
  timeZone: "Asia/Tokyo"
});

new CronJob({
  cronTime: "* * * * *",
  onTick: () => {
    bot.api.reactions.get(
      {
        timestamp: ts,
        channel: devChannel
      },
      (err, response) => {
        if (response.message.reactions) {
          bot.api.reactions.add({
            timestamp: response.ts,
            channel: response.channel,
            name: "heart_eyes"
          });
        } else {
          bot.say(
            {
              channel: devChannel,
              text: `腹筋した？ ${client.countAct()}`
            },
            (err, response) => {
              ts = response.ts;
            }
          );
        }
      }
    );
  },
  start: true,
  timeZone: "Asia/Tokyo"
});

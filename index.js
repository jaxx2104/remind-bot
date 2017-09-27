const Botkit = require('botkit')
const CronJob = require('cron').CronJob
const client = require('./src/client')
const { id, time } = require('./config')

const controller = Botkit.slackbot({
  debug: false,
})

const bot = controller
  .spawn({
    token: process.env.TOKEN,
  })
  .startRTM()

// 質問したtimestamp
let timestamp = null

// 質問
const askAct = () => {
  // アクション数の追加
  client.addAct()
  // アクション数を投稿
  bot.say(
    {
      channel: id.channel,
      text: `${client.countAct()} しましょう！`,
    },
    (err, response) => {
      timestamp = response.ts
    }
  )
}

const countAct = reactions => {
  let count = 0
  reactions.forEach(reaction => {
    if (reaction.users.indexOf(id.bot) >= 0) {
      count++
    }
  })
  return count
}

const checkAct = () => {
  bot.api.reactions.get(
    {
      timestamp: timestamp,
      channel: id.channel,
    },
    (err, response) => {
      const { channel, message, ts } = response

      // 未対応の場合
      if (message && message.reactions) {
        // ボットが対応していたら不要
        const count = countAct(message.reactions)
        // アクション数の追加
        client.reduceAct(count)

        bot.api.reactions.add({
          timestamp: timestamp,
          channel: channel,
          name: 'heart_eyes',
        })
      } else {
        bot.say(
          {
            channel: id.channel,
            text: `運動をしてフレッシュな一日を過ごしましょう！`,
          },
          () => {
            timestamp = ts
          }
        )
      }
    }
  )
}

new CronJob({
  cronTime: time.ask,
  onTick: askAct,
  start: true,
  timeZone: 'Asia/Tokyo',
})

new CronJob({
  cronTime: time.check,
  onTick: checkAct,
  start: true,
  timeZone: 'Asia/Tokyo',
})

const file = require('../src/file')
const { path } = require('../config')

/**
 * ボットのクラス
 *
 * @class Bot
 */
class Client {
  constructor(test) {
    this.test = test
  }

  addAct() {
    const data = file.read(path.data)
    const task = file.read(path.task)
    // データにタスク分を追加
    for (const key in task) {
      data[key] += task[key]
    }
    file.write(path.data, data)
  }

  reduceAct(count = 1) {
    const data = file.read(path.data)
    const task = file.read(path.task)
    // データにタスク分を追加
    for (const key in task) {
      data[key] -= task[key] * count
    }
    file.write(path.data, data)
  }

  countAct() {
    const data = file.read(path.data)
    // カウントをテキストに変換
    let count = ''
    for (const key in data) {
      count += `${key} ${data[key]}回`
    }
    return count
  }
}
module.exports = new Client()

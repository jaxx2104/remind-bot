const fs = require('fs')

/**
 * ファイルのクラス
 * @class File
 */
class File {
  /**
   * ファイルの読み込み
   * @param {object} fileName
   * @returns
   */
  read(fileName) {
    return JSON.parse(fs.readFileSync(fileName, 'utf8'))
  }

  /**
   * ファイルの書き込み
   * @param {string} fileName
   * @param {object} data
   * @returns
   */
  write(fileName, data) {
    return fs.writeFileSync(fileName, JSON.stringify(data))
  }
}
module.exports = new File()

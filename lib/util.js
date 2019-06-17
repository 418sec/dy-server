const fs = require('fs');
const cheerio = require('cheerio');

module.exports = {
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (e, data) => {
        if (e) {
          reject(e)
        } else {
          resolve(data)
        }
      })
    })
  },
  readdir(path) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (e, data) => {
        if (e) {
          reject(e)
        } else {
          const excludeArr = [
            '$Recycle.Bin',
            'Documents and Settings',
            'MSOCache',
            '$RECYCLE.BIN',
            'pagefile.sys',
            'PerfLogs',
            'Recovery',
            'swapfile.sys',
            'System Volume Information',
            'hiberfil.sys',
            'Config.Msi',
          ];
          excludeArr.forEach(item => {
            const index = data.indexOf(item)
            index !== -1 && data.splice(index, 1)
          })
          data.sort((str1, str2) => {
            for (const i in str1) {
              if (str2[i]) {
                return str1[i].toLowerCase().charCodeAt() > str2[i].toLowerCase().charCodeAt();
              } else {
                return true
              }
            }

          });
          resolve(data)
        }
      })
    })
  },
  jq(path) {
    return this.readFile(path).then(data => {
      return cheerio.load(data.toString())
    }).catch(e => {
      return e
    })
  },
  isFile(path) {
    return fs.statSync(path).isFile()
  },
  isDir(path) {
    return !this.isFile(path)
  }
};
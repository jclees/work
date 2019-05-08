let Util = require('./util')
let Setting = require('./setting')

class Common {
  constructor() {
      this.apiBaseUrl = Setting.apiUrl;
      this.setting = Setting
    }
    /**
     *  get
     */
  get(url, data) {
    return Util.request({
      url: this.apiBaseUrl + url,
      data: data
    })

  }
    /**
     * post
     */
  post(url, data) {
    return Util.request({
      url: this.apiBaseUrl + url,
      data: data,
      method: 'POST'
    })

  }

  getLocation() {
    return Util.doLocation()

  }

  setStorage(key, data) {
    return Util.setStorage({
      key: key,
      data: data
    })
  }


  getStorage(key) {
    return Util.getStorage({
      key: key
    })
  }


  print(key) {
      console.log(key);
    }

  /**
     * 继承
     * @param {[type]} context [description]
     * @param {[type]} props   [description]
     */
  extends(context, props) {
    for (let k in props) {
      context[k] = props[k]
    }
  }
    // 判断状态吗
  checkStatusCode(statusCode, callback) {
    let code = String(statusCode);
    try {
      if (code.length === 3) {
        if (code.charAt(0) == 2) {
          code = null;
          return true;
        } else {
          code = null;
          return false;
        }
      }
      throw code + " not normal status;"
    } catch (error) {
      callback && callback.apply(this, [code, error]);
    }
  }

}

module.exports = new Common
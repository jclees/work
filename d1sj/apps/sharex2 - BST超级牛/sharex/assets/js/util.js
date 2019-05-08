let Promise = require('../libs/promise').Promise;
class Util {
    request(options) {
        return new Promise((resolve, reject) => {
          wx.showLoading({
            title: '加载中',
          })
          options.success = function (res) {
            wx.hideLoading()            
            if (res.statusCode.toString()[0] != 2)
              reject(res)
            else
              resolve(res)
          }
            options.fail = function (err) {
                reject(err)
            }
            options.complete = function () {
                wx.hideNavigationBarLoading()
            }
            // // if (options.data.loading !== false)
            // wx.showNavigationBarLoading()
            wx.request(options)
        })
    }

    doLocation(options = {}) {
        return new Promise((resolve, reject) => {
            options.success = function (res) {
                resolve(res)
            }
            options.fail = function (err) {
                reject(err)
            }
            options.complete = function () {
                wx.hideNavigationBarLoading()
            }
            wx.showNavigationBarLoading()
            wx.getLocation(options)
        })
    }

    setStorage(options = {}) {
        return new Promise((resolve, reject) => {
            options.success = function (res) {
                resolve(res)
            }
            options.fail = function (err) {
                reject(err)
            }
            options.complete = function () {
                wx.hideNavigationBarLoading()
            }
            wx.showNavigationBarLoading()
            wx.setStorage(options)
        })
    }

    getStorage(options = {}) {
        return new Promise((resolve, reject) => {
            options.success = function (res) {
                resolve(res)
            }
            options.fail = function (err) {
                reject(err)
            }
            options.complete = function () {
                wx.hideNavigationBarLoading()
            }
            wx.showNavigationBarLoading()
            wx.getStorage(options)
        })
    }

    isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }

}

module.exports = new Util
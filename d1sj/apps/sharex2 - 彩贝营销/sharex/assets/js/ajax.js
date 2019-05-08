let Setting = require('./setting')
class Ajax{
  constructor(){
    this.apiBaseUrl = Setting.apiUrl
  }
  get(u,d,s,f){
    let obj = {}
    obj.u = u
    obj.d = d
    obj.s = s
    obj.f = f
    this.request(obj)
  }
  post(u, d, s, f) {
    let obj = {}
    obj.u = u
    obj.d = d
    obj.s = s
    obj.f = f
    obj.moth = 'POST'
    this.request(obj)
  }
  request(option){
    wx.request({
      url: this.apiBaseUrl + option.u,
      data: option.d,
      method: option.moth,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (typeof option.s == 'function') {
          option.s(res)
        }
      },
      fail(res) {
        if (typeof option.f == 'function') {
          option.f(res)
        }
      }
    })
  }
}
module.exports = new Ajax
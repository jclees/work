const app = getApp()
const common = require('../../assets/js/common');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img_url: app.data.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    that.getData()
  },
  getData() {
    let that = this
    // 获取充值金额列表
    that.getMonies()
    //个人信息
    that.getPerson()
  },
  getPerson() { //个人信息
    let that = this
    common.get('/index/memberInfo', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("个人信息")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          personData: res.data.data,
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/member/info 接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  getMonies() { //获取充值金额列表
    let that = this
    common.get('/index/monies', {}).then(res => {
      console.log(res)
      if (res.data.code == 100) {
        console.log("获取充值金额列表")
        that.setData({
          moniesData: res.data.data
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/getInfo 接口获取数据失败",
      })
      console.log(e)
    })
  },
  payment(e) { //支付
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    let id = e.currentTarget.dataset.id
    let money_id = e.currentTarget.dataset.moneyid
    let num = e.currentTarget.dataset.num
    let param = {}
    if (id == 1) { //会员充值
      param.member_id = that.data.member_id
      param.type = 1
      param.money_id = money_id
      param.bi_num = num
    } else if (id == 2) { //宝币充值
      param.member_id = that.data.member_id
      param.type = 1
      param.money_id = money_id
      param.bi_num = num
    }
    debugger
    common.post('/index/recharge', param).then(res => {
      console.log("支付")
      console.log(res)
      if (res.data.code == 100) {
        let data = res.data.data.payparams
        wx.hideLoading();
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function (res) {
            app.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000
            })
            that.getData()
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 1000
            })
            mask = true;
          }
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/recharge 接口获取数据失败",
      })
      console.log(e)
    })
  },
  requestPayment(res) {
    var that = this;
    if (res.data.code == 100) {
      var payInfo = res.data.data;
      wx.requestPayment({
        'timeStamp': payInfo.timeStamp,
        'nonceStr': payInfo.nonceStr,
        'package': payInfo.package,
        'signType': 'MD5',
        'paySign': payInfo.paySign,
        success: function(res) {

        },
        fail: function(res) {
          that.setData({
            life: false
          })
        }
      })
    }
  },
  popLock: function(event) {
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
})
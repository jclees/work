// pages/shop/pay/pay.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    remarks: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let order = wx.getStorageSync('order');
    this.setData({
      order,
      member_id: wx.getStorageSync('member_id')
    })
    // 获取取货时间
    this.getTime();
    //统计钱数和积分数
    this.changePrice();
  },
  //统计钱数和积分数
  changePrice(e) {
    var money = 0,
      score = 0,
      ids = [],
      data = this.data.order.data;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].list.length; j++) {
        money += data[i].list[j].num * data[i].list[j].price.money
        score += data[i].list[j].num * data[i].list[j].price.score
        ids.push(data[i].list[j].id)
      }
    }
    if (e) {
      if (!e.detail.value) {
        this.setData({
          is_daishou: 0
        })
        money += parseInt(this.data.order.postage)
      } else {
        this.setData({
          is_daishou: 1
        })
      }
    } else {
      if (parseInt(this.data.order.postage) != 0) {
        money += parseInt(this.data.order.postage)
      }
    }
    //更新数据
    this.setData({
      moneyTotal: money,
      scoreTotal: score,
      ids
    })
  },
  // 获取取货时间
  getTime() {
    common.get('/pickup', {
      shop_id: this.data.order.id
    }).then(res => {
      this.setData({
        timeList: res.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 输入备注
  remarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  // 选择地址
  chooseAdd() {
    let _this = this
    wx.chooseAddress({
      success: function(res) {
        _this.setData({
          address: res
        })
      },
      fail: function(res) {
        app.showToast("请选择收货地址", _this, 2000)
      }
    })
  },
  // 立即购买
  pay() {
    let _this = this
    if (_this.data.order.post != 0) {
      if (!_this.data.address) {
        app.showToast("请选择收货地址", _this, 2000)
        return
      }
    }
    let parm = {
      to_order_type: 2,
      member_id: this.data.member_id,
      ids: this.data.ids,
      phone: this.data.order.post == 1 ? this.data.address.telNumber : '',
      name: this.data.order.post == 1 ? this.data.address.userName : '',
      address: this.data.order.post == 1 ? this.data.address.cityName + '' + this.data.address.countyName + '' + this.data.address.detailInfo : '',
      remarks: this.data.remarks ? this.data.remarks : '',
      is_daishou: this.data.is_daishou
    }
    console.log(parm)
    common.post('/order', parm).then(res => {
      console.log("购买")
      console.log(res)
      let order_id = res.data.order_id
      if (res.data.code == 400) {
        app.showToast(res.data.msg, _this, 2000)
      } else if (res.data.code == 200) {
        wx.redirectTo({
          url: '../../../pages/shop/orderDetail/orderDetail?order_id=' + order_id
        })
      } else if (res.data.code == 100) {
        debugger
        let data = res.data.config
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function(res) {
            app.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000
            })
            wx.redirectTo({
              url: '../../../pages/shop/orderDetail/orderDetail?order_id=' + order_id
            })
          },
          'fail': function(res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
})
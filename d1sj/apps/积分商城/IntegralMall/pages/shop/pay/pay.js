// pages/shop/pay/pay.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    remarks:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order = wx.getStorageSync('order');
    this.setData({
      order,
      payMoney: Number(order.prices.content.money * order.num) + Number(order.postage),
      member_id: wx.getStorageSync('member_id')
    })
    // 获取取货时间
    this.getTime();
  },
  // 获取取货时间
  getTime(){
    common.get('/pickup',{
      shop_id: this.data.order.id
    }).then(res=>{
      this.setData({
        timeList:res.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 输入备注
  remarks(e){
    this.setData({
      remarks:e.detail.value
    })
  },
  // 选择地址
  chooseAdd(){
    let _this=this
    wx.chooseAddress({
      success: function (res) {
        _this.setData({
          address:res
        })
      },
      fail:function(res){
        app.showToast("请选择收货地址", _this,2000)
      }
    })
  },
  // 立即购买
  pay(){
    let _this=this
    if(_this.data.order.post!=0){
      if (!_this.data.address) {
        app.showToast("请选择收货地址", _this, 2000)
        return
      }
    }
    let parm = {
      to_order_type:1,
      member_id: this.data.member_id,
      product_id: this.data.order.id,
      num: this.data.order.num,
      spec: this.data.order.prices.title,
      name: this.data.order.post == 1 ? this.data.address.userName : '',
      phone: this.data.order.post == 1 ? this.data.address.telNumber : '',
      address: this.data.order.post == 1 ? this.data.address.cityName + '' + this.data.address.countyName + '' + this.data.address.detailInfo : '',
      remarks: this.data.remarks ? this.data.remarks : ''
    }
    console.log(parm)
    common.post('/order', parm).then(res => {
      console.log("购买")
      console.log(res)
      let order_id = res.data.order_id
      if (res.data.code == 400) {
        app.showToast(res.data.msg, _this, 2000)
      } else if (res.data.code == 200){
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
          'success': function (res) {
            app.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000
            })
            wx.redirectTo({
              url: '../../../pages/shop/orderDetail/orderDetail?order_id=' + order_id
            })
          },
          'fail': function (res) {
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


    // common.post('/order',{
    //   shop_id: this.data.order.id,
    //   member_id: this.data.member_id,
    //   type: this.data.order.post==0?2:1,
    //   state:this.data.order.post==0?1:2,
    //   money: this.data.order.num * this.data.order.prices.money,
    //   integral: this.data.order.num * this.data.order.prices.score,
    //   remarks: this.data.remarks ? this.data.remarks:'',
    //   address:this.data.order.post==0?this.data.address.cityName + '' + this.data.address.countyName + '' + this.data.address.detailInfo:'',
    //   phone:this.data.order.post==0?this.data.address.telNumber:'',
    //   specifications:this.data.order.specs[0].title+'、'+this.data.order.prices.name,
    //   name:this.data.order.post==0? this.data.address.userName:'',
    //   number:this.data.order.num,
    //   distribution_fee: this.data.order.postage,
    //   store_id: this.data.order.id
    // }).then(res=>{
    //   console.log("购买")
    //   console.log(res)
    //   if(res.data.code==400){
    //     app.showToast(res.data.msg, _this, 2000)
    //   }else if(res.data.err_code2==200){
    //     let order_id=res.data.order_id
    //     wx.requestPayment({
    //       'timeStamp': res.data.data.timeStamp,
    //       'nonceStr': res.data.data.nonceStr,
    //       'package': res.data.data.package,
    //       'signType': 'MD5',
    //       'paySign': res.data.data.paySign,
    //       'success': function (res) {
    //         wx.navigateTo({
    //           url: '../../../pages/shop/orderDetail/orderDetail?order_id=' + order_id
    //         })
    //       },
    //       // 'fail'(){
    //       //   wx.navigateTo({
    //       //     url: '../../../pages/shop/orderDetail/orderDetail?order_id=' + order_id
    //       //   })
    //       // }
    //     })
    //   }
    // }).catch(res=>{
    //   let reason = [];
    //   for (let i in res.data.errors) {
    //     reason.push(res.data.errors[i][0])
    //   }
    //   app.showToast(reason[0] || res.data.message, this, 2000)
    // })
  },
})
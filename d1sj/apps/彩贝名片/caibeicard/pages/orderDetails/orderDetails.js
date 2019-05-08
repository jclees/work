const app = getApp()
const common = require('../../assets/js/common');
Page({
  data: {
    img_url: app.data.imgUrl,
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      order_id: options.order_id
    })
  },
  onShow() {
    let that = this
    that.getData()
  },
  jumpMap() {
    app.turnToPage('/pages/map/map')
  },
  copyTBL(e) {
    app.copying(e)
  },
  calling(e) {
    app.calling(e)
  },
  backPage() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  seeAddress() {
    let that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res)
        wx.openLocation({
          latitude: that.data.latitude,
          longitude: that.data.longitude
        })
      }
    })
  },
  shareWxpyq() { //保存小区二维码
    let that = this
    wx.showLoading({
      title: '生成二维码中..',
    })
    // debugger
    wx.downloadFile({
      url: that.data.orderInfoData.qrcode,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
            console.log(res)
          },
          fail: function (res) {
            wx.hideLoading()
            if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("打开设置窗口");
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                    console.log("获取权限成功，再次点击图片保存到相册")
                  } else {
                    console.log("获取权限失败")
                  }
                }
              })
            }
          }
        })
      },
      fail: function () {
        console.log('fail')
        wx.showToast({
          title: '生成二维码接口失败',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  getData() { //初始化数据
    let that = this
    //订单详情
    that.getOrderInfo()
  },
  getOrderInfo() { //订单详情
    // debugger
    let that = this
    common.get('/index/orderInfo', {
      member_id: that.data.member_id,
      order_id: that.data.order_id
    }).then(res => {
      console.log("订单详情")
      console.log(res)
      if (res.data.code == 100) {
        app.globalData.location.latitude = Number(res.data.data.get_type.lat)
        app.globalData.location.longitude = Number(res.data.data.get_type.lng)
        that.setData({
          orderInfoData: res.data.data,
          latitude: Number(res.data.data.get_type.lat),
          longitude: Number(res.data.data.get_type.lng)
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/orderInfo 接口获取数据失败",
      })
      console.log(e)
    })
  },
  cancelOrder() { //取消订单
    let that = this
    debugger
    common.post('/index/cancelOrder', {
      member_id: that.data.member_id,
      order_id: that.data.order_id
    }).then(res => {
      console.log("取消订单")
      console.log(res)
      if (res.data.code == 100) {
        app.showToast({
          title: res.data.msg,
        })
        that.onShow()
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/cancelOrder 接口获取数据失败",
      })
      console.log(e)
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function(event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  }
})
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
      userInfo:app.globalData.userInfo,
      sellProductData: app.globalData.sellProductData,
      book_id: options.book_id
    })
    debugger
  },
  onShow() {
    let that = this
    that.getData()
  },
  getData() { //初始化数据
    let that = this
    //海报
    that.getPoster()
  },
  getPoster() { //海报
    let that = this
    debugger
    common.get('/index/getPoster', {
      member_id: that.data.member_id,
      book_id: that.data.book_id,
      type: 2
    }).then(res => {
      console.log("海报链接")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          posterUrl: res.data.data.qrcode
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/getPoster 接口获取数据失败",
      })
      console.log(e)
    })
  },
  backPage(e){
    let that = this
    let id = e.currentTarget.dataset.id
    if (id == 0) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
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
  },
  shareWxpyq() {
    let that = this
    wx.showLoading({
      title: '生成海报中..',
    })
    wx.downloadFile({
      url: that.data.posterUrl,
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
      }
    })
  },
  onShareAppMessage: function (res) { //分享
    let that = this
    that.setData({
      pop1: false
    })
    let path = '/pages/productDetails/productDetails?book_id=' + that.data.book_id + '&parent_id=' + that.data.member_id
    console.log("分享链接")
    console.log(path)
    if (res.from === 'button') {
      return {
        title: '只为成长，倡导不花钱',
        path: path,
        imageUrl: '',
        success: function (res) {
          // 转发成功
          console.log("转发成功")
          console.log(res)
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    return {
      title: '只为成长，倡导不花钱',
      path: path,
      imageUrl: '',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
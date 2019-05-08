const app = getApp()
const common = require('../../assets/js/common');
Page({
  data: {
    img_url: app.data.imgUrl
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
  },
  onShow() {
    let that = this
  },
  openIntro(e) {
    // debugger
    let id = e.currentTarget.dataset.id
    let that = this
    if(id == 0){
      if (that.data.showIntro == 0){
        that.setData({
          showIntro: 2
        })
      }else{
        that.setData({
          showIntro: 0
        })
      }
    } else if (id == 1){
      if (that.data.showIntro == 1) {
        that.setData({
          showIntro: 2
        })
      } else {
        that.setData({
          showIntro: 1
        })
      }
    }
  },
  bindInpChange(e) {
    let that = this
    that.setData({
      inputValue: e.detail.value
    })
  },
  scanCode(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    that.setData({
      codeStatus: id
    })
    if (id == 0) {
      wx.scanCode({
        success: (res) => {
          console.log("扫码二维码 成功");
          console.log(res);
          that.setData({
            bar_code: res.result
          })
          that.getBookInfo()
        },
        fail: (res) => {
          console.log("扫码二维码 失败");
          console.log(res);
        }
      })
    } else if (id == 1) {
      that.setData({
        bar_code: that.data.inputValue
      })
      that.getBookInfo()
    }
  },
  getBookInfo() {
    debugger
    let that = this
    let bar_code = that.data.bar_code
    common.get('/index/getBookInfo', {
      member_id: that.data.member_id,
      bar_code: bar_code
    }).then(res => {
      console.log("扫码")
      console.log(res)
      // that.setData({
      //   bar_code: "",
      //   inputValue:""
      // })
      if (res.data.code == 100) {
        if (res.data.data.status == 1) {
          app.globalData.sellProductData = res.data.data.info
          app.turnToPage('/pages/sellProduct/sellProduct?code=' + bar_code)
        } else {
          app.globalData.sellProductData = res.data.data.info
          that.setData({
            pop3: true,
            book_id: res.data.data.info.book_id
          })
        }
      } else {
        debugger
        that.setData({
          pop2: true,
          msg: res.data.msg
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/getBookInfo 接口获取数据失败",
      })
      console.log(e)
    })
  },
  confirmReceipt(e) { //确认收货
    let that = this
    debugger
    let id = that.data.codeStatus
    let bar_code
    if (id == 0) {
      bar_code = that.data.bar_code
    } else if (id == 1) {
      bar_code = that.data.inputValue
    }
    common.post('/index/endOrder', {
      member_id: that.data.member_id,
      bar_code: bar_code
    }).then(res => {
      console.log("确认收货")
      console.log(res)
      if (res.data.code == 100) {
        app.getFormId(that, e)//取formid
        that.setData({
          pop3: false
        })
        app.turnToPage('/pages/takeProductSuccess/takeProductSuccess?book_id=' + that.data.book_id)
        debugger
      } else {
        app.showToast({
          title: res.data.msg
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/endOrder 接口获取数据失败",
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
  },
  shareWxpyq() {
    wx.showLoading({
      title: '生成海报中..',
    })
    wx.downloadFile({
      url: imgUrl + 'test_03.png',
      success: function(res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
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
      fail: function() {
        console.log('fail')
      }
    })
  },
})
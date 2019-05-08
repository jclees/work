let styleflag = true
let app = getApp()
Page({
  data: {
    iconNight: 'icon_night'
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      skinStyle: wx.getStorageSync('skin'),
      scrollTop: wx.getStorageSync('scrollTop'),
      fontSize: wx.getStorageSync('fontSize') || 38,
      iconNight: wx.getStorageSync('iconNight') || "icon_night",
    })
    // wx.setNavigationBarTitle({
    //   title: "第二章：死亡游戏"
    // })
  },
  onShow: function() {

  },
  scroll: function(e) {
    wx.setStorageSync('scrollTop', e.detail.scrollTop)
  },
  changeChapter(e) { //上下章节
    console.log(e)
    let id = e.target.id
    let that = this
    if (id == 0) { //上一章

    } else if (id == 1) { //下一章

    }
    that.setData({})
  },
  changeFont(e) { //大小文字
    let id = e.target.id
    let that = this
    if (id == 0) { //小
      if (that.data.fontSize == 24) {
        return false
      }
      that.setData({
        fontSize: that.data.fontSize -= 2
      })
    } else if (id == 1) { //大
      if (that.data.fontSize == 56) {
        return false
      }
      that.setData({
        fontSize: that.data.fontSize += 2
      })
    }
    wx.setStorageSync('fontSize', that.data.fontSize)

  },
  changeNight() { //夜间模式
    let that = this
    that.setData({
      showSet: false
    })
    if (styleflag) { //夜间模式
      that.setData({
        iconNight: 'icon_day'
      })
      app.globalData.skin = "dark"
      styleflag = false
    } else { //白天模式
      that.setData({
        iconNight: 'icon_night'
      })
      app.globalData.skin = ""
      styleflag = true
    }
    console.log(app.globalData)
    //保存信息
    that.setData({
      skinStyle: app.globalData.skin
    })
    wx.setStorageSync('skin', app.globalData.skin)
    wx.setStorageSync('iconNight', that.data.iconNight)
  },
  openSet() {
    let that = this
    that.setData({
      showSet: true
    })
  },
  openSet(e) {
    let that = this
    that.setData({
      showSet: true
    })
  },
  closeSet(e) {
    let that = this
    that.setData({
      showSet: false
    })
  },
  openMl() {
    let that = this;
    that.setData({
      showMl: true
    })
  },
  closeMl() {
    let that = this;
    that.setData({
      showMl: false
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
})
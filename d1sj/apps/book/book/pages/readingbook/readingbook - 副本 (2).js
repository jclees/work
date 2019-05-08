// pages/readingbook/readingbook.js
let styleflag = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconNight: 'icon_night'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      scrollTop: wx.getStorageSync('scrollTop'),
      fontSize: wx.getStorageSync('fontSize') || 38,
      tone: wx.getStorageSync('tone') || "#f8f8f9",
      color: wx.getStorageSync('color') || "#000",
      iconNight: wx.getStorageSync('iconNight') || "icon_night",
    })
    // wx.setNavigationBarTitle({
    //   title: "第二章：死亡游戏"
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  scroll: function (e) {
    wx.setStorageSync('scrollTop', e.detail.scrollTop)
  },
  // scrollBottom:function(e){
  //   let that = this
  //   that.openSet()
  // },
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
      if (that.data.fontSize == 24){
        return false
      }
      that.setData({
        fontSize:that.data.fontSize -= 2
      })
    } else if (id == 1) { //大
      if (that.data.fontSize == 56) {
        return false
      }
      that.setData({
        fontSize:that.data.fontSize += 2
      })
    }
    wx.setStorageSync('fontSize', that.data.fontSize)
   
  },
  changeNight() {//夜间模式
    let that = this
    that.setData({
      showSet: false
    })
    if (styleflag){
      that.setData({
        tone: '#333',
        color: '#efefef',
        iconNight: 'icon_day'
      })
      styleflag = false
    }else{
      that.setData({
        tone: '#f8f8f9',
        color: '#000',
        iconNight: 'icon_night'
      })
      styleflag = true
    }
    wx.setStorageSync('tone', that.data.tone)
    wx.setStorageSync('color', that.data.color)
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
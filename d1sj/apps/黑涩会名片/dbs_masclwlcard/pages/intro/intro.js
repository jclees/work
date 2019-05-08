var app = getApp();
let member_id;
Page({
  data: {
  },
  onLoad: function (a) {
    member_id = wx.getStorageSync("member_id")
    this.getData()
    this.getHelp()
  },
  getHelp(){
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    app.util.request({
      url: "/index/helpinfo",
      data: {
      
      },
      success: function (a) {
        // debugger
        console.log("帮助中心列表")
        console.log(a)
        wx.hideLoading()
        if (a.data.errno == 0) {
          let d = a.data.data
          for (let i = 0; i < d.length; i++) {
            d[i].subStauts = false
          }
          that.setData({
            helpList: d
          })
        }
      },
      fail: function (a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  showSubList(e) {
    let that = this,
      w = e.currentTarget.dataset.w;
    let d = that.data.helpList
    // for (let i = 0; i < d.length; i++) {
    //   d[i].subStauts = false
    // }
    // that.setData({
    //   helpList: d
    // })
    let k = "helpList[" + w + "].subStauts"
    if (that.data.helpList[w].subStauts){
      that.setData({
        [k]: false,
      })
    }else{
      that.setData({
        [k]: true,
      })
    }
  },
  getData() {
    let that = this
    app.util.request({
      url: "/index/getKolInfo",
      data: {
        member_id: member_id
      },
      success: function (a) {
        // debugger
        console.log("达人提示")
        console.log(a)
        if (a.data.errno == 0){
          that.setData({
            ruleMsg: a.data.data.message
          })
        }
      },
      fail: function (a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  applyKol(){
    wx.showLoading({
      title: '申请中...',
    })
    let that = this
    that.getData()
    app.util.request({
      url: "/index/to_kol",
      data: {
        member_id: member_id
      },
      method: "POST",
      success: function (a) {
        wx.hideLoading()
        // debugger
        console.log("名片列表")
        console.log(a)
        if (a.data.errno == 0) {
          that.setData({
            applyMsg: a.data.data.message
          })
        }
      },
      fail: function (a) {
        wx.hideLoading()
        // debugger
        console.log("数据错误");
        console.log(a);
        that.setData({
          applyMsg: a.data.message
        })
      }
    })
  },
  openKol(){
    let that = this
    if (!that.data.kolStatus){
      that.setData({
        kolStatus: true
      })
    }else{
      that.setData({
        kolStatus: false
      })
    }
   
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { }
});
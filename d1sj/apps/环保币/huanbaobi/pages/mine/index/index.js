const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {
    img_url: app.data.imgUrl,
    unData: {
      unlauds: 0,
      unreads: 0,
      uncomment: 0
    }
  },
  onTabItemTap(item) {
    if (item.index == 3) {
      wx.hideTabBarRedDot({
        index: 3
      })
    }
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info')
    })
    that.getData()
  },
  onShow: function() {
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('已经授权')
              console.log(res.userInfo)
              wx.setStorageSync('user_info', res.userInfo);
            }
          })
        }
      }
    })
    // 未读
    publicMethod.getUnreadNum(this)
    that.getHuishouStatus()
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  getData() {
    let that = this
  },
  getHuishouStatus(){//什么人
    let that = this
    common.get('/recover/verifyMember', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("什么人")
      console.log(res)
      if (res.data.errno == 0) {
        that.setData({
          types: res.data.data.type 
        })
      }
    }).catch(e => {
      // app.showToast({
      //   title: "数据异常",
      // })
      console.log(e)
    })
    
  }
})
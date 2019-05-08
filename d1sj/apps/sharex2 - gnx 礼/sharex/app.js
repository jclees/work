//app.js
let common = require('assets/js/common');
App({
  data: {
    imgUrl: 'https://gnx.weixingzpt.com/imgs/',
    userStatus:true
  },
  getUserInfo: function(cb, success, userinfo) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function(data) {
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo
              typeof success == "function" && success(data, res)
              typeof cb == "function" && cb(that.globalData.userInfo, res)
            }
          })
        }
      })
    }
  },
  showToast: function(text, o, count) {
    var _this = o;
    count = parseInt(count) ? parseInt(count) : 3000;
    _this.setData({
      toastText: text,
      isShowToast: true,
    });
    setTimeout(function() {
      _this.setData({
        isShowToast: false
      });
    }, count);
  },
  globalData: {
    userInfo: null
  },
  sideIconStatus(id, o) {//普通用户关注提醒
    let _this = o;
    common.get('/user/bombwarn', {
      member_id: id
    }).then(res => {
      console.log("获取状态成功111111111")
      console.log(res)
      if(res.data.data.code == 200){
        _this.setData({
          userStatus: true
        })
      }else{
        _this.setData({
          userStatus: false
        })
      }
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  }
})
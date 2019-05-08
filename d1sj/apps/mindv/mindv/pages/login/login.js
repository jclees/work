let common = require('../../assets/js/common');
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })
    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    last_time: '',
    is_show: true,
    isSuccYzflag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.isSuccYzflag) {
      wx.setStorageSync('isSuccYz', '1')
    }
    this.setData({
      member_id: wx.getStorageSync('member_id')
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.isSuccYzflag) {
      wx.setStorageSync('isSuccYz', '1')
    }
  },
  inputTel(e) {
    var that = this;
    that.setData({
      telValue: e.detail.value
    })
  },
  inputYzcode(e) {
    var that = this;
    that.setData({
      yzcodeValue: e.detail.value
    })
  },
  clickVerify() {
    var that = this;
    common.get('/verify', {
      phone: that.data.telValue
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        // 将获取验证码按钮隐藏60s，60s后再次显示
        that.setData({
          is_show: (!that.data.is_show)  //false
        })
        settime(that);
        
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
      } else {
        console.log("error",res)
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  saveData() {
    var that = this;
    let telValue = that.data.telValue,
      yzcodeValue = that.data.yzcodeValue
    if (telValue == '' || telValue == undefined) {
      wx.showToast({
        title: "手机号不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    } else if (yzcodeValue == '' || yzcodeValue == undefined) {
      wx.showToast({
        title: "验证码不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      common.get('/doverify', {
        member_id: that.data.member_id,
        phone: telValue,
        verify: yzcodeValue
      }).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isSuccYzflag: false
          })
          wx.setStorageSync('store', res.data.stores_name)
          wx.setStorageSync('depart_id', res.data.depart_id)
          wx.setStorageSync('stores_id', res.data.stores_id)
          wx.setStorageSync('isSuccYz', '2')
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
})
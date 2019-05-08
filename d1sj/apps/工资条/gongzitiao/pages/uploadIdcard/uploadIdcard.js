const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl
Page({
  data: {
    img_url: app.data.imgUrl,
    upimgs: []
  },
  onLoad: function(options) {

  },
  onShow() {
    let that = this
    let member_id = wx.getStorageSync('member_id')
    if (member_id) {
      // that.getData()
      that.setData({
        member_id: member_id,
      })
      that.checkStatus()
    }
  },
  checkStatus() {
    // debugger
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/member/checkstatus', {
      member_id: that.data.member_id
    }).then(res => {
      wx.hideLoading()
      console.log("个人身份状态")
      console.log(res)
      if (res.data.err_code == 0) {

        if (res.data.result.status == 0) {
          
          return
        } else if (res.data.result.status == 1) {
          // debugger
          
          return
        } else if (res.data.result.status == 2) {
          that.setData({
            shenheStatus:!0
          })
          return
        } else if (res.data.result.status == 3) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
          return
        }
        // debugger
        // that.getData()
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  bindchoose(e) {
    app.getFormId(this, e);
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          upimgs: tempFilePaths
        })
      },
      fail: function() {

      }
    });
  },
  savaData(e) {
    app.getFormId(this, e);
    let that = this;
    if (that.data.upimgs.length == 0) {
      app.showToast({
        title: "请先上传图片",
      })
      return
    }
    wx.uploadFile({
      url: "https://wage.weixingzpt.com/api/pactsign/uploadHand",
      filePath: that.data.upimgs[0],
      name: "hand_img", //这里根据自己的实际情况改
      formData: {
        'content-type': 'multipart/form-data',
        member_id: that.data.member_id,
        hand_img: that.data.upimgs
      }, //这里是上传图片时一起上传的数据
      success: (res) => {
        let data = JSON.parse(res.data);
        console.log(data)
        if (data.result.status == 2){
          that.setData({
            shenheStatus: !0
          })
        }
      },
      fail: (res) => {},
      complete: (res) => {}
    });
  },
  _jump: function(a) {
    var t = a.currentTarget.dataset.url;
    wx.reLaunch({
      url: t
    });
  }
})
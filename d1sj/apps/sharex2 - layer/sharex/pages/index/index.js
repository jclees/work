// pages/money/money.js
const app = getApp()
let common = require('../../assets/js/common');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgUrl,
    isShowToast: false,
    pop: false,
    pop2: false,
    layer: {
      layerShow: true,
      layerContentTxt: '您好！我是提示框哦',
      layerBtnStatus: true,
      layerClose: false,
      layerBtntTxt: '我知道了',
      layerBgPic:'/imgs/pop_bgc.png',
      layerBgPicStatus:true
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.login({ //登录信息
      success: function(res) {
        if (res.code) {
          _this.setData({
            loginData: res
          })
          console.log("app.globalData.shareInfo")
          console.log(app.globalData.shareInfo)
          if (app.globalData.shareInfo) {
            _this.setData({
              shareInfo: app.globalData.shareInfo
            })
          } else {
            _this.setData({
              shareStatus: true
            })
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  close() {
    let a = "layer.layerContentTxt",
      b = "layer.layerShow"
    this.setData({
      [b]: false
    })
  },
  onShow() {
    this.onLoad()
  },
  getUserInfo: function(e) { //手机号
    var _this = this
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '请完成授权后进行提现',
      //   success: function (res) { }
      // })
    } else {
      common.post('/member/getPhoneNumber', {
        code: _this.data.loginData.code,
        encryptedDataPhone: e.detail.encryptedData,
        ivPhone: e.detail.iv
      }).then(res => {
        console.log("授权手机号成功")
        console.log(res)
        _this.setData({
          id: res.data.member_id
        })
        _this.setData({
          pop: false
        })
      }).catch(res => {
        console.log('数据获取失败')
        console.log(res)
        let reason = [];
        for (let i in res.data.errors) {
          reason.push(res.data.errors[i][0])
        }
        app.showToast(reason[0] || res.data.message, this, 2000)
      })
    }

  },
  // 输入地址
  inputAdd(e) {
    this.setData({
      address: e.detail.value
    })
  },
  savaData(e) { //提交
    console.log(e)
    let _this = this
    // let reg = /^[\da-zA-Z]{42}$/
    // if (!reg.test(_this.data.address)){
    //   console.log(111)
    // }else{
    //   console.log(2222)
    // }
    wx.getUserInfo({
      success: function(res) {
        common.post('/member/dosubmit', {
          member_id: _this.data.id,
          wallet_address: _this.data.address,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          encryptedDataGroup: _this.data.shareInfo.encryptedData,
          ivGroup: _this.data.shareInfo.iv
        }).then(res => {
          console.log("提交成功===")
          console.log(res)
          app.showToast(res.data.msg, _this, 2000)
        }).catch(res => {
          console.log('数据获取失败')
          console.log(res)
          let reason = [];
          for (let i in res.data.errors) {
            reason.push(res.data.errors[i][0])
          }
          app.showToast(reason[0] || res.data.message, this, 2000)
        })
      }
    })

  },
  // 打开提现弹出框
  openPop1(e) {
    this.setData({
      pop: true,
      tixType: e.target.id
    })
  },
  // 关闭弹出框
  closePop1() {
    this.setData({
      pop: false
    })
  },
  onShareAppMessage: function(res) {
    return {
      title: 'BST空投150万糖果，交易所正常交易，点击即可领取',
      imageUrl: '',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  },
})
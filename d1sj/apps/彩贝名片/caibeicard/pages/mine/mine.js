const app = getApp()
const common = require('../../assets/js/common');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img_url: app.data.imgUrl,
    showNav: true,
    navActive: 2,
    region: ['北京', '北京', '东城区'],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    that.getData()
  },
  getData() {
    let that = this
    //个人信息
    that.getPerson()
    //所在小区二维码
    that.getXqQrcode()
    //获取年龄段
    that.getAges()
  },
  calling: function () {
    // debugger
    let that = this
    wx.makePhoneCall({
      phoneNumber: that.data.custom_phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  getAges() { //获取年龄段
    let that = this
    common.get('/index/getAges', {}).then(res => {
      console.log("获取年龄段")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          navbarsub: res.data.data
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/getBanner 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getNearList() { //附近取货点
    let that = this
    common.get('/index/nearList', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("附近取货点")
      console.log(res)
      if (res.data.code == 100) {
        if (res.data.data.lists.length <= 0) {
          that.setData({
            pop1: true,
            custom_phone: res.data.data.custom_phone
          })
        } else {
          app.globalData.nearListData = res.data.data.lists
          app.turnToPage('/pages/nearAdderss/nearAdderss')
        }
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/nearList 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getPerson() { //个人信息
    let that = this
    common.get('/index/memberInfo', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("个人信息")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          personData: res.data.data,
          region: res.data.data.p_c_a,
          index: Number(res.data.data.age_id) - 1
        })
        app.globalData.personData = that.data.personData
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/member/info 接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  getXqQrcode() { //所在小区二维码
    let that = this
    common.get('/index/myQrcode', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("所在小区二维码")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          xqQrcodeData: res.data.data
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/myQrcode 接口获取数据失败",
      })
      console.log(e)
    })
  },
  submitRegData(e) {
    wx.showLoading({
      title: '加载中...'
    })
    let that = this
    let pram = e.detail.value
    pram.member_id = that.data.member_id
    pram.age_id = that.data.navbarsub[that.data.index].id
    console.log(pram)
    common.post('/index/register', pram).then(res => {
      console.log("表单提交成功")
      console.log(res)
      if (res.data.code == 100) {
        wx.hideLoading()
        app.getFormId(that, e)//取formid
        that.getData()
        that.setData({
          pop3: false
        })
        app.globalData.pop3 = false
        app.showToast({
          title: res.data.msg,
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/register 接口获取数据失败",
      })
      console.log(e)
    })
  },
  shareWxpyq() { //保存小区二维码
    let that = this
    wx.showLoading({
      title: '生成二维码中..',
    })
    // debugger
    wx.downloadFile({
      url: that.data.xqQrcodeData.qrcode,
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
          fail: function(res) {
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
        wx.showToast({
          title: '生成二维码接口失败',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  jumpCharge() {
    app.turnToPage('/pages/charge/charge')
  },
  jumpMyshare() {
    app.turnToPage('/pages/myShare/myShare')
  },
  jumpMyorder() {
    app.turnToPage('/pages/myOrder/myOrder')
  },
  jumpMyHome() {
    app.showToast({
      title: '敬请期待'
    })
  },
  jumpMyAddress() {
    let that = this
    //附近取货点
    that.getNearList()
  },
  bindPickerChange(e) { //所有picker index
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this
    let id = e.currentTarget.dataset.id
    let val = e.detail.value
    if (id == 0) {
      that.setData({
        region: val
      })
    } else if (id == 1) {
      that.setData({
        index: val
      })
    }
  },
  popLock: function(event) {
    console.log(app.globalData)
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
})
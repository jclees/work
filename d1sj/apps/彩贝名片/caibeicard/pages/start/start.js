const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl
Page({
  data: {
    img_url: app.data.imgUrl,
    timer: '', //倒计时名字
    skip: 5, //跳过按钮初始秒数
    clearSkip: true, //显示跳过按钮
    guideInde: 0, //引导页默认
    region: ['北京', '北京', '东城区'],
    index: 0,
    imgs: [
      app.data.imgUrl + "start_bg01.png",
      app.data.imgUrl + "start_bg02.png",
      app.data.imgUrl + "start_bg03.png",
      app.data.imgUrl +"start_bg04.png",
    ]
  },
  onLaunch: function() {},
  onLoad: function() {
    let that = this
    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
    that.countDown();
  },
  skipGuide() { //跳过引导
    let that = this
    that.setData({
      clearSkip: false,
      guideInde: that.data.imgs.length - 1
    })
  },
  countDown() { //倒计时
    let that = this;
    let countDownNum = that.data.skip; //获取倒计时初始值
    that.setData({
      timer: setInterval(function() {
        countDownNum--;
        that.setData({
          skip: countDownNum
        })
        if (countDownNum == 0) {
          clearInterval(that.data.timer);
          that.setData({
            clearSkip: false
          })
        }
      }, 1000)
    })
  },
  onShow() {
    let that = this
    that.getData()
  },
  getUserInfo(e) { //授权 获取个人信息
    let that = this
    app.globalData.userInfo = e.detail.userInfo
    wx.getUserInfo({
      success: function() {
        common.post('/index/oauth', {
          code: that.data.loginData.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }).then(res => {
          console.log("授权 获取个人信息")
          console.log(res)
          if (res.data.code == 100 || res.data.code == 200) {
            that.setData({
              member_id: res.data.data.member_id
            })
            if (res.data.data.is_register == 1){
              wx.reLaunch({
                url: '/pages/index/index',
              })
              wx.setStorageSync('member_id', that.data.member_id)
            }else{
              that.setData({
                pop4: true
              })
            }
          } else {
            app.showToast({
              title: res.data.msg,
            })
          }
        }).catch(e => {
          app.showToast({
            title: "/index/oauth 接口获取数据失败",
          })
          console.log(e)
        })
      },
      fail() {
        app.showToast({
          title: "授权失败",
        })
      }
    })
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
  submitRegData(e) {
    wx.showLoading({
      title: '加载中...'
    })
    let that = this
    let pram = e.detail.value
    pram.member_id = that.data.member_id
    pram.age_id = that.data.navbarsub[that.data.index].id
    console.log(pram)
    debugger
    common.post('/index/register', pram).then(res => {
      debugger
      console.log("表单提交成功")
      console.log(res)
      if (res.data.code == 100) {
        wx.hideLoading()
        app.getFormId(that, e)//取formid
        wx.setStorageSync('member_id', that.data.member_id)
        wx.setStorageSync('age_index', Number(that.data.index) + 1)
        that.setData({
          pop4: false
        })
        wx.reLaunch({
          url: '/pages/index/index',
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      debugger
      app.showToast({
        title: "/index/register 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getData() { //初始化数据
    let that = this
    //获取年龄段
    that.getAges()
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
        title: "/index/getAges 接口获取数据失败",
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
  }
})
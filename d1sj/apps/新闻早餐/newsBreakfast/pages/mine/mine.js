const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: app.data.imgUrl,
    jianli: {
      name: '荐力值',
      activeValue: 80,
      totalValue: 100,
      zi: [{
        name: '能力值',
        activeValue: 18,
        totalValue: 25,
      }, {
        name: '贡献值',
        activeValue: 22,
        totalValue: 25,
      }, {
        name: '学习值',
        activeValue: 25,
        totalValue: 25,
      }, {
        name: '人脉值',
        activeValue: 15,
        totalValue: 25,
      }, ]
    },
    navActive: 2,
    pop4: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      community: wx.getStorageSync('community'),
      commendation_rules: wx.getStorageSync('commendation_rules')
    })
    that.getData()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  getData() {
    let that = this
    //个人信息
    that.getPerson()
  },
  getPerson() { //个人信息
    let that = this
    common.get('/member/info', {
      member_id:that.data.member_id
    }).then(res => {
      console.log("get个人信息")
      console.log(res)
      that.setData({
        personData: res.data
      })
    }).catch(e => {
      app.showToast({
        title: "/member/info 接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  getwenzhang() { //朋友圈动态
    let that = this
    common.get('/getInfo', {}).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        console.log("授权成功")
        that.setData({
          wenzData: res.data.lists
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/getInfo 接口获取数据失败",
      })
      console.log(e)
    })
  },
  popLock: function(event) {
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
})
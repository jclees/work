const app = getApp()
const common = require('../../assets/js/common');

Page({
  data: {
    img_url: app.data.imgUrl,
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      popData: wx.getStorageSync('popData')
    })
    that.getData()
  },
  onShow: function() {
    let that = this
    app.navStatus(that, 2, { member_id: that.data.member_id })//能否发表文章
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
  jumpTang(){
    app.showToast({
      title:'敬请期待'
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
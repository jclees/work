const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {
    img_url: app.data.imgUrl,
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      isSxin: options.isSxin,
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info')
    })
    that.getData()
  },
  onShow: function() {
    let that = this
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  goChat(e) {
    publicMethod.getFormId(e, this)
    let id = e.currentTarget.dataset.id;
    if (id == this.data.member_id) {
      id = e.currentTarget.dataset.beid;
    }
    wx.navigateTo({
      url: '/pages/chatDetail/index?be_member_id=' + id + '&name=' + e.currentTarget.dataset.name,
    })
  },
  getData() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    let url = '/chat/getChatHome';
    if (that.data.isSxin == 2) {
      url = '/getNewData'
    }
    common.get(url, {
      member_id: that.data.member_id
    }).then(res => {
      wx.hideLoading()
      console.log("私信and动态")
      console.log(res)
      that.setData({
        lists: res.data.data
      })
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    wx.stopPullDownRefresh()
    that.getData()
  }
})
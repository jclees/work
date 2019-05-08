const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {},
  onLoad: function(options) {
    let that = this;

    that.setData({
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info'),
      who: options.who
    })
    that.getData()
  },
  onShow: function() {
    let that = this
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  getData() {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    common.get('/recover/getOrder', {
      member_id: that.data.member_id,
      type: that.data.who
    }).then(res => {
      console.log("订单")
      console.log(res)
      if (res.data.errno == 0) {
        wx.hideLoading()
        if (res.data.data.length <= 0) {
          setTimeout(function() {
            that.setData({
              dataStatus: true
            })
          }, 500)
          return
        }
        that.setData({
          lists: res.data.data
        })
      }
    }).catch(e => {
      that.setData({
        savaStatus: true
      })
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  savaData(e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id;
    let txt = e.currentTarget.dataset.txt;
    let curIdx = e.currentTarget.dataset.curidx;
    wx.showModal({
      title: '提示',
      content: '确定' + txt + '吗？',
      success: function(res) {
        if (res.confirm) {
          common.post('/recover/changeOrderStatus', {
            member_id: that.data.member_id,
            status,
            order_id:id
          }).then(res => {

            console.log("修改状态")
            console.log(res)
            if (res.data.errno == 0) {
              that.getData()
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    wx.stopPullDownRefresh()
    that.getData()
  }

})
// pages/person/score/score.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    scoreList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scoreNum: wx.getStorageSync('scoreNum'),
      member_id: wx.getStorageSync('member_id')
    })
    // 获取积分列表
    this.getStoreList()
  },  
  // 获取积分列表
  getStoreList(){
    common.get('/member/integrallogs',{
      member_id: this.data.member_id
    }).then(res=>{
      console.log(res)
      if (res.data.data.length <= 0) {
        app.showToast("暂无数据", this, 2000)
        return
      }
      this.setData({
        scoreList:res.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  }
})
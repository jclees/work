// pages/today-tesk/today-tesk.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    todaylist: [],
    todayInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      todayInfo: wx.getStorageSync('todayScore'),
      member_id: wx.getStorageSync('member_id')
    })
  },
  onShow(){
    // 获取今日任务列表
    this.getTodayList();
  },
  // 获取今日任务列表
  getTodayList(){
    common.get('/activity/tasklists',{
      member_id: this.data.member_id,
      tasktype:0
    }).then(res=>{
      this.setData({
        todaylist:res.data
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
// pages/must-task/must-task.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todaylist: [],
    isShowToast:false,
    todayInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member_id: wx.getStorageSync('member_id'),
      todayInfo: wx.getStorageSync('mustScore')
    })
  },
  onShow:function(){
    // 获取必做列表
    this.getMustList();
  },
  // 获取必做任务列表
  getMustList(){
    common.get('/activity/tasklists',{
      member_id: this.data.member_id,
      tasktype:1
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
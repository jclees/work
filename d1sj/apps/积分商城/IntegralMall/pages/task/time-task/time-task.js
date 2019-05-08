// pages/time-task/time-task.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    todayInfo: {},
    todaylist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activity_id: options.id,
      member_id: wx.getStorageSync('member_id')
    })
  },
  onShow:function(){
    // 获取时间列表
    this.getTimeList();
    // 获取人数
    this.getPerson();
  },
  // 获取时间列表
  getTimeList(){
    common.get('/activity/task',{
      member_id: this.data.member_id,
      activity_id: this.data.activity_id
    }).then(res=>{
      this.setData({
        todayInfo:res.data,
        todaylist:res.data.lists
      })
    }).then(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取人数
  getPerson(){
    common.get('/notice/number',{
      member_id: this.data.member_id,
      activity_id: this.data.activity_id	
    }).then(res=>{
      this.setData({
        num:res.data.num
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 提醒函数
  remind(){
    common.get('/notice/tixing',{
      member_id: this.data.member_id,
      activity_id: this.data.activity_id
    }).then(res=>{
      app.showToast(res.data.msg, this, 2000)
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  }
})
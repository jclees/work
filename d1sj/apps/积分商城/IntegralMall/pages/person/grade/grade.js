// pages/person/grade/grade.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast:false,
    gradeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member_id: wx.getStorageSync('member_id')
    })
  },
  onShow:function(){
    // 获取等级列表
    this.getGradeList();
    // 获取等级详情
    this.getGradeDetail();
  },
  // 获取等级列表
  getGradeList(){
    common.get('/grade/lists',{}).then(res=>{
      this.setData({
        gradeList:res.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取等级详情
  getGradeDetail(){
    common.get('/member/integralandgrade',{
      member_id: this.data.member_id
    }).then(res=>{
      this.setData({
        gradeDetail:res.data
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
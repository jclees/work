// pages/shop/result/result.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    shopList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member_id: wx.getStorageSync('member_id'),
      searchKey: options.key
    })
    // 获取搜索结果
    this.getRes();
  },
  // 获取搜索结果
  getRes(){
    common.get('/search/search',{
      keyword: this.data.searchKey,
      member_id: this.data.member_id	
    }).then(res=>{
      this.setData({
        shopList:res.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  changeInp(e){
    debugger
    this.setData({
      inpVal:e.detail.value
    })
  },
  search(){
    common.get('/search/search', {
      keyword: this.data.inpVal,
      member_id: this.data.member_id
    }).then(res => {
      debugger
      this.setData({
        shopList: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 跳转到详情
  detail(e){
    let id=e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '../../../pages/shop/shopDetail/shopDetail?id='+id
    })
  }
})
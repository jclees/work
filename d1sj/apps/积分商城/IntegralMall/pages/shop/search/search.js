// pages/shop/search/search.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    hotList:[],
    hisList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member_id: wx.getStorageSync('member_id')
    })
  },
  onShow(){
    // 获取热门搜索列表
    this.getHot();
    // 获取历史搜索列表
    this.getHis();
  },
  // 获取热门搜索列表
  getHot(){
    common.get('/search/hot',{}).then(res=>{
      this.setData({
        hotList:res.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取历史搜索
  getHis(){
    common.get('/search/history',{
      member_id: this.data.member_id
    }).then(res=>{
      this.setData({
        hisList:res.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 清除历史搜索
  empty(){
    let _this=this
    common.post('/search/clear',{
      member_id: this.data.member_id
    }).then(res=>{
      if(res.data.code==200){
        _this.setData({
          hisList:[]
        })
      }
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  // 输入关键字
  inputKey(e){
    this.setData({
      key:e.detail.value
    })
  },
  // 搜索内容
  search(){ 
    if (!this.data.key){
      return false
    }
    wx.navigateTo({
      url: '../../../pages/shop/result/result?key=' + this.data.key
    })
  },
  // 跳转到搜索结果
  jumpRes(e){
    let key=e.currentTarget.dataset.item.name
    wx.navigateTo({
      url: '../../../pages/shop/result/result?key=' + key
    })
  }
})
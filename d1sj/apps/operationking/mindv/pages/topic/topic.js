// pages/topic/topic.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    pop:false,
    show: false,
    img_url: app.data.url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取题目分类
    this.getAns();
  },
  // 选择题目
  ans(e){
    let index=e.currentTarget.dataset.index
    let list=this.data.answer
    let name=list.son[index].name
    let id = list.son[index].id
    wx.setStorageSync('name', name)
    wx.setStorageSync('id',id)
    for(var i=0;i<list.son.length;i++){
      list.son[i].cover=false
    }
    list.son[index].cover=true
    this.setData({
      show:true,
      answer:list
    })
  },
  step(){
    wx.navigateTo({
      url: '../../pages/question/question',
    })
  },
  // 获取题目分类
  getAns(){
    common.get('/question/classesOne',{}).then(res=>{
      this.setData({
        list:res.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 打开弹出框
  openPop(e){
    let type=e.currentTarget.dataset.item.name
    wx.setStorageSync('type', type)
    let id=e.currentTarget.dataset.item.id
    common.get('/question/classesTwo',{
      parent_id:id
    }).then(res=>{
      let list=res.data
      for(var i=0;i<list.son.length;i++){
        list.son[i].cover=false
      }
      this.setData({
        answer:list,
        pop:true
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 关闭弹出框
  closePop(){
    this.setData({
      pop:false
    })
  }
})
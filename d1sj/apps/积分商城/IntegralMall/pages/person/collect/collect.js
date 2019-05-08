// pages/person/order/order.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    collectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member_id: wx.getStorageSync('member_id')
    })
    // 收取收藏列表
    this.getCollect();
  },
  // 获取收藏列表
  getCollect(){
    common.get('/collection/lists',{
      member_id: this.data.member_id
    }).then(res=>{
      let list=res.data.data
      for(let i=0;i<list.length;i++){
        if(list[i].status==1){
          list[i].collect='../../../imgs/hongxin.png'
        } else if (list[i].status == 2){
          list[i].collect = '../../../imgs/baixin.png'
        }
      }
      this.setData({
        collectList:list
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 取消收藏
  collect(e){
    let _this=this
    let id=e.currentTarget.dataset.item.id;
    let index=e.currentTarget.dataset.index;
    common.get('/iscollection',{
      id:id
    }).then(res=>{
      if(res.data.status==1){
        _this.data.collectList[index].collect = '../../../imgs/hongxin.png'
         app.showToast('收藏成功', _this, 2000)
      } else if (res.data.status == 2){
        _this.data.collectList[index].collect = '../../../imgs/baixin.png'
        app.showToast('取消收藏', _this, 2000)
      }
      _this.setData({
        collectList: _this.data.collectList
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})
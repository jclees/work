// pages/shop/shopDetail/shopDetail.js
let common = require('../../assets/js/common');
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    indicatorDots: true,
    autoplay: true  ,
    interval: 5000,
    duration: 1000,
    choose:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      member_id: wx.getStorageSync('member_id')
    })
    // 获取位置
    this.getPos();
  },
  // 获取位置
  getPos(){
    let _this=this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        _this.getDetail();
      }
    })
  },
  // 获取商品详情
  getDetail(){
    common.get('/product',{
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      id:this.data.id,
      member_id: this.data.member_id
    }).then(res=>{
      console.log(res)

      let list = res.data.data
      // debugger
      if(list.like==0){
        list.likeImg='../../../imgs/baixin.png'
      }else if(list.like==1){
        list.likeImg = '../../../imgs/hongxin.png'
      }
      this.setData({
        detailList:list,
        'detailList.detail': list.detail.replace(/\<img/g,'<img style="width:100%;height:auto;display:block;border-radius: 20rpx;"'),
        'detailList.num': 1
      })
      var article = this.data.detailList.detail
      var that = this;
      WxParse.wxParse('article', 'html', article, that);
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 添加喜欢
  like(){
    let _this=this
    common.post('/product/collection',{
      id: this.data.detailList.id,
      member_id: this.data.member_id
    }).then(res=>{
      if (res.data.status==1){
        _this.data.detailList.likeImg = '../../../imgs/hongxin.png'
      } else if (res.data.status == 2){
        _this.data.detailList.likeImg = '../../../imgs/baixin.png'
      }
      _this.setData({
        detailList: _this.data.detailList,
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 选择不同的规格
  choose(e){
    let index=e.currentTarget.dataset.index
    this.setData({
      choose:index
    })
    let item=e.currentTarget.dataset.item
    this.setData({
      'detailList.prices':item
    })
  },
  // 加产品
  add(){
    this.data.detailList.num++
    this.setData({
      detailList: this.data.detailList
    })
  },
  // 减产品
  red(){
    let _this=this
    if (_this.data.detailList.num>1){
      _this.data.detailList.num--
      _this.setData({
        detailList: _this.data.detailList
      })
    }
    
  },
  // 跳转到购买页面
  pay(){
    if (this.data.detailList.prices == void 0){
      this.data.detailList.prices = this.data.detailList.specs[0]
      this.setData({
        detailList: this.data.detailList
      })
    }
    wx.setStorageSync('order', this.data.detailList)
    wx.navigateTo({
      url: '../../../pages/shop/pay/pay'
    })
  },
  // 添加到购物车
  addCart(){
    let _this = this
    common.post('/car/add', {
      product_id: this.data.detailList.id,
      member_id: this.data.member_id,
      spec: this.data.detailList.specs[0].title,
      num: this.data.detailList.num
    }).then(res => {
      if(res.data.code == 200){
        wx.showToast({
          title: '添加成功',
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:"none"
        })
      }
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 打开规格盒子
  openPop(){
    this.setData({
      popShow:true
    })
  },
  // 关闭规格盒子
  closePop(){
    this.setData({
      popShow: false
    })
  },
  onShareAppMessage(res) { //分享
    let that = this
    let path = '/pages/index/index'
    console.log("分享链接")
    console.log(path)
    if (res.from === 'button') {
      return {
        title: that.data.detailList.desc,
        path: path,
        imageUrl: '',
        success: function (res) {
          // 转发成功
          console.log("转发成功")
          console.log(res)
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    return {
      title: that.data.detailList.desc,
      path: path,
      imageUrl: '',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
let cj = require('cj.js')
var windowWRPX = 750
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageNum: '', //上传的图片id
    headImg: '', //头像上传
    ewmImg: '', //二维码上传
    imageFixed: false, //裁剪浮层
    // imageSrc: 'http://topmdrt-static.oss-cn-shenzhen.aliyuncs.com/images/testimg2.jpeg',
    imageSrc: '', //要裁剪的图片
    returnImage: '',
    isShowImg: false,
    // 初始化的宽高
    cropperInitW: windowWRPX,
    cropperInitH: windowWRPX,
    // 动态的宽高
    cropperW: windowWRPX,
    cropperH: windowWRPX,
    // 动态的left top值
    cropperL: 0,
    cropperT: 0,

    // 图片缩放值
    scaleP: 0,
    imageW: 0,
    imageH: 0,

    // 裁剪框 宽高
    cutW: 700,
    cutH: 600,
    cutL: 0,
    cutT: 0,
    card_logo: [],
    photo: [],
    company_logo: [],
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
    cj.load(this)
  },

  // 拖动时候触发的touchStart事件
  contentStartMove(e) {
    cj.contentStartMove(e)
  },

  // 拖动时候触发的touchMove事件
  contentMoveing(e) {
    cj.contentMoveing(e,this)
  },
  // 获取图片
  getImageInfo() {
    cj.getImageInfo(this,'myCanvas',function(r){
      console.log(r)
    })
  },

  // 设置大小的时候触发的touchStart事件
  dragStart(e) {
    cj.dragStart(e,this)
  },
  upEwm: function (e) {
    let which = e.currentTarget.dataset.which,w,h,i;
    if (which == 1){
      w = 400, h = 400, i = 'card_logo'
    } else if (which == 2){
      w = 200, h = 200, i = 'photo'
    }
    cj.upEwm(e, this, w, h,i)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
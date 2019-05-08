// pages/ryshop/ryshop.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tupian: getApp().globalData.imgUrl,
    siteUrl: getApp().globalData.siteUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接收参数
    let params = options
    this.setData({
      list:params
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  },

  formSubmit:function(e){
    var id = e.currentTarget.id
    var formData = e.detail.value
    var title = formData.title
    var arr_a = {}
    arr_a['id'] = 1
    arr_a['name'] = formData.answer_a
    arr_a['is_right'] = 1
    var arr_b = {}
    arr_b['id'] = 2
    arr_b['name'] = formData.answer_b
    arr_b['is_right'] = 0
    var arr_c = {}
    arr_c['id'] = 3
    arr_c['name'] = formData.answer_c
    arr_c['is_right'] = 0
    var arr_d = {}
    arr_d['id'] = 4
    arr_d['name'] = formData.answer_d
    arr_d['is_right'] = 0
    var arr = [];
    arr.push(arr_a);
    arr.push(arr_b);
    arr.push(arr_c);
    arr.push(arr_d);
    if(title.length == 0) {
      wx.showToast({
        title: '题干不能为空!',
        icon: 'loading',
        duration: 1000
      })
    } else if (formData.answer_a.length == 0 || formData.answer_b.length == 0 || formData.answer_c.length == 0 || formData.answer_d.length == 0) {
      wx.showToast({
        title: '答案均不能为空!',
        icon: 'loading',
        duration: 1000
      })
    } else {
      let rychutiurl = 'EditQuestion/postQuestion';
      app.getdata.fetchApi(rychutiurl, { subject_id: id, title: title, answer: arr})
        .then(d => {
          if (d.status == 1) {
            wx.showToast({
              title: d.data,
              icon: 'loading',
              duration: 1000
            })
            this.setData({
              form_info:''
            })
          } else {
            this.setData({ hasMore: false, loading: false })
          }
        })
        .catch(e => {
          this.setData({ subtitle: '获取数据异常', loading: false })
          console.error(e)
        })
    }
  }
})
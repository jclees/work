// pages/ryshop/ryshop.js
// 
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    smallmodel: true,
    tupian: getApp().globalData.imgUrl,
    siteUrl: getApp().globalData.siteUrl,
    list:{},
  },
  modelClose(){
    this.setData({
      smallmodel: true
    })
  },
  smallModel: function (e) {
    // console.log(e)
    var id = e.currentTarget.id
    var index = e.currentTarget.dataset.index
    var title = e.currentTarget.dataset.title
    let rychutiurl = 'EditQuestion/getSubjectType';
    let itemType = this.list[index];
    app.getdata.fetchApi(rychutiurl, {pid:id})
      .then(d => {
        if (d.status == 1) {
          this.setData({
            smallmodel: !this.data.smallmodel
          })
          this.setData({
            lists:d.data,
            title:title,
            pid:id,
            itemType:itemType
          })
          
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
        console.error(e)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let rychutiurl = 'EditQuestion/getSubjectType';
    app.getdata.fetchApi(rychutiurl, {})
      .then(d => {
        if (d.status == 1) {
          this.list = d.data;
          this.setData({
            list:d.data
          })
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
        console.error(e)
      })
  },
  addTimu(e){
    // let pid = e.currentTarget.dataset.pid;
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let stitle = e.currentTarget.dataset.stitle;
    app.turnToPage('/pages/rychutis/rychutis?id='+id+'&title='+title+'&stitle='+stitle);
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
  
  }
})
// pages/test/test.js
const app = getApp()
let member_id = 0;
Page({
  data: {
  },
  onLoad: function(s) {
    // member_id = wx.getStorageSync("member_id")
    // this.getData()
    // s.type ? (type = s.type, this.getData()) : (type = 0)
  },
  onShow(){
    member_id = wx.getStorageSync("member_id")
    this.getData()
  },
  getData() {
    let that = this
    that.getProducts()
  },
  getProducts() {
    // debugger
    let that = this
    app.util.request({
      url: "/proIndex",
      data: {
        cate_id: 0,
        member_id: member_id
      },
      success: function (d) {
        wx.hideLoading()
        // debugger
        console.log("产品列表")
        console.log(d)
        that.setData({
          shops: d.data.index
        })
      },
      fail: function (res) {
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  delProduct(e){
    let that = this
    let prodId = e.currentTarget.dataset.productid
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success:function(res){
        if (res.confirm == true){
          app.util.request({
            url: "/proDel",
            data: {
              product_id: prodId
            },
            success: function (d) {
              // debugger
              console.log("删除")
              console.log(d)
              if(d.data.code == 200){
                wx.showToast({
                  title: "删除成功",
                  icon: "none"
                })
                that.getProducts()
              }
            },
            fail: function (res) {
              console.log("数据错误");
              console.log(res);
              wx.showToast({
                title: res.data.message,
                icon: "none"
              })
            }
          });
        }
      }
    })
    
  }
})
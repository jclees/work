// pages/test/test.js
const app = getApp()
let common = require('../../assets/js/common');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaShow: true,
    pics: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      member_id: wx.getStorageSync('member_id')
    })
  },
  textareaInp(e) {
    let that = this
    that.setData({
      textareaCon: e.detail.value
    })
  },
  openPic(e) {
    let that = this
    console.log(e)
    // wx.previewImage({
    //   current: e.currentTarget.dataset.url, // 当前显示图片的http链接
    //   urls: that.data.pics // 需要预览的图片http链接列表
    // })
    that.setData({
      textareaShow: false,
      layer: true,
      preview: e.currentTarget.dataset.url,
      previewIndex: e.currentTarget.dataset.index,
    })
  },
  closePic() {
    let that = this
    that.setData({
      textareaShow: true,
      layer: false
    })
  },
  delPic() {
    let that = this
    let picsUp = that.data.pics
    picsUp.splice(that.data.previewIndex, 1)
    that.setData({
      pics: picsUp,
      textareaShow: true,
      layer: false
    })
  },
  choose: function() { //这里是选取图片的方法
    var that = this,
      pics = this.data.pics;
    wx.chooseImage({
      count: 2 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        console.log(res)
        var imgsrc = res.tempFilePaths;　　　　　　　　　
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics,
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  savaData(e) { //提交意见和建议
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)
    let that = this
    var pics = that.data.pics;
    let param = {}
    param = e.detail.value
    param.member_id = that.data.member_id
    // console.log("提交意见和建议")
    // console.log(param)
    // console.log(pics)
    common.post('/note/uploadCont', param).then(res => {
      // console.log("成功")
      // console.log(res)
      if (res.data.code == 200) {
        if (pics.length == 0){
          wx.hideLoading()
          app.showModal({
            content: '留言成功',
            confirm: function (res) {
              app.turnBack(1)
            }
          })
        }else{
          app.uploadimg({
            url: 'https://ago.weixingzpt.com/api/note/uploadImgs', //这里是你图片上传的接口
            path: pics, //这里是选取的图片的地址数组
            note_id: res.data.note_id,
            member_id: that.data.member_id,
            picUpSuccess:function(res){
              wx.hideLoading()
              app.showModal({
                content: '留言成功',
                confirm: function (res) {
                  app.turnBack(1)
                }
              })
            }
          });
        }
      } else {
        wx.hideLoading()
        app.showModal({
          content: res.data.msg
        });
      }
    }).catch(res => {
      console.log('数据获取失败', res)
    })


  }
})
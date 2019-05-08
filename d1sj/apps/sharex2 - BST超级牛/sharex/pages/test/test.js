let app = getApp();
let common = require('../../assets/js/common')
Page({
  data: {
    scene: ''
  },
  onLoad: function (options) {
    common.setStorage('aaa', '11111')
    
    var that = this
    var scene_img = 'https://img.zcool.cn/community/01b2295568a994000001271604da4f.jpg@1280w_1l_2o_100sh.webp' //这里添加图片的地址  
    that.setData({
      scene: scene_img
    })
  },
  previewImage: function () {
    wx.previewImage({
      urls: this.data.scene.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
    })
  }
})  
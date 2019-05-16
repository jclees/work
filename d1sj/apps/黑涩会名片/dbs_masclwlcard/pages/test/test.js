var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      'https://timgs.top1buyer.com/admin/special/special_img_20190301160008479.jpg'
    ],
    loading: false
  },

  onLoad: function(options) {},
  openSetting(t) { //打开授权设置
    let _this = t;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '若不打开授权，则无法将图片保存在相册中！',
      success: function (res) {
        wx.getSetting({
          success(data) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  console.log(res)
                  if (!res.authSetting["scope.writePhotosAlbum"]) {
                    _this.openSetting(_this)
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  // 下载图片
  downloadImgs(e) {
    var _this = this
    // _this.openSet()
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {//这里是用户同意授权后的回调
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        // 调用保存图片promise队列
        _this.queue(_this.data.list)
          .then(res => {

            wx.setClipboardData({
              data: e.currentTarget.dataset.txt,
              success: function (res) {
                wx.hideLoading()
                wx.showToast({
                  title: '图文复制成功',
                  icon:'none'
                })
              }
            });

          })
          .catch(err => {
            wx.hideLoading()
            console.log(err)
          })
      },
      fail() {//这里是用户拒绝授权后的回调
        _this.openSetting(_this)
      }
    })
  },
  // 队列
  queue(urls) {
    let promise = Promise.resolve()
    urls.forEach((url, index) => {
      promise = promise.then(() => {
        return this.download(url)
      })
    })
    return promise
  },
  // 下载
  download(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: function(res) {

          var temp = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function(res) {
              resolve(res)
            },
            fail: function(err) {
              reject(res)
            }
          })
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  }
})
// 手机的宽度
var windowWRPX = 750
// 拖动时候的 pageX
var pageX = 0
// 拖动时候的 pageY
var pageY = 0

var pixelRatio = wx.getSystemInfoSync().pixelRatio

// 调整大小时候的 pageX
var sizeConfPageX = 0
// 调整大小时候的 pageY
var sizeConfPageY = 0

var initDragCutW = 0
var initDragCutL = 0
var initDragCutH = 0
var initDragCutT = 0

// 移动时 手势位移与 实际元素位移的比
var dragScaleP = 2

class Cj {
  constructor() {
    this.data = {
      
    }
  }
  load(t) {
    var _this = t
    // wx.showLoading({
    //   title: '图片加载中...',
    // })
    wx.getImageInfo({
      src: _this.data.imageSrc,
      success: function success(res) {
        var innerAspectRadio = res.width / res.height;
        console.log(innerAspectRadio)
        // 根据图片的宽高显示不同的效果   保证图片可以正常显示
        if (innerAspectRadio >= 1) {
          _this.setData({
            cropperW: windowWRPX,
            cropperH: windowWRPX / innerAspectRadio,
            // 初始化left right
            cropperL: Math.ceil((windowWRPX - windowWRPX) / 2),
            cropperT: Math.ceil((windowWRPX - windowWRPX / innerAspectRadio) / 2),
            // 裁剪框  宽高 
            // cutW: windowWRPX - 200,
            // cutH: windowWRPX / innerAspectRadio - 200,
            cutL: Math.ceil((windowWRPX - windowWRPX + 340) / 2),
            cutT: Math.ceil((windowWRPX / innerAspectRadio - (windowWRPX / innerAspectRadio - 20)) / 2),
            // 图片缩放值
            scaleP: res.width * pixelRatio / windowWRPX,
            // 图片原始宽度 rpx
            imageW: res.width * pixelRatio,
            imageH: res.height * pixelRatio
          })
        } else {
          _this.setData({
            cropperW: windowWRPX * innerAspectRadio,
            cropperH: windowWRPX,
            // 初始化left right
            cropperL: Math.ceil((windowWRPX - windowWRPX * innerAspectRadio) / 2),
            cropperT: Math.ceil((windowWRPX - windowWRPX) / 2),
            // 裁剪框的宽高
            // cutW: windowWRPX * innerAspectRadio - 66,
            // cutH: 400,
            cutL: Math.ceil((windowWRPX * innerAspectRadio - (windowWRPX * innerAspectRadio - 20)) / 2),
            cutT: Math.ceil((windowWRPX - 340) / 2),
            // 图片缩放值
            scaleP: res.width * pixelRatio / windowWRPX,
            // 图片原始宽度 rpx
            imageW: res.width * pixelRatio,
            imageH: res.height * pixelRatio
          })
        }
        _this.setData({
          isShowImg: true
        })
        wx.hideLoading()
      }
    })
  }
  // 拖动时候触发的touchStart事件
  contentStartMove(e) {
    pageX = e.touches[0].pageX
    pageY = e.touches[0].pageY
  }
  // 拖动时候触发的touchMove事件
  contentMoveing(e,t) {
    var _this = t
    // _this.data.cutL + (e.touches[0].pageX - pageX)
    // console.log(e.touches[0].pageX)
    // console.log(e.touches[0].pageX - pageX)
    var dragLengthX = (pageX - e.touches[0].pageX) * dragScaleP
    var dragLengthY = (pageY - e.touches[0].pageY) * dragScaleP
    var minX = Math.max(_this.data.cutL - (dragLengthX), 0)
    var minY = Math.max(_this.data.cutT - (dragLengthY), 0)
    var maxX = _this.data.cropperW - _this.data.cutW
    var maxY = _this.data.cropperH - _this.data.cutH
    _this.setData({
      cutL: Math.min(maxX, minX),
      cutT: Math.min(maxY, minY),
    })
    console.log(`${maxX} ----- ${minX}`)
    pageX = e.touches[0].pageX
    pageY = e.touches[0].pageY
  }

  // 获取图片
  getImageInfo(t,c,f) {
    debugger
    var _this = t
    console.log('shengcheng:' + _this.data.imageSrc)
    wx.showLoading({
      title: '图片生成中...',
    })
    // wx.downloadFile({
    //   url:_this.data.imageSrc, //仅为示例，并非真实的资源     
    //   success: function (res) {
    // 将图片写入画布             
    const ctx = wx.createCanvasContext(c)
    // ctx.drawImage(res.tempFilePath)
    ctx.drawImage(_this.data.imageSrc)

    ctx.draw(true, () => {
      // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
      var canvasW = (_this.data.cutW / _this.data.cropperW) * (_this.data.imageW / pixelRatio)
      var canvasH = (_this.data.cutH / _this.data.cropperH) * (_this.data.imageH / pixelRatio)
      var canvasL = (_this.data.cutL / _this.data.cropperW) * (_this.data.imageW / pixelRatio)
      var canvasT = (_this.data.cutT / _this.data.cropperH) * (_this.data.imageH / pixelRatio)
      console.log(`canvasW:${canvasW} --- canvasH: ${canvasH} --- canvasL: ${canvasL} --- canvasT: ${canvasT} -------- _this.data.imageW: ${_this.data.imageW}  ------- _this.data.imageH: ${_this.data.imageH} ---- pixelRatio ${pixelRatio}`)
      wx.canvasToTempFilePath({
        x: canvasL,
        y: canvasT,
        width: canvasW,
        height: canvasH,
        destWidth: canvasW,
        destHeight: canvasH,
        canvasId: c,
        success: function(res) {
          wx.hideLoading()
          // 成功获得地址的地方
          console.log('end:' + res.tempFilePath)
          typeof f == "function" && f(res.tempFilePath)
          // 判断时上传头像还是二维码
          _this.setData({
            imageFixed: false,
          })
          if (_this.data.imageNum == '1') {
            _this.setData({
              headImg: res.tempFilePath
            });
          } else if (_this.data.imageNum == '2') {
            _this.setData({
              ewmImg: res.tempFilePath
            })
          }

        }
      })
    })
    //   }


    // })
  }

  // 设置大小的时候触发的touchStart事件
  dragStart(e,t) {
    var _this = t
    sizeConfPageX = e.touches[0].pageX
    sizeConfPageY = e.touches[0].pageY
    initDragCutW = _this.data.cutW
    initDragCutL = _this.data.cutL
    initDragCutT = _this.data.cutT
    initDragCutH = _this.data.cutH
  }


  upEwm(e,t,w,h,o) {
    var _this = t
    _this.setData({
      cutW:w,
      cutH:h
    })
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // var mode = parseFloat(e.currentTarget.dataset.current);
        console.log('shangchuan:' + tempFilePaths)
        console.log(e.currentTarget.dataset.which);
        _this.setData({
          imageFixed: true,
          imageSrc: tempFilePaths.join(),
          imageNum: e.currentTarget.dataset.which
        })
        // start
        wx.getImageInfo({
          src: _this.data.imageSrc,
          success: function success(res) {
            var innerAspectRadio = res.width / res.height;
            console.log('bili' + innerAspectRadio)
            // 根据图片的宽高显示不同的效果   保证图片可以正常显示
            if (innerAspectRadio == '1') {
              console.log('zhengfangxingtu')
              _this.setData({
                imageFixed: false,
              })
              // 判断时上传头像还是二维码
              if (_this.data.imageNum == '1') {
                _this.setData({
                  headImg: tempFilePaths.join()
                })
              } else if (_this.data.imageNum == '2') {
                _this.setData({
                  ewmImg: tempFilePaths.join()
                })
              }

            } else if (innerAspectRadio > 1) {
              _this.setData({
                cropperW: windowWRPX,
                cropperH: windowWRPX / innerAspectRadio,
                // 初始化left right
                cropperL: Math.ceil((windowWRPX - windowWRPX) / 2),
                cropperT: Math.ceil((windowWRPX - windowWRPX / innerAspectRadio) / 2),
                // 裁剪框  宽高 
                // cutW: windowWRPX - 200,
                // cutH: windowWRPX / innerAspectRadio - 200,
                cutL: Math.ceil((windowWRPX - windowWRPX + 340) / 2),
                cutT: Math.ceil((windowWRPX / innerAspectRadio - (windowWRPX / innerAspectRadio - 20)) / 2),
                // 图片缩放值
                scaleP: res.width * pixelRatio / windowWRPX,
                // 图片原始宽度 rpx
                imageW: res.width * pixelRatio,
                imageH: res.height * pixelRatio
              })
            } else {
              _this.setData({
                cropperW: windowWRPX * innerAspectRadio,
                cropperH: windowWRPX,
                // 初始化left right
                cropperL: Math.ceil((windowWRPX - windowWRPX * innerAspectRadio) / 2),
                cropperT: Math.ceil((windowWRPX - windowWRPX) / 2),
                // 裁剪框的宽高
                // cutW: windowWRPX * innerAspectRadio - 66,
                // cutH: 400,
                cutL: Math.ceil((windowWRPX * innerAspectRadio - (windowWRPX * innerAspectRadio - 20)) / 2),
                cutT: Math.ceil((windowWRPX - 340) / 2),
                // 图片缩放值
                scaleP: res.width * pixelRatio / windowWRPX,
                // 图片原始宽度 rpx
                imageW: res.width * pixelRatio,
                imageH: res.height * pixelRatio
              })
            }
            _this.setData({
              isShowImg: true
            })
            wx.hideLoading()
          }
        })

        // end
      }
    })
  }
}

module.exports = new Cj
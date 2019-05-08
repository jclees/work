const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl
Page({
  data: {
    img_url: app.data.imgUrl,
    THeight:"400"
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      book_id: options.book_id
    })
    if (options.parent_id) {
      that.setData({
        parent_id: options.parent_id
      })
      app.getShareCoin({//分享得币
        o: that,
        param: {
          member_id: that.data.member_id,
          parent_id: options.parent_id
        }
      })
    }
  },
  seeAllTxt(){
    let that = this;
    that.setData({
      THeight:"auto"
    })
  },
  onShow() {
    let that = this
    if (that.data.member_id){
      that.getData()
    }else{
      //绘本详情
      that.getBookInfo()
      app.showModal({
        content: '填写小区信息才可以查看哦',
        confirmText:"好的",
        confirm(res) {
          wx.reLaunch({
            url: '/pages/start/start',
          })
        }
      })
    }
  },
  jumpSharePay(){
    let that = this
    that.setData({
      pop1: false,
      pop2: false,
      pop3:false
    })
    app.turnToPage('/pages/charge/charge')
  },
  jumpShareGuide(e) {
    let that = this
    app.turnToPage('/pages/shareGuide/shareGuide?book_id='+that.data.book_id)
  },
  jumpIndex(e) {
    let that = this
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  getData() { //初始化数据
    let that = this
    //绘本详情
    that.getBookInfo()
    //海报
    that.getPoster()
  },
  getBookInfo() {//绘本详情
    let that = this
    common.get('/index/bookInfo', {
      book_id: that.data.book_id
    }).then(res => {
      console.log("绘本详情")
      console.log(res)
      if(res.data.code == 100){
        app.globalData.bookInfoData = res.data.data,
        that.setData({
          bookInfoData: res.data.data,
        })
      }else{
        app.showToast({
          title: res.data.msg
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/bookInfo 接口获取数据失败",
      })
      console.log(e)
    })
  },
  savaData(e) { //确认订单提交
  wx.showLoading({
    title: '下单中...',
  })
    let that = this
    common.post('/index/toOrder', {
      member_id: that.data.member_id,
      book_id: that.data.book_id
    }).then(res => {
      console.log("下单成功")
      console.log(res)
      wx.hideLoading()
      if (res.data.code == 100) {
        app.getFormId(that, e)//取formid
        app.showToast({
          title: res.data.msg
        })
        that.setData({
          pop2: false
        })
        setTimeout(function(){
          app.turnToPage('/pages/orderDetails/orderDetails?order_id=' + res.data.data.order_id)
        },1500)
      } else if (res.data.code == 300) {
        that.setData({
          pop3: true
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/toOrder 接口获取数据失败",
      })
      console.log(e)
    })
  },
  previewImage: function(e) { //图片预览
    let that = this
    var current = e.target.dataset.src;
    var curIndex = e.target.dataset.curindex;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: that.data.wenzData[curIndex].picture // 需要预览的图片http链接列表  
    })
  },
  copyTBL(e) {
    app.copying(e)
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/info/banner', {}).then(res => {
      // console.log(res)
      if (res.data.code == 200) {
        that.setData({
          bannerUrls: res.data.data
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/info/banner 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getPoster() { //海报
    let that = this
    // debugger
    common.get('/index/getPoster', {
      member_id: that.data.member_id,
      book_id: that.data.book_id,
      type: 1
    }).then(res => {
      console.log("海报链接")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          posterUrl: res.data.data.qrcode
        })
      }else{
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/getPoster 接口获取数据失败",
      })
      console.log(e)
    })
  },
  swiperChange: function(e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function(event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  shareWxpyq() {
    let that = this
    wx.showLoading({
      title: '生成海报中..',
    })
    wx.downloadFile({
      url: that.data.posterUrl,
      success: function(res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.hideLoading()
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
            console.log(res)
          },
          fail: function (res) {
            wx.hideLoading()
            if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("打开设置窗口");
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                    console.log("获取权限成功，再次点击图片保存到相册")
                  } else {
                    console.log("获取权限失败")
                  }
                }
              })
            }
          }
        })
      },
      fail: function() {
        console.log('fail')
      }
    })

  },
  onShareAppMessage: function(res) { //分享
    let that = this
    that.setData({
      pop1:false
    })
    let path = '/pages/productDetails/productDetails?book_id=' + that.data.book_id + '&parent_id=' + that.data.member_id
    console.log("分享链接")
    console.log(path)
    if (res.from === 'button') {
      return {
        title: '只为成长，倡导不花钱',
        path: path,
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log("转发成功")
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '只为成长，倡导不花钱',
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
const app = getApp()
const common = require('../../assets/js/common');
Page({
  data: {
    img_url: app.data.imgUrl,
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    topbarTab:1
  },
  swichtopbarTab(e) {
    let that = this
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        topbarTab: 1,
        currentTab:0
      });
    } else {
      this.setData({
        topbarTab: 2,
        currentTab: 0
      });
    }
    //绘本分享 
    that.getBookShare(0, that.data.topbarTab)
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    let that = this
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    //绘本分享 
    that.getBookShare(e.detail.current, that.data.topbarTab)
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this
    var cur = e.currentTarget.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    //绘本分享 
    that.getBookShare(cur, that.data.topbarTab)
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 120;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow() {
    let that = this
    that.getData()
  },
  jumpProductDetails(e) {
    let id = e.currentTarget.dataset.id
    app.turnToPage('/pages/orderDetails/orderDetails?order_id=' + id)
  },
  getData() { //初始化数据
    let that = this
    //绘本分享 
    that.getBookShare(that.data.currentTab, that.data.topbarTab)
  },
  getBookShare(status,type) { //我的订单
  // debugger
    let that = this
    common.get('/index/myOrders', {
      member_id: that.data.member_id,
      type: type,
      status: status,
    }).then(res => {
      console.log("我的订单")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          bookShareData: res.data.data,
        })
      } else {
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
  upJiaType(e) {//上架 下架
    console.log(e)
    let that = this
    let id = e.currentTarget.dataset.id
    let bookid = e.currentTarget.dataset.bookid
    // debugger
    common.post('/index/updateShowStatus', {
      member_id: that.data.member_id,
      type: id,
      book_id: bookid
    }).then(res => {
      console.log("上架 下架")
      console.log(res)
      if (res.data.code == 100) {
        app.showToast({
          title: res.data.msg
        })
        that.getBookShare(id)
        return false
      } else {
        app.showToast({
          title: res.data.msg
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/updateShowStatus 接口获取数据失败",
      })
      console.log(e)
    })
  },
})
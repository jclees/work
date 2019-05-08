const app = getApp()
let member_id = 0;
Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    topbarTab: 1
  },
  jump_url: function (a) {
    var t = a.currentTarget.dataset.url;
    wx.navigateTo({
      url: t
    });
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    let that = this,
      u;
    this.setData({
      currentTab: e.detail.current
    });
    if (that.data.currentTab == 0) {
      u = "/action/yesterday"
    } else if (that.data.currentTab == 1) {
      u = "/action/sevenDay"
    } else if (that.data.currentTab == 2) {
      u = "/action/month"
    } else if (that.data.currentTab == 3) {
      u = "/action/allAction"
    }
    //统计
    that.getTongji(u)
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    let that = this,
      u;
    var cur = e.currentTarget.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
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
  onLoad: function() {
    let that = this;
    member_id = wx.getStorageSync('member_id'),
      //  高度自适应
      wx.getSystemInfo({
        success: function(res) {
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
    that.setData({
      currentTab:0
    })
  },
  getData() { //初始化数据
    let that = this
    //统计
    that.getTongji("/action/yesterday")
  },
  getTongji(u) { //统计
    // debugger
    let that = this
    app.util.request({
      url: u,
      data: {
        member_id: member_id
      },
      success: function(a) {
        // debugger
        console.log("统计")
        console.log(a)
        if (a.data.code == 200) {
          that.setData({
            tongjiList: a.data.data
          })
        }
      },
      fail: function(a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  }
})
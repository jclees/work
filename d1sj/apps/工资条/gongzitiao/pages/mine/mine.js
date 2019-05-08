const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    winHeight: "",
    navActive: 1,
    currentTab: 0
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo,
      memberInfo: app.globalData.memberInfo
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 356 ;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow() {
    let that = this;
    let member_id = wx.getStorageSync("member_id");
    if (member_id) {
      that.setData({
        member_id: member_id,
      })
      that.getData(0)
    }
  },
  _jump: function(a) {
    debugger
    app.getFormId(this, a);
    console.log(a.currentTarget.dataset.url)
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: a.currentTarget.dataset.url,
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath,
          success(res) {
            console.log('打开文档成功')
          },
          fail(res) {
            console.log('合同链接错误')
          }
        })
      }
    })
  },
  getData(iswho) {
    let that = this,
      url;
    iswho == 0 ? url = '/pactsign/bankInfo' : url = '/pactsign/pactInfo';
    wx.showLoading({
      title: '加载中...',
    })
    common.get(url, {
      member_id: that.data.member_id
    }).then(res => {
      wx.hideLoading()
      console.log("我的")
      console.log(res)
      if (res.data.err_code == 0) {
        if (iswho == 0) {
          let data = res.data.result;
          that.setData({
            mineData: data
          })
        } else {
          that.setData({
            pactData: res.data.result
          })
        }
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    let that = this
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCor();
    that.getData(that.data.currentTab)
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    let that = this
    var cur = e.currentTarget.dataset.current;
    this.setData({
      currentTab: cur
    })
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
  }
})
const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
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
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (member_id) {
      that.setData({
        member_id: member_id,
      })
      that.getData(0)
    }
  },
  guanzhu(e) { //关注
    let that = this;
    let data = that.data.lists;
    let idx = e.currentTarget.dataset.idx;

    publicMethod.guanzhu(e, this, function(res) {
      debugger
      if(res.msg == "已关注"){
        data[idx].status = 1
      }else{
        data[idx].status = 0
      }
      that.setData({
        lists:data
      })
    })
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
    // !iswho ? url = '/pactsign/bankInfo' : url = '/pactsign/pactInfo';
    url = "/memberinfo/concernBusiness"
    wx.showLoading({
      title: '加载中',
    })
    common.get(url, {
      member_id: that.data.member_id,
      type: iswho
    }).then(res => {
      wx.hideLoading()
      console.log("我的关注")
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          lists: res.data.data
        })
        // !iswho ? that.setData({
        //   mineData: res.data.result
        // }) : that.setData({
        //   pactData: res.data.result
        // })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
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
    publicMethod.getFormId(e, this)
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
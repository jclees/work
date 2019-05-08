const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl

Page({
  data: {
    img_url: app.data.imgUrl,
    member_id: 1,
    swiperCurrent: 0,
    navActive: 1,
    showNav: true
  },
  onLoad: function() {
    let that = this
    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
  },
  onShow() {
    let that = this
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      that.setData({
        pop4: true
      })
    } else {
      that.setData({
        pop4: false
      })
    }
    that.getData()
  },
  getUserInfo: function(e) { //授权 获取个人信息
    let that = this
    app.globalData.userInfo = e.detail.userInfo
    common.post('/member/oauth', {
      code: that.data.loginData.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          pop4: false
        })
        console.log("授权成功")
        that.setData({
          member_id: res.data.member_id
        })
        wx.setStorageSync('member_id', that.data.member_id)
      }
    }).catch(e => {
      app.showToast({
        title: "/member/oauth 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getData() { //初始化数据
    let that = this
    //轮播图地址
    that.getBannerUrls()
    //朋友圈动态
    that.getwenzhang()
    //签到
    that.getSign()
    //弹框
    that.getConfig()
    //加社群弹窗信息
    that.getnShequn()
  },
  getConfig() {
    let that = this
    common.get('/member/getconfig', {}).then(result => {
      console.log("resultresultresult")
      console.log(result)
      that.setData({
        community: result.data.community,
        commendation_rules: result.data.commendation_rules,
        // pullgroup_img: result.data.pullgroup_img,
      })
      wx.setStorageSync('community', that.data.community);
      wx.setStorageSync('commendation_rules', that.data.commendation_rules);
      // wx.setStorageSync('pullgroup_img', that.data.pullgroup_img)

      // //分享图片
      // wx.setStorageSync('img_center', result.data.img_center);
      // wx.setStorageSync('img_fail', result.data.img_fail);
      // wx.setStorageSync('img_pk', result.data.img_pk);
      // wx.setStorageSync('img_win', result.data.img_win);
    });
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
  getwenzhang() { //朋友圈动态
    let that = this
    common.get('/getInfo', {
      member_id: that.data.member_id
    }).then(res => {
      console.log(res)
      console.log("朋友圈动态")
      if (res.data.code == 200) {
        that.setData({
          wenzData: res.data.lists
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/getInfo 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getSign() { //签到
    let that = this
    common.get('/sign/index', {
      member_id: that.data.member_id
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          signData: res.data
        })
        console.log("签到数据")
      }
    }).catch(e => {
      app.showToast({
        title: "/sign/index 接口获取数据失败",
      })
      console.log(e)
    })
  },
  savaSign() { //签到提交
    let that = this
    common.post('/sign/dosign', {
      member_id: that.data.member_id
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        app.showToast({
          title: res.data.msg,
          icon: 'success',
        })
        that.getSign()
        that.setData({
          pop1:false
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/sign/dosign 接口获取数据失败",
      })
      console.log(e)
    })
  },
  openHfmsg(e){
    let that = this
    let ind = e.currentTarget.dataset.curindex
    that.setData({
      ind: ind,
      pop3:true
    })
  },
  bindTextChange(e){
    let that = this
    that.setData({
      textVal: e.detail.value
    })
  },
  getnShequn() { //加社群弹窗信息
    let that = this
    common.get('/groupFrame', {}).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          shequnIntro: res.data.confGroup
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/groupFrame 接口获取数据失败",
      })
      console.log(e)
    })
  },
  addShequn(){
    let that = this
    common.get('/jionGroup', {
      member_id: that.data.member_id
    }).then(res => {
      console.log(res)
      if (res.data.code == 1001) {
        app.turnToPage('/pages/community/community')
      } else {
        that.setData({
          pop2:true
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/jionWechat 接口获取数据失败",
      })
      console.log(e)
    })
  },
  addWx() { //+微信提交
    let that = this
    let ind = that.data.ind
    common.post('/jionWechat', {
      member_id: that.data.member_id,
      be_member_id: that.data.wenzData[ind].member_id,
      information_id: that.data.wenzData[ind].information_id,
      intro: that.data.textVal,
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        app.showToast({
          title: res.data.msg,
          icon: 'success',
        })
        that.setData({
          pop3: false
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/jionWechat 接口获取数据失败",
      })
      console.log(e)
    })
  },
  swiperChange: function(e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  like(e) { //点赞
    let that = this
    let ind = e.currentTarget.dataset.curindex
    // that.setData({
    //   like: true
    // })
    common.get('/liker', {
      member_id: that.data.member_id,
      information_id: e.currentTarget.dataset.zxid
    }).then(res => {
      console.log("点赞")
      console.log(res)
      let zan = 'wenzData[' + ind + '].likerStatus';
      let zannums = 'wenzData[' + ind + '].likerNum';
      if (that.data.wenzData[ind].likerStatus == 1) {
        that.setData({
          [zan]: 0,
          [zannums]: that.data.wenzData[ind].likerNum -= 1
        })
      } else {
        that.setData({
          [zan]: 1,
          [zannums]: that.data.wenzData[ind].likerNum += 1
        })
      }
      // that.data.wenzData[ind].status = 1
      // if (!res.data.status) {
      //   app.showToast({
      //     title: res.data.msg,
      //   })
      //   return false
      // }



    }).catch(e => {
      app.showToast({
        title: "/liker 接口获取数据失败",
      })
      console.log(e)
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function(event) {// 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  onShareAppMessage: function(res) { //分享
    let that = this
    if (res.from === 'button') {
      return {
        title: '转发的币！！！',
        path: '/pages/index/index',
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log(res)
          common.get('/getGold', {
            member_id: that.data.member_id
          }).then(result => {
            console.log("111111111")
            console.log(result)
            if (result.data.status == 200) {
              wx.showToast({
                title: '获得金币' + gold,
                icon: 'success'
              })
              wx.setStorageSync('gold', wx.getStorageSync('gold') + wx.getStorageSync('shareGold'));
            }
          })
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '页面转发！！！',
      imageUrl: '',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    // wx.request({
    //   url: 'https://xxx/?page=0',
    //   method: "GET",
    //   header: {
    //     'content-type': 'application/text'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       moment: res.data.data
    //     });
    //     // 设置数组元素
    //     that.setData({
    //       moment: that.data.moment
    //     });
    //     console.log(that.data.moment);
    //     // 隐藏导航栏加载框
    //     wx.hideNavigationBarLoading();
    //     // 停止下拉动作
    //     wx.stopPullDownRefresh();
    //   }
    // })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
    // 页数+1
    // page = page + 1;
    // wx.request({
    //   url: 'https://xxx/?page=' + page,
    //   method: "GET",
    //   // 请求头部
    //   header: {
    //     'content-type': 'application/text'
    //   },
    //   success: function (res) {
    //     // 回调函数
    //     var moment_list = that.data.moment;

    //     for (var i = 0; i < res.data.data.length; i++) {
    //       moment_list.push(res.data.data[i]);
    //     }
    //     // 设置数据
    //     that.setData({
    //       moment: that.data.moment
    //     })
    //     // 隐藏加载框
    //     wx.hideLoading();
    //   }
    // })

  },


})
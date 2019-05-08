//index.js
//获取应用实例
const app = getApp();
let common = require('../../assets/js/common');
let intro = '大学毕业生姜爻在追查友人失踪案件中,意外得知自己本应在十年前就已死去的事实大学毕业生姜爻在追查友人失踪案件中,意外得知自己本应在十年前就已死去的事实'
let unfoldFlag = true
Page({
  data: {
    img_url: app.data.imgUrl,
    maskStatus: true, //授权框 状态 true显示 false隐藏
    signStatus:false
  },
  onLoad: function(options = {}) {
    let that = this
    let a = intro.substring(37)
    that.setData({
      intro: a + '...'
    })
  },
  onShow: function() {
    let that = this
    if (wx.getStorageSync('scrollTop')) {
      that.setData({
        scrollTop: wx.getStorageSync('scrollTop')
      })
    }
  },
  getUserInfo(e) { //授权
    var that = this
    that.setData({
      maskStatus: false,
      signStatus:true
    })
    // common.post('/member/oauth', {
    //   code: _this.data.loginData.code,
    //   encryptedData: e.detail.encryptedData,
    //   iv: e.detail.iv
    // }).then(res2 => {
    //   if (res2.data.code == 200) {
    //     console.log("授权成功")
    //     console.log(e)
    //     console.log(res2)
    //     if (res2.data.auth_msg == 1) { //是否部门授权
    //       wx.setStorageSync('depart_id', res2.data.depart_id)
    //     } else {
    //       _this.goLogin()
    //     }
    //     app.setUserInfoStorage(res2.data);
    //     _this.setData({
    //       maskStatus: false,
    //       image: e.detail.userInfo.avatarUrl,
    //       name: e.detail.userInfo.nickName,
    //       member_id: res2.data.member_id,
    //       depart: res2.data.depart,
    //       userInfo: res2.data,
    //       store: res2.data.store
    //     })
    //     wx.setStorageSync('image', e.detail.userInfo.avatarUrl)
    //     wx.setStorageSync('name', e.detail.userInfo.nickName)
    //     wx.setStorageSync('member_id', res2.data.member_id)
    //     wx.setStorageSync('depart', res2.data.depart)
    //     wx.setStorageSync('store', res2.data.store)
    //     wx.setStorageSync('userInfo', res2.data)
    //     // 获取金币数量
    //     _this.getMoney();
    //     _this.createHome();
    //     _this.getMemberSeason();
    //   }
    // }).catch(e => {
    //   console.log('数据获取失败')
    //   console.log(e)
    // })
  },
  scrollBottom: function (e) {
    console.log(111)
    wx.showNavigationBarLoading()
    setTimeout(function(){
      wx.hideNavigationBarLoading()
    },2000)
  },
  aaa: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    page = page + 1;
    wx.request({
      url: 'https://xxx/?page=' + page,
      method: "GET",
      // 请求头部
      header: {
        'content-type': 'application/text'
      },
      success: function (res) {
        // 回调函数
        var moment_list = that.data.moment;

        for (var i = 0; i < res.data.data.length; i++) {
          moment_list.push(res.data.data[i]);
        }
        // 设置数据
        that.setData({
          moment: that.data.moment
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    })

  },
  unfold(){
    let that = this
    if (unfoldFlag){
      that.setData({
        intro: intro,
        iconUnfold: 120
      })
      unfoldFlag =false
    }else{
      let a = intro.substring(37)
      console.log(a)
      that.setData({
        intro: a + '...',
        iconUnfold: 0
      })
      unfoldFlag = true
    }
  },
  openMl() {
    let that = this;
    that.setData({
      showMl: true
    })
  },
  closeMl() {
    let that = this;
    that.setData({
      showMl: false
    })
  },
  closeSign(){
    let that = this;
    that.setData({
      signStatus: false
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  // 跳转到登录验证
  goReadingBook() {
    app.turnToPage('../readingbook/readingbook')
  },
  // 跳转到个人中心
  jumpPerson() {
    wx.navigateTo({
      url: '../../pages/person/person'
    })
  },
  // 跳转到分享页面
  jumpShare() {
    wx.navigateTo({
      url: '../../pages/share/share'
    })
  },
  // 跳转到排位赛
  jumpBay() {
    wx.navigateTo({
      url: '../../pages/game/game'
    })
  },
  // 现金赛 
  cashmatch() {
    wx.navigateTo({
      url: '../../pages/cashmatch/cashmatch'
    })
  },
  // 排行榜
  jumpList() {
    wx.navigateTo({
      url: '../../pages/ranking/ranking'
    })
  },
  //分享
  onShareAppMessage: function(res) {
    let that = this;
    let user_info = that.data.userInfo;
    console.log('user_info');
    console.log(user_info);
    if (res.from === 'button') {

      this.createHome();

      console.log("xiaheng点击分享按钮是获取的当前最新home_id", wx.getStorageSync('home_id'));
      let home_id = wx.getStorageSync('home_id');
      let _path = '/pages/index/index?room_id=' + user_info.openid + '&to_client_id=' + user_info.openid + '&uid=' + user_info.member_id + '&is_fpk=1' + '&home_id=' + home_id;

      console.log(_path);
      // 来自页面内转发按钮
      console.log(res.target)
      console.log(_path)
      return {
        title: '想赢我？等你来战！',
        path: _path,
        imageUrl: wx.getStorageSync('img_pk'),
        success: function(res) {
          // 转发成功
          common.post('/member/shareAddGold', {
            member_id: wx.getStorageSync('member_id')
          }).then(result => {
            let gold = wx.getStorageSync('shareGold');
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
          that.data.is_sponsor = 1;
          console.log(res);
          wx.setStorageSync('is_sponsor', that.data.is_sponsor); //设置发起者标志
          that.setData({
            'is_sponsor': that.data.is_sponsor,
            'home_id': home_id
          });

          that.friendsPk({
            room_id: user_info.openid,
            to_client_id: user_info.openid,
            uid: user_info.member_id,
            home_id: home_id
          }); //分享成功后进入pk
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '想赢我？等你来战！',
      path: '/pages/index/index',
      imageUrl: wx.getStorageSync('img_center'),
      success: function(res) {
        // 转发成功        // 分享获得金币
        common.post('/member/shareAddGold', {
          member_id: wx.getStorageSync('member_id')
        }).then(result => {
          let gold = wx.getStorageSync('shareGold');
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
})
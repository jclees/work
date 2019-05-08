//index.js
//获取应用实例
const app = getApp();
let common = require('../../assets/js/common');

Page({
  data: {
    home_id: 0,
    img_url: app.data.url,
    userInfo: {},
    maskStatus: false, //授权框 状态 true显示 false隐藏
    xdMsgStatus: false,
    is_sponsor: 0,
    home_type: 0,
    loginData: {} //登录数据
  },
  onLoad: function (options = {}) {
    var _this = this;  
    // 调用登录接口重新获取好友的信息
    let is_fpk = typeof options.is_fpk != 'undefined' && options.is_fpk; //是否好友对战
    let home_id = typeof options.home_id != 'undefined' && options.home_id; //
    let _path = '/pages/duizhan/duizhan?room_id=' + options.room_id + '&to_client_id=' + options.to_client_id + '&uid=' + options.uid + '&is_fpk=1';
    if (is_fpk == 1 && options.uid) { //跳转对战
      let store = wx.getStorageSync('store')
      if (store && home_id) {
        common.get('/pk/homeStatus', {
          home_id: home_id
        }).then(res => {
          this.setData({
            home_type: res.data.homeStatus
          })
          console.log('111111111111111111');
          console.log(res);
          if (res.data.homeStatus == 0) {
            console.log('33333333333333');
            
            //wx.setStorageSync('is_auto_answer',1);//自动答
            _path = _path + '&is_auto_answer=' + options.is_auto_answer + '&home_id=' + home_id;
            console.log("跳转duizhan链接");
            
            console.log(_path);
            app.turnToPage(_path);
          } else {
            // if (data.sponsor_flag == 1) {
            //   app.turnToPage(_path);
            // } else {
            console.log('房间失效')
            app.turnToPage('/pages/likai/likai');
            // }
          }
        }).catch(e => {
          console.log(2222222222222222);
          console.log('没有获取到房间状态');
        })
      }
    }
  },
  onShow: function() {
    let _this = this
    wx.login({
      success: function (data) {
        _this.setData({
          loginData: data
        })
      }
    })
    wx.setStorageSync('room_id');
    let is_sponsor = this.data.is_sponsor ? this.data.is_sponsor : wx.getStorageSync('is_sponsor');
    this.setData({
      'is_sponsor': is_sponsor
    });
    this.getConfig()

    //重新授权
    let isSuccYz = wx.getStorageSync('isSuccYz')
    let member_id = wx.getStorageSync('member_id')
    
    if (isSuccYz == 1) { //login页面是否验证完部门 1否 2 是
      this.setData({
        isSuccYz: isSuccYz,
        maskStatus: true
      })
      return false
    }else{
      if (member_id) {
        this.setData({
          member_id: member_id,
          maskStatus: false,
          image: wx.getStorageSync('image'),
          name: wx.getStorageSync('name'),
          depart: wx.getStorageSync('depart'),
          store: wx.getStorageSync('store')
        })
        this.createHome()
        this.getMemberSeason()
        this.getMoney()
      } else {
        this.setData({
          maskStatus: true
        })
      }
    }
  },
  getConfig() {
    var _this = this
    common.get('/getconfig', {}).then(result => {
      console.log("resultresultresult")
      console.log(result)
      _this.setData({
        // paiweiNum: result.data.paiweiNum,
        shareGold: result.data.shareGold,
        paiweiStart: result.data.startDate,
        paiweiEnd: result.data.endDate,
        img_center: result.data.img_center,
        img_fail: result.data.img_fail,
        img_pk: result.data.img_pk,
        img_win: result.data.img_win,
        tip: result.data.tip
      })
      wx.setStorageSync('shareGold', result.data.shareGold);
      wx.setStorageSync('paiweiStart', result.data.startDate);
      wx.setStorageSync('paiweiEnd', result.data.endDate)

      //分享图片
      wx.setStorageSync('img_center', result.data.img_center);
      wx.setStorageSync('img_fail', result.data.img_fail);
      wx.setStorageSync('img_pk', result.data.img_pk);
      wx.setStorageSync('img_win', result.data.img_win);
    });
  },
  
  getUserInfo: function(e) { //授权
  console.log(e)
    var _this = this
    app.globalData.userInfo = e.detail.userInfo
    common.post('/member/oauth', {
      code: _this.data.loginData.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(res2 => {
      if (res2.data.code == 200) {
        console.log("授权成功")
        console.log(e)
        console.log(res2)
        if (res2.data.auth_msg == 1) { //是否部门授权
          wx.setStorageSync('depart_id', res2.data.depart_id)
        } else {
          _this.goLogin()
        }
        app.setUserInfoStorage(res2.data);
        _this.setData({
          maskStatus: false,
          image: e.detail.userInfo.avatarUrl,
          name: e.detail.userInfo.nickName,
          member_id: res2.data.member_id,
          depart: res2.data.depart,
          userInfo: res2.data,
          store: res2.data.store
        })
        wx.setStorageSync('image', e.detail.userInfo.avatarUrl)
        wx.setStorageSync('name', e.detail.userInfo.nickName)
        wx.setStorageSync('member_id', res2.data.member_id)
        wx.setStorageSync('depart', res2.data.depart)
        wx.setStorageSync('store', res2.data.store)
        wx.setStorageSync('userInfo', res2.data)
        // 获取金币数量
        _this.getMoney();
        _this.createHome();
        _this.getMemberSeason();
      }
    }).catch(e => {
      console.log('数据获取失败')
      console.log(e)
    })
  },
  getMemberSeason() {
    let _this = this
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log('已经授权')
              console.log(res.userInfo)
              console.log(res)
              _this.setData({
                image: res.userInfo.avatarUrl,
                name: res.userInfo.nickName
              })
              wx.setStorageSync('image', res.userInfo.avatarUrl);
              wx.setStorageSync('name', res.userInfo.nickName);
            }
          })
        }
      }
    })
    common.post('/setMemberSeason', {
      member_id: _this.data.member_id,
      nickname: _this.data.name,
      avatar: _this.data.image
    }).then(res => {}).catch(res => {
      console.log('数据获取失败', res)
    })
  },
  getMoney() { //用户信息
    console.log("111111111111")
    console.log(this.data.member_id)
    common.get('/member/info', {
      member_id: this.data.member_id
    }).then(res => {
      console.log("info")
      console.log(res)
      if (res.data.member_id != "kong"){
        this.setData({
          gold: res.data.gold,
          grade: res.data.grade,
          rate: res.data.rate,
        })
        wx.setStorageSync('grade', res.data.grade)
        wx.setStorageSync('gold', res.data.gold)
        wx.setStorageSync('rate', res.data.rate)
      }else{
        wx.clearStorageSync()
        _this.setData({
          maskStatus: true
        })
      }
    }).catch(res => {
      console.log("422了")
      console.log(res)
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  friendpk() { //创建房间
    const that = this;
    if (wx.getStorageSync('member_id')) {
      common.post('/pk/createhome', {
        member_id: wx.getStorageSync('member_id'),
      }).then(res => {
        wx.hideLoading();
        if (res.data.home_id) {
          that.setData({
            home_id: res.data.home_id
          })
          wx.setStorageSync('home_id', res.data.home_id)
          console.log('创建时候的home_id');
          console.log(wx.getStorageSync('home_id'));
        }
      }).catch(res => {
        console.log('房间创建失败', res);
        wx.showToast({
          title: "房间创建失败",
          icon: "none",
          success: function() {}
        })
      })
    }
  },
  friendsPk: function(params = {}) {
    let room_id = 0;
    let to_client_id = 0;
    let home_id = this.data.home_id;
    if (params.room_id && params.to_client_id) {
      room_id = params.room_id;
      to_client_id = params.to_client_id;
    } else {
      room_id = wx.getStorageSync('client_id');
      to_client_id = wx.getStorageSync('client_id');
    }
    debugger
    //room_id = 'o8MwD5tehCKiWle6wTsSYGIvB6DU';
    //to_client_id = 'o8MwD5tehCKiWle6wTsSYGIvB6DU';
    console.log(room_id);
    app.turnToPage('/pages/duizhan/duizhan?room_id=' + room_id + '&to_client_id=' + to_client_id + '&is_fpk=1' + '&home_id=' + home_id);
  },
  //创建对战房间
  createHome: function() {
    let that = this;
    common.post('/pk/createhome', {
      member_id: wx.getStorageSync('member_id')
    }).then(res => {
      wx.hideLoading();
      if (res.data.home_id) {
        that.setData({
          home_id: res.data.home_id
        })
        wx.setStorageSync('home_id', res.data.home_id)
        console.log('xiaheng创建的home_id');
        console.log(wx.getStorageSync('home_id'));
      }
    }).catch(res => {
      console.log('房间创建失败', res);
    })
  },
  openxdMsg() { //打开小道消息弹框
    let _this = this
    _this.setData({
      xdMsgStatus: true
    })
  },
  xdMsgClose() { //关闭小道消息弹框
    let _this = this
    _this.setData({
      xdMsgStatus: false
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  // 跳转到登录验证
  goLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
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
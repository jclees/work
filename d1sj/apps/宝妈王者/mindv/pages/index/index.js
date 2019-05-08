//index.js
//获取应用实例
const app = getApp();
let common = require('../../assets/js/common');

Page({
  data: {
    isShowToast: false,
    member_id: 0,
    home_id: 0,
    img_url: app.data.url,
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_sponsor: 0,
    home_type: 0,
    shareGold: '',
    experience: '',
    yunying: false,
    to_client_id: '',
    start: 0,
    image: '',
    name: '',
    gold: '',
    grade: ''
  },
  onShow: function() {
    let _this = this;
    wx.setStorageSync('room_id');
    let is_sponsor = this.data.is_sponsor ? this.data.is_sponsor : wx.getStorageSync('is_sponsor');
    this.setData({
      'is_sponsor': is_sponsor
    });
    common.get('/special/takeNum', {}).then(res => {
      _this.setData({
        takeNum: res.data
      });
    });

    // this.getMoney();

    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang: "zh_CN",
            success: function(res) {
              console.log('res', res.userInfo)
              common.get('/member/infoIndex', {
                member_id: wx.getStorageSync('member_id'),
                nickname: res.userInfo.nickName,
                avatar: res.userInfo.avatarUrl,
              }).then(res2 => {
                console.log('res2', res2.data.res)
                _this.setData({
                  avatar: res2.data.res.avatar,
                  gold: res2.data.res.gold,
                  grade: res2.data.res.grade,
                  graderate: res2.data.res.graderate,
                  experience: res2.data.res.experience,
                  nickname: res2.data.res.nickname,
                });
                wx.setStorageSync('userInfo', res2.data.res);
                wx.setStorageSync('grade', res2.data.res.grade);
                wx.setStorageSync('gold', res2.data.res.gold);
                wx.setStorageSync('graderate', res2.data.res.graderate);
                wx.setStorageSync('experience', res2.data.res.experience);
              }).catch(e => {
                console.log('infoIndex连接错误')
              })
            }

          })
        }
      }
    })
    //用户返回再次刷新（作用：重新授权返回刷新）
    this.onLoad();
  },
  onLoad: function(options = {}) {
    var _this = this;
    // wx.showLoading({
    //   title: '加载中',
    // })

    _this.setData({
      image: wx.getStorageSync('image'),
      name: wx.getStorageSync('name'),
      gold: wx.getStorageSync('gold'),
      grade: wx.getStorageSync('grade'),
      experience: wx.getStorageSync('experience')
    })
    //重新授权
    if (app.globalData.userInfo) {
      _this.getUser();
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {

      _this.getUser();
      if (!wx.getStorageSync('userInfo')) {
        this.setData({
          hasUserInfo: false
        });
      }

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        _this.getUser();
        this.setData({
          userInfo: wx.getStorageSync('userInfo'),
          hasUserInfo: true
        })
      }
    } else {

      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          _this.getUser();
          this.setData({
            userInfo: wx.getStorageSync('userInfo'),
            hasUserInfo: true
          })

          // wx.setStorageSync(app.globalData.userInfo, res.userInfo)
          this.onLoad();
        }
      })
    }

    wx.setStorageSync('room_id', options.room_id);
    let is_fpk = typeof options.is_fpk != 'undefined' && options.is_fpk; //是否好友对战
    let home_id = typeof options.home_id != 'undefined' && options.home_id; //

    let _path = '/pages/duizhan/duizhan?room_id=' + options.room_id + '&to_client_id=' + options.to_client_id + '&uid=' + options.uid + '&is_fpk=1';
    if (is_fpk == 1 && options.uid) { //跳转对战
      common.post('/rankinglist/makefriends', {
        member_id: wx.getStorageSync('member_id'),
        friend_id: options.uid
      }).then(res => {
        let data = res.data;

        if (home_id) {
          common.get('/pk/homeStatus', {
            home_id: home_id
          }).then(res => {
            this.setData({
              home_type: res.data.homeStatus,
              to_client_id: options.to_client_id
            })
            if (res.data.homeStatus == 0) {
              //wx.setStorageSync('is_auto_answer',1);//自动答
              _path = _path + '&is_auto_answer=' + options.is_auto_answer + '&home_id=' + home_id;

              app.turnToPage(_path);
            } else {

              // if ((typeof wx.getStorageSync('to_client_id') != '' && options.to_client_id == wx.getStorageSync('to_client_id')) || _this.data.is_sponsor == 1) {
              //   wx.setStorageSync('to_client_id', '');
              //   _this.setData({
              //     is_sponsor: 0
              //   });
              //   wx.showModal({
              //     title: '提示',
              //     content: '错误操作，房间失效！',
              //     showCancel: false,
              //     success: function (res) {
              //       if (res.confirm) {
              //       } else if (res.cancel) {
              //       }
              //     }
              //   })
              //   return;
              // }
              _path = '/pages/likai/likai?home_id=' + home_id;
              app.turnToPage(_path);

            }

          }).catch(e => {})
        }

      }).catch(e => {})


    }

    common.get('/getconfig', {}).then(result => {
      _this.setData({
        paiweiNum: result.data.paiweiNum,
        shareGold: result.data.shareGold,
        paiweiStart: result.data.paiweiStart,
        paiweiEnd: result.data.paiweiEnd,
        img_center: result.data.img_center,
        img_center2: result.data.img_center2,
        img_pk: result.data.img_pk,
        img_shop: result.data.img_shop,
        img_win: result.data.img_win,
        img_lost: result.data.img_lost,
        img_index: result.data.img_index,
        start: result.data.start
      })
      wx.setStorageSync('start', result.data.start);
      wx.setStorageSync('shareGold', result.data.shareGold);
      wx.setStorageSync('paiweiStart', result.data.paiweiStart);
      wx.setStorageSync('paiweiEnd', result.data.paiweiEnd)
      //分享图片
      wx.setStorageSync('img_center', result.data.img_center);
      wx.setStorageSync('img_center2', result.data.img_center2);
      wx.setStorageSync('img_pk', result.data.img_pk);
      wx.setStorageSync('img_shop', result.data.img_shop);
      wx.setStorageSync('img_win', result.data.img_win);
      wx.setStorageSync('img_lost', result.data.img_lost);
      wx.setStorageSync('img_index', result.data.img_index)

    });

    common.get('/special/takeNum', {}).then(res => {
      _this.setData({
        takeNum: res.data
      });
    });


  },
  getUserInfo: function(e) {
    let _this = this;
    this.getUser();
    this.onLoad();
  },
  getUser() {
    let that = this;
    wx.login({
      success: function(data) {
        wx.getUserInfo({
          lang: "zh_CN",
          success: function(res) {
            common.post('/member/oauth', {
              code: data.code,
              encryptedData: res.encryptedData,
              iv: res.iv
            }).then(res2 => {
              // debugger
              if (res2.data.code == 200) {
                that.setData({
                  hasUserInfo: true,
                  image: res2.data.avatar,
                  name: res2.data.nickname,
                  member_id: res2.data.member_id,
                  userInfo: res2.data,
                  gold: res2.data.gold,
                  grade: res2.data.grade
                })

                wx.setStorageSync('member_id', res2.data.member_id)
                wx.setStorageSync('image', res2.data.avatar)
                wx.setStorageSync('name', res2.data.nickname)
                wx.setStorageSync('userInfo', res2.data)
                wx.setStorageSync('gold', res2.data.gold)
                wx.setStorageSync('grade', res2.data.grade)

                app.setUserInfoStorage(res2.data);
                // app.globalData.userInfo = wx.getStorageSync('userInfo');
                //获取首页用户金币和等级
                // that.getinfoIndex();
                // that.friendpk()
                // 获取金币数量
                that.createHome();
                that.getMoney();

              }
            })
          },
          fail: function(res) {
            wx.getSetting({
              success: (res) => {

                // wx.openSetting({
                //   success: (res) => {
                //     if (!res.authSetting["scope.userInfo"]) {
                //       res.authSetting = {
                //         "scope.userInfo": true,
                //         // "scope.userLocation": true
                //       }
                //     }

                //   }
                // })

              }
            })
          }
        })
      }
    })

  },
  onReady: function() {

    // wx.hideLoading()
  },


  getMoney() {
    common.get('/memberinfo', {
      member_id: this.data.member_id
    }).then(res => {
      this.setData({
        person: res.data,
        graderate: res.data.graderate,
        experience: res.data.experience,
      })
      wx.setStorageSync('person', res.data)
      wx.setStorageSync('graderate', res.data.graderate)
      wx.setStorageSync('experience', res.data.experience)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  pop() {
    wx.showModal({
      title: '',
      content: '静待开放',
      showCancel: false,
      confirmColor: "#333"
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
  // 商店
  shop() {
    wx.navigateTo({
      url: '../../pages/shop/shop'
    })
  },
  // 题目工厂
  answer() {
    wx.navigateTo({
      url: '../../pages/answer/answer',
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
        }
      }).catch(res => {
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
    };
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
      }
    }).catch(res => {})
  },
  openYunYing() {
    this.setData({
      yunying: true
    });
  },
  closeYunYing() {
    this.setData({
      yunying: false
    });
  },
  //分享
  onShareAppMessage: function(res) {
    let that = this;



    let user_info = that.data.userInfo;
    //let _path = '/pages/duizhan/duizhan?room_id='+user_info.openid+'&to_client_id='+user_info.openid+'&uid='+user_info.id+'&is_fpk=1';


    if (res.from === 'button') {

      that.createHome();

      let home_id = wx.getStorageSync('home_id');
      let _path = '/pages/index/index?room_id=' + user_info.openid + '&to_client_id=' + user_info.openid + '&uid=' + user_info.member_id + '&is_fpk=1' + '&home_id=' + home_id;


      // 来自页面内转发按钮


      return {
        title: that.data.name + '正在发起妈咪答题挑战，来一决胜负！',
        path: _path,
        imageUrl: wx.getStorageSync('img_pk'),
        success: function(res) {
          // 转发成功
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
          that.data.is_sponsor = 1;

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
      title: that.data.name + '正在与妈咪大咖对战，快来围观！',
      path: '/pages/index/index',
      imageUrl: wx.getStorageSync('img_index'),
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
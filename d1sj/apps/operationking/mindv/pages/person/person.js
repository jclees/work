// pages/person/person.js
const app = getApp()
let common = require('../../assets/js/common');
var radarChart = null;
var Charts = require('../../utils/pengjincarts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isShowToast: false,
    img_url: app.data.url,
    popShareGold: false
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      member_id: wx.getStorageSync('member_id'),
      shareGold: wx.getStorageSync('shareGold'),
    })
    // 获取个人中心信息
    this.getPerson();
  },
  onReady: function() {
    var userInfos = wx.getStorageSync('person')
    var vm = this
    var userTitle = []
    var userNumber = []
    userInfos.topic_index.forEach((val, i) => {
      userTitle.push(val.name)
      userNumber.push(val.scale)
    })
    radarChart = new Charts({
      canvasId: 'radarCanvas',
      type: 'radar',
      categories: userTitle,
      series: [{
        name: '用户雷达图',
        data: userNumber,
      }],
      width: 238,
      height: 238,
      fontColor: 'black',
      extra: {
        radar: {
          max: 80,
          labelColor: 'black'
        },
        legendTextColor: 'black'
      }
    });
  },
  // 转发接口
  onShareAppMessage: function(res) {
    let _this = this
    let _name = wx.getStorageSync('name');
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: _name + '正在与运营大咖对战，快来围观！',
        path: '/pages/person/person',
        imageUrl: wx.getStorageSync('img_center'),
        success: function(res) {
          // 转发成功
          // 分享获得金币
          common.post('/member/shareAddGold', {
            member_id: wx.getStorageSync('member_id')
          }).then(result => {
            let gold = wx.getStorageSync('shareGold');
            if (result.data.status == 200) {
              wx.setStorageSync('gold', wx.getStorageSync('gold') + wx.getStorageSync('shareGold'));
              _this.setData({
                popShareGold: true
              });
            } else if (result.data.status == 403) {
              console.log('分享获得金币次数已达上限');
            }
          }).catch(e => {

          });
          // console.log(res)
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: _name + '正在与运营大咖对战，快来围观！',
      path: '/pages/index/index',
      imageUrl: wx.getStorageSync('img_center'),
      success: function(res) {
        // 转发成功
        // 分享获得金币
        common.post('/member/shareAddGold', {
          member_id: wx.getStorageSync('member_id')
        }).then(result => {
          let gold = wx.getStorageSync('shareGold');
          if (result.data.status == 200) {
            wx.setStorageSync('gold', wx.getStorageSync('gold') + wx.getStorageSync('shareGold'));
            _this.setData({
              popShareGold: true
            });
          } else if (result.data.status == 403) {
            console.log('分享获得金币次数已达上限');
          }
        }).catch(e => {

        });
        // console.log(res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  // 跳转到分享页面
  jumpShare() {
    wx.redirectTo({
      url: '../../pages/share/share'
    })
  },

  //关闭得金币弹出
  closeShareGold() {
    this.setData({
      popShareGold: false
    });
  },

  paiwei1: function(e) {
    this.setData({
      popShareGold: false
    });
    app.turnToPage('/pages/game/game');
  },


  // 获取个人中心的信息
  getPerson() {
    common.get('/memberinfo', {
      member_id: this.data.member_id
    }).then(res => {
      this.setData({
        person: res.data
      })
      console.log(this.data.person)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  }
})
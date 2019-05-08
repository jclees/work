// pages/share/share.js、
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
    imgUrl: '',
    member_id: '',
    defaultImg: '',
    img_url: app.data.url,
    popShareGold: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      member_id: wx.getStorageSync('member_id')
    }),
      this.getImgUrl();
  },
  onReady: function () {
    var userInfos = wx.getStorageSync('person')
    this.setData({
      userInfo: userInfos
    })
    var vm = this
    var userTitle = []
    var userNumber = []

    userInfos.topic_index.forEach((val, i) => {
      userTitle.push(val.name)
      userNumber.push(val.scale)
    })
    
    console.log(userTitle) //['文艺', '流行', '娱乐', '生活', '理科', '文科']
    console.log(userNumber) //[90, 80, 75, 95, 87, 60]
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
      fontColor: 'white',
      extra: {
        radar: {
          max: 80,
          labelColor: 'white'
        },
        legendTextColor: 'white'
      }
    });
  },


  //关闭得金币弹出
  closeShareGold() {
    this.setData({
      popShareGold: false
    });
  },

  paiwei1: function (e) {
    this.setData({
      popShareGold: false
    });
    app.turnToPage('/pages/game/game');
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let _name = wx.getStorageSync('name');
    return {
      title: _name + '正在与运营大咖对战，快来围观！',
      path: '/pages/index/index',
      imageUrl: wx.getStorageSync('img_center2'),
      success: function (res) {
        // 分享获得金币
        common.post('/member/shareAddGold', {
          member_id: wx.getStorageSync('member_id')
        }).then(result => {
          let gold = wx.getStorageSync('shareGold');
          if (result.data.status == 200) {
            wx.setStorageSync('gold', wx.getStorageSync('gold') + wx.getStorageSync('shareGold'));
            that.setData({
              popShareGold: true
            });
          } else if (result.data.status == 403) {
            console.log('分享获得金币次数已达上限');
          }
        }).catch(e => {

        });
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  jumpIndex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  getImgUrl: function () {
    let _this = this;
    common.get('/getSaveAlbumImg', {
      member_id: _this.data.member_id
    }).then(res => {
      // console.log(res.data)
      _this.setData({
        defaultImg: res.data
      })
    });
  },
  saveImg: function () {
    let _this = this;
    _this.getImgUrl();
    // console.log(_this.data)
    let defaultImg = _this.data.defaultImg;
    console.log(defaultImg);
    wx.getSetting({
      success(res) {
        // if (res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            console.log(`成功`);
            console.log(defaultImg);
            wx.getImageInfo({
              src: defaultImg,
              success: function (ret) {
                var path = ret.path;
                wx.saveImageToPhotosAlbum({
                  filePath: path,
                  success(result) {
                    console.log(result)
                    wx.showToast({
                      title: '图片保存成功',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                })
              }
            })
            // 用户已经同意小程序使用保存到相册功能
          },
          fail: function (res) {
            wx.getSetting({
              success: (res) => {
                console.log(res);
                wx.openSetting({
                  success: (res) => {
                    if (!res.authSetting["scope.writePhotosAlbum"]) {
                      res.authSetting = {
                        "scope.writePhotosAlbum": true
                      }
                    }
                  }
                })

              }
            })
          }
        })
        // }
      }
    })
  },
  // saveImg: function () {
  //   wx.downloadFile({
  //     url: "https://mindking.network.weixingzpt.com/imgs/pk_bgc.png",
  //     success: function (res) {
  //       wx.saveImageToPhotosAlbum({
  //         filePath: res.tempFilePath,
  //         success: function (res) {
  //           console.log(res);
  //         },
  //         fail: function (res) {
  //           console.log(res);
  //         }
  //       })
  //     }
  //   })
  // }
})
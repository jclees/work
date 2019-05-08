// pages/ranking/ranking.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    list: [],
    img_url: app.data.url,
    showView: false,
    friendNum: 0
  },

  showList: function (e) {

    switch (+e.target.dataset.type) {
      case 0:
        //世界
        this.setData({
          active: 0
        });
        this.getWorld();
        break;
      case 1:
        //好友
        this.setData({
          active: 1
        })
        this.getFriend();
        break;
      case 2:
        //好友
        this.setData({
          active: 2
        })
        this.getRegion();
        break;
      default:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getStorage({
      key: "member_id",
      success: function (res) {
        that.setData({
          member_id: res.data
        }),

          common.get('/rankinglist/getfriendNum', {
            member_id: res.data
          }).then(res => {
            that.setData({
              friendNum: res.data.num
            })
            if (res.data.num == 0) {
              that.setData({
                active: 0
              });
              that.getWorld();
            } else {
              that.setData({
                active: 1
              });
              that.getFriend();
            }
          })


      }
    })
    //     //获取位置信息
    //   wx.getLocation({
    //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //     success: function (res) {
    //       var latitude = res.latitude
    //       var longitude = res.longitude
    //       wx.openLocation({
    //         latitude: latitude,
    //         longitude: longitude,
    //         scale: 28
    //       })
    //     }
    //   })
  },
  getFriend: function () {
    const that = this;
    common.get("/rankinglist/friendlist?member_id=" + this.data.member_id, {}).then(res => {
      if (res.statusCode === 200 && res.data.data.length > 0) {

        that.setData({
          list: res.data.data || []
        })

      }
    }).catch(res => {
      that.setData({
        list: []
      })
    })
  },
  getWorld: function () {
    const that = this;
    common.get("/rankinglist/worldlist", {}).then(res => {

      if (res.statusCode === 200 && res.data.data.length > 0) {

        that.setData({
          list: res.data.data || []
        })
      }
    }).catch(res => {
      that.setData({
        list: []
      })
    })
  },
  getRegion: function () {
    const that = this;
    common.get("/rankinglist/worldlist", {}).then(res => {

      if (res.statusCode === 200 && res.data.data.length > 0) {

        that.setData({

        })
      }
    }).catch(res => {
      that.setData({
        list: []
      })
    })
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

})
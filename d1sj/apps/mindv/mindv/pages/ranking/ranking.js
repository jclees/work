// pages/ranking/ranking.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [],
    img_url: app.data.url,
    showView: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
    that.getData('/rankinglist/rankList', { member_id: this.data.member_id }, 0)
  },
  showList(e) {
    switch (+e.target.dataset.type) {
      case 0:
        //综合
        this.setData({
          active: 0
        });
        this.getData('/rankinglist/rankList', { member_id: this.data.member_id }, 0);
        break;
      case 1:
        //技能
        this.setData({
          active: 1
        })
        this.getData('/rankinglist/sportList', { member_id: this.data.member_id }, 1);
        break;
      case 2:
        //门店
        this.setData({
          active: 2
        })
        this.getData('/rankinglist/storeList', { member_id: this.data.member_id},2);
        break;
      default:
        break;
    }
  },
  getData(url, param, flag){
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    common.get(url, param).then(res => {
      wx.hideLoading()
      console.log("========");
      console.log(res);
      if (res.data.code == 403) {
        that.setData({
          flag: flag
        })
      } else {
        if (res.statusCode === 200 && res.data.result.length > 0) {
          // console.log(res.data)
          that.setData({
            list: res.data.result || []
          })
        }
      }
    }).catch(res => {
      that.setData({
        list: []
      })
    })
  }
})
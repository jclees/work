// pages/status/status.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    member_id: 0,
    auditList: [],
    passList: [],
    noPassList: [],
    img_url: app.data.url
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
        });
         that.getList(0);
      }
    })
  },

  // 点击tab栏切换页面
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      });
      that.getList(e.currentTarget.dataset.current);
     
    }
  },
  getList: function (type) {
    const that = this;
    common.get('/question/myquestion', {
      member_id: that.data.member_id,
      status: +type + 1
    }).then(res => {
      if(type==0){
        that.setData({
          auditList: res.data.data
        })
      }else if(type==1){
        that.setData({
          passList: res.data.data
        })
        console.log(passList);
      }else{
        that.setData({
          noPassList: res.data.data
        })
      };
      // switch (type) {
      //   case 0:
      //     that.setData({
      //       auditList: res.data.data
      //     })
      //     console.log(auditList);
      //     break;
      //   case 1:
      //     that.setData({
      //       passList: res.data.data
      //     })
      //     console.log(passList);
      //     break;
      //   case 2:
      //     that.setData({
      //       noPassList: res.data.data
      //     })
      //     break;
      //   default:
      //     break;
      // }
    })
  },
  jumpQuestion: function () {
    wx.navigateTo({
      url: '../../pages/topic/topic'
    })
  },
  toNopass: function (e) {
    // console.log(e.target)
    // console.log(e.target.dataset);
    // console.log(e.target.dataset.bigclass.split(","));
    const className = e.target.dataset.bigclass.split(",") || [];
    wx.navigateTo({
      url: "../../pages/noPass/noPass?id=" + e.target.id + "&bigclass=" + className[0] + "&smallclass=" + className[1]
    })
  }
})
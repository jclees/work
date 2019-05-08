//获取应用实例
const app = getApp()
let common = require('../../assets/js/common');

Page({
  data: { // 参与页面渲染的数据
    logs: [],
    list: [],
    showView: true,
    img_url: app.data.url,
    popShareGold: false,
    shareGold: '',

  },
  onLoad: function (options) {
    showView: (options.showView == "true" ? true : false)
    // 页面渲染后 执行
    //获取宝箱信息 
    this.goodlists();
    //获取分享金币
    common.get('/getconfig', {
    }).then(result => {
      console.log(result)
      this.setData({
        shareGold: result.data.shareGold,
      })
    });
  },
  goodlists: function () {
    const _this = this;
    common.get('/shop/goodLists', {}).then(res => {
      console.log(res.data.data);
      if (res.data.code === 200 && res.data.data.length > 0) {
        _this.setData({ list: res.data.data || [] })
      }
    })
  },
  onChangeShowState: function (e) {
    var index = e.currentTarget.dataset.key;
    var list = this.data.list[index];
    var that = this;
    that.setData({
      name: list.name,
      price: list.price,
      icon: list.icon,
      desc: list.desc,
      showView: (!that.data.showView),
    });
  },
  hide: function () {
    const h = this;
    h.setData({
      showView: (!h.data.showView),
    });
  },
  pop() {
    wx.showModal({
      title: '',
      content: '静待开放',
      showCancel: false,
      confirmColor: "#333"
    })
  },
  // 跳转到分享页面
  jumpShare() {
    wx.navigateTo({
      url: '../../pages/share/share'
    })
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

  onShareAppMessage: function () {
    let that = this;
    return {
      title: '看看你的运营知识在群里能排第几？',
      path: '/pages/index/index',
      imageUrl: wx.getStorageSync('img_shop'),
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
    }
  },
})

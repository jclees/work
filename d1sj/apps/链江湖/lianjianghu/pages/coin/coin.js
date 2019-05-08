// pages/coin/coin.js
const app = getApp();
const common = require('../../assets/js/common');

Page({
  data: {
    img_url: app.data.imgUrl,
    inputValue: '' //兑换币实时输入个数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })
    that.getData()
  },
  onShow(){
    let that = this
    app.navStatus(that, 2, { member_id: that.data.member_id })//能否发表文章
  },
  getData() { //初始化数据
    let that = this
    //兑币列表
    that.getCoinList()
  },
  getCoinList() { //兑币列表
    let that = this
    common.get('/currency/lists', {}).then(res => {
      console.log("兑币列表")
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          coinListData: res.data.data
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/currency/lists 接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  getCoinPop(e) { //兑币详情
    let that = this
    let ind = e.currentTarget.dataset.index
    that.setData({
      id: that.data.coinListData[ind].id,
      ind: ind
    })
    common.get('/currency/show', {
      id: that.data.id
    }).then(res => {
      console.log("兑币弹框")
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          pop1: true,
          coinPopData: res.data.data
        });
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/currency/lists 接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  savaData() { //兑币提交
    let that = this
    common.post('/currency/notesSubmit', {
      member_id: that.data.member_id,
      id: that.data.id,
      num: that.data.inputValue,
      address: that.data.addressValue
    }).then(res => {
      if (res.data.code == 200){
        app.showToast({
          title: res.data.msg,
        })
      }else{
        app.showToast({
          title: res.data.msg,
        })
      }
      this.setData({
        pop1: false,
        inputValue: 0
      });
    }).catch(e => {
      app.showToast({
        title: "/sign/dosign 接口获取数据失败",
      })
      console.log(e)
    })
  },
  popLock: function(event) {
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      inputValue: 0
    });
  },
  bindChangeInput: function(evevt) {
    this.setData({
      addressValue: evevt.detail.value
    })
  },
  bindKeyInput: function(evevt) {
    this.setData({
      inputValue: evevt.detail.value
    })
  },
})
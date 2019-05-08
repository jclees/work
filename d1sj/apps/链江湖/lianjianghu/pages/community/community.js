const app = getApp()
const common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: app.data.imgUrl,
    index: 0,
    address: [], //位置信息获取
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
  checkboxChange(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let val = e.detail.value

    if (id == 0) { //我是谁
      that.setData({
        myVal: val
      })
    } else if (id == 1) { //我想找谁
      that.setData({
        findVal: val
      })
    }

  },
  getData() {
    let that = this
    //社群问卷调查列表
    that.getCommunity()
  },
  getCommunity() { //社群问卷调查列表
    let that = this
    common.get('/setting/notes', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("get社群问卷调查列表")
      console.log(res)
      that.setData({
        communityData: res.data
      })
    }).catch(e => {
      app.showToast({
        title: "/setting/notes 接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  savaData() { //提交社群数据
    let that = this
    // if (!that.data.znrVal) {
    //   app.showToast({
    //     title: "请选择一个资内容类别",
    //   })
    //   return false
    // }
    common.post('/setting/addSubmit', {
      member_id: that.data.member_id,
      my_name: that.data.myName,
      find_name: that.data.findName
    }).then(res => {
      app.showToast({
        title: res.data.msg,
      })
    }).catch(e => {
      app.showToast({
        title: "/sign/dosign 接口获取数据失败",
      })
      console.log(e)
    })
    let myVal = that.data.myVal.toString()
    let findVal = that.data.findVal.toString()
    common.post('/setting/questionSubmit', {
      member_id: that.data.member_id,
      my_id: myVal,
      find_id: findVal,
      level_id: that.data.communityData.level[that.data.index].level_id,
      position: that.data.address.address,
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        app.showToast({
          title: res.data.msg,
        })
        that.setData({
          pop1: true,
          popData: res.data.data
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/setting/questionSubmit 接口获取数据失败",
      })
      console.log(e)
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindInputChange: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let val = e.detail.value
    if (id == 0) { //我是谁 其他
      that.setData({
        myName: val
      })
    } else if (id == 1) { //我想找谁 其他
      that.setData({
        findName: val
      })
    }
  },
  position: function() {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.chooseLocation({
          success: function(res1) {
            that.setData({
              address: res1
            });
            console.log(that.data.address);
          }
        })
      }
    })
  },
  popLock: function(event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
})
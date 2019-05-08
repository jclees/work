const app = getApp()
const common = require('../../assets/js/common');
Page({
  data: {
    img_url: app.data.imgUrl,
    index:0,
    index2:0,
    index3:0,
    contactId:1
  },
  onLoad: function(options) {
    let that = this
    if (options.code) {
      that.setData({
        code: options.code
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      sellProductData: app.globalData.sellProductData,
      ageData: app.curtail(app.globalData.ageData),
      typeData: app.curtail(app.globalData.typeData)
    })
    that.getData()
  },
  onShow() {
    let that = this
  },
  getData() { //初始化数据
    let that = this
    //附近取货点
    that.getNearList()
  },
  getNearList() { //附近取货点
    let that = this
    common.get('/index/nearList', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("附近取货点")
      console.log(res)
      if (res.data.code == 100) {
        let obj = {}
        obj.name = "附近取货点"
        res.data.data.lists.unshift(obj)
        that.setData({
          nearListData: res.data.data.lists
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/nearList 接口获取数据失败",
      })
      console.log(e)
    })
  },
  switchChange: function(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    let that = this
    if (e.detail.value) {
      that.setData({
        pickerStatus: true,
        contactId:2
      })
    } else {
      that.setData({
        pickerStatus: false,
        contactId: 1
      })
    }
  },
  bindPickerChange(e) { //所有picker index
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this
    let id = e.currentTarget.dataset.id
    let val = e.detail.value
    debugger
    if (id == 0) {
      that.setData({
        index: val
      })
    } else if (id == 1) {
      that.setData({
        index2: val
      })
    } else if (id == 2) {
      that.setData({
        index3: val
      })
    }
  },
  bindTextChange(e) {
    let that = this
    that.setData({
      textValue: e.detail.value
    })
  },
  // jumpProductDetails() {
  //   app.turnToPage('/pages/productDetails/productDetails')
  // },
  savaData() {
    let that = this
    let near_id
    if (that.data.pickerStatus){
      near_id = that.data.nearListData[that.data.index3].id
    }
    // debugger
    wx.showLoading({
      title: '发布中...',
    })
    common.post('/index/sueBook', {
      member_id: that.data.member_id,
      bar_code: that.data.code,
      name: that.data.sellProductData.title,
      intro: that.data.sellProductData.intro,
      price: that.data.sellProductData.price,
      img: that.data.sellProductData.img,
      recommend: that.data.textValue,
      type_id: that.data.typeData[that.data.index].id,
      age_id: that.data.ageData[that.data.index2].id,
      get_type: that.data.contactId,
      near_id: near_id
    }).then(res => {
      console.log("发布宝贝")
      console.log(res)
      wx.hideLoading()
      if (res.data.code == 100) {
        app.turnToPage('/pages/releaseSuccess/releaseSuccess?book_id=' + res.data.data.book_id)
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/sueBook 接口获取数据失败",
      })
      console.log(e)
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
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
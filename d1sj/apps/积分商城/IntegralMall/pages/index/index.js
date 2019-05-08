//index.js
//获取应用实例
let common = require('../../assets/js/common');
const app = getApp()
Page({
  data: {
    isShowToast: false,
    currentTab: 1,
    navList: [],
    imgUrls: [],
    shopList: [],
    classifyList: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    show: true,
    orderList: [],
    currentNav: 0,
    // secondClass:-1

    moneyTotal: 0,
    scoreTotal: 0,
    cartLists: [],
    cartAllsel: [{
      value: '全选',
      checked: !1
    }],
    editStatus: !1,
    numStatus: !0,
    isReset: 0 //子页面跳转是否刷新页面
  },
  //购物车列表数据
  getCart() {
    let _this = this;
    common.get('/car/lists', {
      member_id: this.data.member_id
    }).then(res => {
      console.log(res)
      let data = res.data.data;
      for (var i in data) {
        data[i].checked = !1
        for (var j in data[i].list) {
          data[i].list[j].checked = !1
        }
      }
      this.setData({
        cartLists: data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 添加到收藏
  like() {
    let _this = this;
    let data = this.data.cartLists;
    var ids = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].list.length; j++) {
        if (data[i].list[j].checked) {
          ids.push(data[i].list[j].id)
        }
      }
    }
    if (ids.length <= 0) {
      wx.showToast({
        title: '请选择要收藏的产品',
        icon: "none"
      })
      return
    }

    common.post('/collection/to_collect', {
      ids,
      member_id: _this.data.member_id
    }).then(res => {
      console.log("收藏")
      console.log(res)
      if (res.data.code == 200) {
        _this.setData({
          editStatus: !_this.data.editStatus
        })
        wx.showToast({
          title: '收藏成功'
        })
      }
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  //增加数量
  add(e) {
    let that = this;
    let curIdx = e.currentTarget.dataset.curidx;
    let shopidx = e.currentTarget.dataset.shopidx;
    let data = that.data.cartLists;
    let numStatus = that.data.numStatus;

    if (!numStatus) {
      return
    }
    that.setData({
      numStatus: !1
    })
    common.post('/car/update_num', {
      id: data[shopidx].list[curIdx].id,
      num: 1
    }).then(res => {
      that.setData({
        numStatus: !0
      })
      console.log("购物车增加数量")
      console.log(res)
      if (res.data.code == 200) {

        data[shopidx].list[curIdx].num++

          that.changePrice()
        that.setData({
          cartLists: data
        })
      }

    }).catch(res => {
      that.setData({
        numStatus: !0
      })
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })

  },
  //减少数量
  reduce(e) {
    let that = this;
    let curIdx = e.currentTarget.dataset.curidx;
    let shopidx = e.currentTarget.dataset.shopidx;
    let data = that.data.cartLists;
    let numStatus = that.data.numStatus;

    if (data[shopidx].list[curIdx].num <= 1) {
      return
    }
    if (!numStatus) {
      return
    }
    that.setData({
      numStatus: !1
    })
    common.post('/car/update_num', {
      id: data[shopidx].list[curIdx].id,
      num: -1
    }).then(res => {
      that.setData({
        numStatus: !0
      })

      console.log("购物车删除数量")
      console.log(res)
      if (res.data.code == 200) {
        data[shopidx].list[curIdx].num--
          that.changePrice()
        that.setData({
          cartLists: data
        })
      }



    }).catch(res => {
      this.setData({
        numStatus: !0
      })
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  //删除
  remove(e) {
    let that = this;
    let data = that.data.cartLists;

    var ids = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].list.length; j++) {
        if (data[i].list[j].checked) {
          ids.push(data[i].list[j].id)
        }
      }
    }
    if (ids.length <= 0) {
      wx.showToast({
        title: '请选择要删除的产品',
        icon: "none"
      })
      return
    }

    wx.showModal({
      title: '提示',
      content: '确认删除选中商品吗？',
      success: function(res) {
        if (res.confirm) {

          common.post('/car/delete', {
            ids
          }).then(res => {
            console.log("购物车删除")
            console.log(res)

            for (var i = 0; i < data.length; i++) {
              for (var j = 0; j < data[i].list.length; j++) {
                if (data[i].list[j].checked) {
                  if (data[i].list.length <= 1) {
                    that.setData({

                    })
                    data.splice(i, 1)
                    that.changePrice()
                    that.setData({
                      cartLists: data
                    })
                  }
                  data[i].list.splice(j--, 1)
                }
              }
            }
            that.changePrice()
            that.setData({
              cartLists: data,
              editStatus: !that.data.editStatus
            })

          }).catch(res => {
            let reason = [];
            for (let i in res.data.errors) {
              reason.push(res.data.errors[i][0])
            }
            app.showToast(reason[0] || res.data.message, _this, 2000)
          })

        }
      }
    })

  },
  //单选
  aloneSelect(e) {
    let that = this;
    let shopidx = e.currentTarget.dataset.shopidx;
    let curIdx = e.currentTarget.dataset.curidx;
    let data = that.data.cartLists;
    let cartAllsel = that.data.cartAllsel;
    let flag = true;

    data[shopidx].list[curIdx].checked = !data[shopidx].list[curIdx].checked

    for (var i in data) {
      for (var j in data[i].list) {
        if (!data[i].list[j].checked) {
          console.log("有false")
          flag = false
          break 
        }
      }
    }
    if (!flag){
      cartAllsel[0].checked = false
      data[shopidx].checked = false
    }else{
      cartAllsel[0].checked = true
      data[shopidx].checked = true
    }
    that.changePrice()
    that.setData({
      cartLists: data,
      cartAllsel
    })
  },
  //全选
  allSelect(e) {
    let that = this;
    let data = that.data.cartLists;
    let cartAllsel = that.data.cartAllsel;

    cartAllsel[0].checked = !cartAllsel[0].checked

    for (var i in data) {
      for (var j in data[i].list) {
        if (cartAllsel[0].checked) {
          data[i].list[j].checked = true
          data[i].checked = true
        } else {
          data[i].list[j].checked = false
          data[i].checked = false
        }
      }
    }
    that.changePrice()
    that.setData({
      cartAllsel,
      cartLists: data
    })
  },
  //根据商家全选
  allSelectShop(e) {
    let that = this;
    let curIdx = e.currentTarget.dataset.curidx;
    let data = that.data.cartLists;
    let cartAllsel = that.data.cartAllsel;
    cartAllsel[0].checked = !cartAllsel[0].checked

    data[curIdx].checked = !data[curIdx].checked
    for (var i in data[curIdx].list) {
      if (data[curIdx].checked) {
        data[curIdx].list[i].checked = true
      } else {
        data[curIdx].list[i].checked = false
      }
    }
    that.changePrice()
    that.setData({
      cartLists: data,
      cartAllsel
    })
  },
  //去结算
  jumpCartPay() {
    let that = this;
    let data = that.data.cartLists;
    var arr = [];
    var ids = "";
    for (var i in data) {
      for (var j in data[i].list) {
        if (data[i].list[j].checked) {
          arr.push(data[i].list[j].id)
        }
      }
    }
    ids = arr.join(',')

    if (arr.length <= 0) {
      wx.showToast({
        title: '请选择商品',
        icon: "none"
      })
      return
    }

    common.get('/car/to_order', {
      ids,
      member_id: that.data.member_id
    }).then(res => {
      console.log("订单信息")
      console.log(res)

      wx.setStorageSync("order", res.data)
      wx.navigateTo({
        url: '/pages/shoppingCart/pay/pay',
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })

  },
  edit(e) {
    let that = this,
      editStatus = that.data.editStatus;
    that.setData({
      editStatus: !editStatus
    })

  },
  //统计钱数和积分数
  changePrice() {
    var money = 0,
      score = 0;
    for (var i = 0; i < this.data.cartLists.length; i++) {

      for (var j = 0; j < this.data.cartLists[i].list.length; j++) {
        if (this.data.cartLists[i].list[j].checked) {
          money += this.data.cartLists[i].list[j].num * this.data.cartLists[i].list[j].price.money
          score += this.data.cartLists[i].list[j].num * this.data.cartLists[i].list[j].price.score
        }
      }

    }
    //更新数据
    this.setData({
      moneyTotal: money,
      scoreTotal: score
    })
  },
  onLoad: function(options) {
    let that = this;
    if (options.currentTab){
      that.setData({
        currentTab: options.currentTab
      })
    }
    app.getUserInfo().then(function(res) {
      that.setData({
        userInfo: res,
        image: res.avatarUrl
      })
    });
  },
  onShow() {
    let member_id = wx.getStorageSync('member_id');
    if (member_id) {
      this.setData({
        'cartAllsel[0].checked': !1,
        member_id: member_id,
        editStatus: !1
      })
      this.getData()
    } else {
      this.setData({
        isAuthorize: !0
      })
    }
  },
  onHide() {
    this.setData({
      currentNav: 0,
      isReset: 0
    })
  },
  onUnload() {
    this.setData({
      currentNav: 0,
      isReset: 0
    })
  },
  jumpUrl(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  bindgetuserinfoHandler(e) {
    let that = this;
    app.getUserInfo(!0).then(res => {
      console.log(res)
      wx.setStorageSync("member_id", res.member_id)
      that.setData({
        isAuthorize: !1,
        userInfo: res.userInfo,
        member_id: res.member_id,
        image: res.userInfo.avatarUrl
      })
      that.getData()
    })
  },
  getData() {
    // 获取今日任务总分数
    // this.getTodayScore();
    // 获取必做任务总分数
    // this.getMostScore();
    // 获取订单列表
    // this.getOrder();
    // 获取用户当前的等级和积分
    this.getScore();
    // 获取时间列表活动
    // this.getTimeTask();
    // 获取定位
    this.getPos();
    // 获取首页轮播图
    this.getBanner();
    // 获取一级分类
    this.getFirst();
    // 获取收藏列表
    // this.getCollect();
    // 获取购物车列表
    this.getCart();
  },
  // 切换导航
  switchClass(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.item.id
    this.setData({
      currentNav: index
    })
    common.get('/home/category', {
      id: id
    }).then(res => {
      this.setData({
        classifyList: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
    common.get('/home/products', {
      latitude: _this.data.latitude,
      longitude: _this.data.longitude,
      category_id: _this.data.currentNav == 0 ? 0 : id
    }).then(res => {
      _this.setData({
        shopList: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  // 获取二级分类的产品
  getSecond(e) {
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.item.id
    this.setData({
      secondClass: index
    })
    common.get('/home/products', {
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      category_id: id
    }).then(res => {
      this.setData({
        shopList: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  // 获取首页轮播图
  getBanner() {
    common.get('/home/banner', {}).then(res => {
      this.setData({
        imgUrls: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取一级分类
  getFirst() {
    common.get('/home/category', {
      id: 0
    }).then(res => {
      let list = res.data.data
      list.unshift({
        name: '首页'
      })
      this.setData({
        navList: list
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 跳转到详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '../../pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  //去逛逛
  jumpIndex(e) {
    this.setData({
      currentTab: 1
    })
  },
  // 获取定位
  getPos() {
    let _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // _this.setData({
        //   latitude: 40.091025,
        //   longitude: 116.297493
        // })
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        // debugger
        common.get('/home/products', {
          latitude: _this.data.latitude,
          longitude: _this.data.longitude
        }).then(res => {
          // debugger
          _this.setData({
            shopList: res.data.data
          })
        }).catch(res => {
          let reason = [];
          for (let i in res.data.errors) {
            reason.push(res.data.errors[i][0])
          }
          app.showToast(reason[0] || res.data.message, _this, 2000)
        })
      },
      fail: function(res) {
        console.log(res)
        if (res.errMsg == "getLocation:fail auth deny") {
          _this.openSetting()
        }
      }
    })
  },
  //打开授权设置
  openSetting() {
    let _this = this;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '为了帮您找到附近提供福利的商家，请打开您的地理位置和用户信息',
      success: function(res) {
        wx.getSetting({
          success(data) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  if (!res.authSetting["scope.userInfo"]) {
                    _this.setData({
                      isAuthorize: !0
                    })
                  } else {
                    _this.setData({
                      isAuthorize: !1
                    })
                  }
                  console.log(res.authSetting)
                  // res.authSetting = {
                  //   "scope.userInfo": true,
                  //   "scope.userLocation": true
                  // }
                }
              })
            }
          }
        })
      }
    })
  },
  // 获取订单列表
  getOrder() {
    common.get('/orderlist', {
      id: this.data.member_id
    }).then(res => {
      this.setData({
        orderList: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取我的收藏列表
  getCollect() {
    common.get('/mycollection', {
      member_id: this.data.member_id
    }).then(res => {
      this.setData({
        collectList: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取时间列表活动
  getTimeTask() {
    common.get('/activity/activitylists', {}).then(res => {
      this.setData({
        timeList: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取今日任务总分数
  getTodayScore() {
    common.get('/activity/alytotal', {
      member_id: this.data.member_id,
      tasktype: 0
    }).then(res => {
      this.setData({
        todayScore: res.data.data,
        'todayScore.tit': '今日任务',
        'todayScore.imgSrc': '../../../imgs/todayIcon.png'
      })
      wx.setStorageSync('todayScore', this.data.todayScore)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取必做任务列表
  getMostScore() {
    common.get('/activity/alytotal', {
      member_id: this.data.member_id,
      tasktype: 1
    }).then(res => {
      this.setData({
        mustScore: res.data.data,
        'mustScore.tit': '必做任务',
        'mustScore.imgSrc': '../../../imgs/mustIcon.png'
      })
      wx.setStorageSync('mustScore', this.data.mustScore)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  swichNav: function(e) {
    var that = this;
    // console.log(e)
    that.setData({
      currentTab: e.currentTarget.dataset.current
    })
    // that.getCollect();


    // if (that.data.currentTab === e.target.dataset.current) {
    //   return false;
    // } else {
    //   that.setData({
    //     currentTab: e.target.dataset.current
    //   })
    //   that.getCollect();
    // }
  },
  // 获取用户当前的用户和等级
  getScore() {
    common.get('/member/integralandgrade', {
      member_id: this.data.member_id
    }).then(res => {
      this.setData({
        gradeDetail: res.data
      })
      wx.setStorageSync('scoreNum', res.data.integral)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },

  onShareAppMessage(res) { //分享
    let that = this
    let path = '/pages/index/index'
    console.log("分享链接")
    console.log(path)
    if (res.from === 'button') {
      return {
        title: '只为成长，倡导不花钱',
        path: path,
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log("转发成功")
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '积分通兑商城',
      path: path,
      imageUrl: '',
      success: function(res) {
        // 转发成功
        console.log("转发成功")
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  onShareAppMessage(res) { //分享
    let that = this
    let path = '/pages/index/index'
    console.log("分享链接")
    console.log(path)
    return {
      title: '积分通兑商城',
      path: path,
      imageUrl: '',
      success: function(res) {
        // 转发成功
        console.log("转发成功")
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})
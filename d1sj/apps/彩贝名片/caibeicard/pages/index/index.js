const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl
let page = 0
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    navActive: 1,
    region: ['北京', '北京', '东城区'],
    currentTab: 0,
    currentTab2: 0,
    index: 0,
    pdData:[],
    guideIndex:1
  },
  onLoad: function (options) {
    let that = this
    console.log(options)
    let member_id = wx.getStorageSync('member_id')
    let isGuide = wx.getStorageSync('isGuide')
    if (!member_id) {
      //轮播图地址
      that.getBannerUrls()
      //获取分类
      that.getTypes()
      //获取年龄段
      that.getAges()
      //获取绘本
      that.getBooks({
        page: '',
        type_id: '',
        age_id: ''
      })
      wx.setStorageSync("isGuide", 1)
      wx.reLaunch({
        url: '/pages/start/start',
      })
      return false
    }
    if (isGuide){
      that.setData({
        pop1:true
      })
    }else{
      that.setData({
        pop1: false
      })
    }
    that.setData({
      member_id: member_id
    })
    if (options.parent_id){
      app.getShareCoin({//分享得币
        o: that,
        param: {
          member_id: that.data.member_id,
          parent_id: options.parent_id
        }
      })
    }
    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
    wx.getUserInfo({
      success: function (e) {
        // debugger
        app.globalData.userInfo = e.userInfo
      },
      fail() {
      }
    })
    
  },
  onShow() {
    let that = this
    let member_id = wx.getStorageSync('member_id')
    if (member_id){
      that.getData()
      that.setData({
        member_id: member_id,
      })
    }
    var query = wx.createSelectorQuery() //创建节点查询器 query
    query.select('#affix').boundingClientRect() //这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
    query.exec(function(res) {
      console.log(res)
      console.log(res[0].top); // #affix节点的上边界坐
      that.setData({
        menuTop: (res[0].top) - 90
      })
    });
  },
  swithNext(){
    let that = this
    let ind = that.data.guideIndex
    ind >= 4 ? (wx.setStorageSync("isGuide", 0),
    that.setData({
      pop1: false
    })): ind++
    that.setData({
      guideIndex: ind
    })
  },
  onPageScroll: function(e) {
    // console.log(e.scrollTop);
    var that = this;
    // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位
    if (e.scrollTop > that.data.menuTop) {
      that.setData({
        menuFixed: true
      })
    } else {
      that.setData({
        menuFixed: false
      })
    }

    if (e.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  jumpProductDetails(e) {
    let id = e.currentTarget.dataset.id
    app.turnToPage('/pages/productDetails/productDetails?book_id=' + id)
  },
  jumpWebView(e) {
    let url = e.currentTarget.dataset.url
    app.turnToPage('/pages/module/webview/webview?url=' + url)
  },
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  navbarTap(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    that.goTop()
    wx.showLoading({
      title: '加载中...'
    })
    if (id == 0) { //分类
      that.setData({
        currentTab: e.currentTarget.dataset.idx
      })

    } else if (id == 1) { //年龄
      // let act = "navbarsub[" + that.data.age_index+"].act"
      that.setData({
        currentTab2: e.currentTarget.dataset.idx,
        // [act]:0
      })
    }
    //获取绘本
    that.getBooks({
      page: '',
      type_id: that.data.navbar[that.data.currentTab].id,
      age_id: that.data.navbarsub[that.data.currentTab2].id
    })
  },
  bindInpfocus(e) {
    app.turnToPage('/pages/search/search')
  },
  getData() { //初始化数据
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    //个人信息
    that.getPerson()
    //轮播图地址
    that.getBannerUrls()
    //获取分类
    that.getTypes()
    //获取年龄段
    that.getAges()
  },
  previewImage: function(e) { //图片预览
    let that = this
    var current = e.target.dataset.src;
    var curIndex = e.target.dataset.curindex;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: that.data.wenzData[curIndex].picture // 需要预览的图片http链接列表  
    })
  },
  getPerson() { //个人信息
    let that = this
    common.get('/index/memberInfo', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("个人信息")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          age_index: Number(res.data.data.age_id),
          currentTab2: Number(res.data.data.age_id)
        })
        //获取绘本
        that.getBooks({
          page: '',
          type_id: '',
          age_id: that.data.age_index
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/member/info 接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  getTypes() { //获取分类
    let that = this
    common.get('/index/getTypes', {}).then(res => {
      console.log("获取分类")
      console.log(res)
      if (res.data.code == 100) {
        app.globalData.typeData = res.data.data
        let obj = {}
        obj.id = ""
        obj.name = "全部"
        res.data.data.unshift(obj)
        that.setData({
          navbar: res.data.data
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/getTypes 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getAges() { //获取年龄段
    let that = this
    common.get('/index/getAges', {}).then(res => {
      console.log("获取年龄段")
      console.log(res)
      if (res.data.code == 100) {
        app.globalData.ageData = res.data.data
        let obj = {}
        obj.id = ""
        obj.age = "全部"
        res.data.data.unshift(obj)
        // console.log("res.data.data.length")
        // console.log(res.data.data.length)
        // res.data.data[that.data.age_index].act = 1
        that.setData({
          navbarsub: res.data.data
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/index/getAges 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getBooks(data) { //获取绘本
    let that = this
    // debugger
    common.get('/index/getBooks', {
      member_id: that.data.member_id,
      page: data.page,
      type_id: data.type_id,
      age_id: data.age_id,
    }).then(res => {
      console.log("获取绘本")
      console.log(res)
      if (res.data.code == 100) {
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // debugger
        if (data.page!=""){
          // debugger
          if (res.data.data.lists.length <= 0){
            app.showToast({
              title: "没有更多数据啦~~",
            })
            page = res.data.data.next_page
          }else{
            let pdData = that.data.pdData
            for (var i = 0; i < res.data.data.lists.length; i++) {
              pdData.push(res.data.data.lists[i]);
            }
            that.setData({
              pdData: pdData
            })
          }
        }else{
          that.setData({
            pdData: res.data.data.lists
          })
          page = res.data.data.next_page
        }
      }
    }).catch(e => {
      app.showToast({
        title: "/index/getBanner 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/index/getBanner', {}).then(res => {
      console.log("轮播图地址")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          bannerUrls: res.data.data
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/info/banner 接口获取数据失败",
      })
      console.log(e)
    })
  },
  swiperChange: function(e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
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
  onShareAppMessage: function (res) { //分享
    let that = this
    that.setData({
      pop1: false
    })
    let path = '/pages/index/index?parent_id=' + that.data.member_id
    console.log("分享链接")
    console.log(path)
    if (res.from === 'button') {
      return {
        title: '只为成长，倡导不花钱',
        path: path,
        imageUrl: '',
        success: function (res) {
          // 转发成功
          console.log("转发成功")
          console.log(res)
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    return {
      title: '只为成长，倡导不花钱',
      path: path,
      imageUrl: '',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '刷新中...',
    })
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    //获取绘本
    that.getBooks({
      page: '',
      type_id: that.data.navbar[that.data.currentTab].id,
      age_id: that.data.navbar[that.data.currentTab2].id
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.showNavigationBarLoading();
    //获取绘本
    // page++;
    that.getBooks({
      page: page,
      type_id: that.data.navbar[that.data.currentTab].id,
      age_id: that.data.navbar[that.data.currentTab2].id
    })
  },
})
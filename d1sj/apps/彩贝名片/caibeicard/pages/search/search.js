const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl
let page = 0
Page({
  data: {
    img_url: app.data.imgUrl,
    member_id: 1,
    swiperCurrent: 0,
    navActive: 1,
    currentTab: 0,
    currentTab2: 0,
  },
  onLoad: function () {
    let that = this
    console.log("app.globalData")
    console.log(app.globalData)
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      navbar: app.globalData.typeData,
      navbarsub: app.globalData.ageData,
      inputValue:'幼儿绘本',
      tempInpVal:'幼儿绘本'
    })
  },
  onShow() {
    let that = this
    that.getData()
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
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
  jumpProductDetails(e) {
    let id = e.currentTarget.dataset.id
    app.turnToPage('/pages/productDetails/productDetails?book_id=' + id)
  },
  navbarTap(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    that.goTop()
    wx.showLoading({
      title: '加载中...'
    })
    if (id == 0) {//分类
      that.setData({
        currentTab: e.currentTarget.dataset.idx
      })
    } else if (id == 1) {//年龄
      that.setData({
        currentTab2: e.currentTarget.dataset.idx
      })
    }
    //获取绘本
    that.getBooks({
      keyword: that.data.keyword,
      page: "",
      type_id: that.data.navbar[that.data.currentTab].id,
      age_id: that.data.navbar[that.data.currentTab2].id
    })
  },
  emptyInp(){
    let that = this
    that.setData({
      searchSucc: false,
      inputValue:that.data.tempInpVal,
      currentTab: 0,
      currentTab2:0,
    })
    that.getData()
  },
  backPage(){
    app.turnBack(1)
  },
  bindInpChange(e) {
    let that = this
    that.setData({
      inputValue: e.detail.value
    })
  },
  bindInpconfirm(e){//搜索
    let that = this
    let keyword = that.data.inputValue
    let key = e.currentTarget.dataset.key
    if (key){
      keyword = key
      that.setData({
        inputValue: keyword
      })
    }
    that.setData({
      searchSucc:true,
      keyword: keyword
    })
    that.getBooks({
      keyword: that.data.keyword,
      page: "",
      type_id: that.data.navbar[that.data.currentTab].id,
      age_id: that.data.navbar[that.data.currentTab2].id
    })
  },
  getData() { //初始化数据
    let that = this
    //历史搜索
    that.getHistorySearch()
    //热门搜索
    that.getHotSearch()
  },
  getBooks(data) { //获取绘本
    let that = this
    debugger
    common.get('/index/search', {
      member_id: that.data.member_id,
      keyword: data.keyword,
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
        if (data.page != "") {
          // debugger
          if (res.data.data.lists.length <= 0) {
            app.showToast({
              title: "没有更多数据啦~~",
            })
            page = data.page -1
          } else {
            let pdData = that.data.pdData
            for (var i = 0; i < res.data.data.lists.length; i++) {
              pdData.push(res.data.data.lists[i]);
            }
            that.setData({
              pdData: pdData
            })
          }
        } else {
          that.setData({
            pdData: res.data.data.lists
          })
          page = 0
        }
      }
    }).catch(e => {
      app.showToast({
        title: "/index/search 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getHistorySearch() { //历史搜索
    let that = this
    common.get('/index/historySearch', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("历史搜索")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          historySearchData: res.data.data
        })
      }else{
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/info/banner 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getHotSearch() { //热门搜索
    let that = this
    common.get('/index/hotSearch', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("热门搜索")
      console.log(res)
      if (res.data.code == 100) {
        that.setData({
          hotSearchData: res.data.data
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/info/banner 接口获取数据失败",
      })
      console.log(e)
    })
  },
  delHistorySearch(){//删除历史搜索
    let that = this
    common.post('/index/delHistorySearch', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("删除历史搜索")
      console.log(res)
      if (res.data.code == 100) {
        that.getHistorySearch()
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/info/banner 接口获取数据失败",
      })
      console.log(e)
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function (event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...',
    })
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    //获取绘本
    that.getBooks({
      keyword: that.data.keyword,
      page: "",
      type_id: that.data.navbar[that.data.currentTab].id,
      age_id: that.data.navbar[that.data.currentTab2].id
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.showNavigationBarLoading();
    //获取绘本
    page++;
    that.getBooks({
      keyword: that.data.keyword,
      page: page,
      type_id: that.data.navbar[that.data.currentTab].id,
      age_id: that.data.navbar[that.data.currentTab2].id
    })
  },
})
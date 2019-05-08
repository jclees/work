// pages/paihang/paihang.js

const app = getApp();
Page({
  data: {
    selected: true,
    selected1: false,
    tupian: getApp().globalData.imgUrl,
    image: getApp().globalData.siteUrl,
    UserInfo: app.getUserInfo(),
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true,
      one: '', two: '', three: '', mysort:'', list: {},
    })
    let apiurl = 'sort/getsortlist';
    let friend = 'friend';
    app.getdata.fetchApi(apiurl, { type: friend })
      .then(d => {
        if (d.status == 1) {
          this.setData({ one: d.data.one, two: d.data.two, three: d.data.three, list: d.data.list })
        } else {
          this.setData({ one: '', two: '', three: '', list: {} })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
      })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      one: '', two: '', three: '', mysort: '', list: {},
    })
    let apiurl = 'sort/getsortlist';
    let friend = 'world';
    app.getdata.fetchApi(apiurl, { type: friend })
      .then(d => {
        if (d.status == 1 ) {
          if (d.data.my_sort == ''){
            this.setData({ one: d.data.one, two: d.data.two, three: d.data.three, mysort: '', list: d.data.list  });
          }else{
            this.setData({ one: d.data.one, two: d.data.two, three: d.data.three, mysort: d.data.my_sort, list: d.data.list })
          }
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
      })
  },
  onLoad: function () {
    // 页面渲染后 执行
    this.selected()
  }
})
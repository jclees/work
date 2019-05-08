const app = getApp()
let member_id = 0,
  subFlag = true,
  page=1,
  sub_page = 2;
Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    topbarTab: 1,
    moreList: [],
    kehuList:[],
    iszk:true
  },
  onLoad: function() {
    let that = this;
    member_id = wx.getStorageSync('member_id'),
      //  高度自适应
      wx.getSystemInfo({
        success: function(res) {
          var clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
          var calc = clientHeight * rpxR - 120;
          console.log(calc)
          that.setData({
            winHeight: calc
          });
        }
      });
  },
  onShow() {
    let that = this;
    that.setData({
      kehuList:[]
    })
    that.getKehu(1, 1)
  },
  openJumpPop(e) {
    let that = this, pid=e.currentTarget.dataset.id;
    that.setData({
      pop1: !0,
      pid
    })
  },
  jump_parentcard(a) {
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab?parent_id=" + this.data.pid
    });
  },
  hideJumpPop() {
    let that = this;
    that.setData({
      pop1: !1
    })
  },
  goChat: function (a) {
    let that = this;
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    app.recordChata(wx.getStorageSync("member_id"), that.data.pid);
    that.setData({
      pop1: !1
    })
  },
  getKehu(p, s) {
    // debugger
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    app.util.request({
      url: '/action/customer',
      data: {
        member_id: member_id,
        switch: s,
        page: p
      },
      success: function(res) {
        wx.hideLoading()
        console.log("客户")
        console.log(res)
        if (res.data.code == 200) {
          // debugger
          let resd = res.data.data
          // debugger
          let d = that.data.kehuList
          for (var i = 0; i < resd.length; i++) {
            d.push(resd[i]);
          }
          for (let i = 0; i < d.length; i++) {
            d[i].subStauts = false
          }
          that.setData({
            kehuList: d
          })
          page++
        } else if (res.data.code == 403){
          wx.showToast({
            title: "没有更多数据啦~~",
            icon: "none"
          })
          page++
        }
      },
      fail: function(a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  loadMoreKehu(){
    let that = this;
    that.getKehu(page, (that.data.currentTab + 1))
  },
  loadMore(e) {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    let that = this,
      w = e.currentTarget.dataset.w,
      cid = e.currentTarget.dataset.cid,
      o = that.data.moreList;
    if (o.length <= 0) {
      let o2 = that.data.kehuList[w].msg;
      let n = o.concat(o2);
      that.setData({
        moreList: n
      })
    }
    that.setData({
      loading:true
    })
    console.log({
      member_id: member_id,
      customer_id: cid,
      switch: (that.data.currentTab + 1),
      page: sub_page
    })
    app.util.request({
      url: '/action/openAction',
      data: {
        member_id: member_id,
        customer_id: cid,
        switch: (that.data.currentTab + 1),
        page: sub_page
      },
      success: function(res) {
        // debugger
        console.log("加载更多")
        console.log(res)
        // wx.hideLoading()
        // debugger
        if (res.data.code == 200) {
          let resd = res.data.data
          if (resd.length <= 0) {
            // wx.showToast({
            //   title: "没有更多数据啦~~",
            //   icon: "none"
            // })
            that.setData({
              dataNull: true
            })
            sub_page++
          } else {
            let d = that.data.moreList
            // debugger
            for (var i = 0; i < resd.length; i++) {
              d.push(resd[i]);
            }
            that.setData({
              moreList: d,
              loading: false
            })
            
            sub_page++
          }
        }
      },
      fail: function(a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  showSubList(e) {
    let that = this,
      w = e.currentTarget.dataset.w;
    sub_page = 2
    that.setData({
      moreList: [],
      dataNull: false,
      loading:false,
      iszk:false
    })
    

    let k = "kehuList[" + w + "].subStauts"
    // debugger
    // console.log(that.data.kehuList[w].subStauts)
    that.data.kehuList[w].subStauts ? (that.setData({
      [k]: !1,
    })) : (that.setData({
      [k]: !0,
    }))

    // let d = that.data.kehuList
    // for (let i = 0; i < d.length; i++) {
    //   d[i].subStauts = false
    // }
    // that.setData({
    //   kehuList: d
    // })
    



    // subFlag ? (that.setData({
    //   subStauts: !0,
    // }), subFlag = false) : (that.setData({
    //   subStauts: !1,
    // }), subFlag = true)
  },
  hideSubList(e) {
    let that = this,
      w = e.currentTarget.dataset.w;
    sub_page = 2
    page = 1
    that.setData({
      moreList: [],
      dataNull: false,
      loading:false,
      iszk:true
    })
    let d = "kehuList[" + w + "].subStauts"
    that.setData({
      [d]: false,
    })
    // subFlag ? (that.setData({
    //   subStauts: !0,
    // }), subFlag = false) : (that.setData({
    //   subStauts: !1,
    // }), subFlag = true)
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    let that = this
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    that.getKehu(1, (that.data.currentTab + 1))
    sub_page = 2
    page = 1
    that.setData({
      moreList:[],
      kehuList:[],
      dataNull: false,
      loading:false
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    let that = this
    var cur = e.currentTarget.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.showNavigationBarLoading();
    // page++;
    that.getKehu(page, (that.data.currentTab + 1))
  }
})
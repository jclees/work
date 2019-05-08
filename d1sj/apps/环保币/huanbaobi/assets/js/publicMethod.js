const common = require('common');
let publicMethod = {
  getUnreadNum(t) { //未读
    let that = t
    common.get('/chat/getUnreadNum', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("未读")
      console.log(res)
      setTimeout(() => {
        that.setData({
          unData: res.data.data
        })
      }, 500)
    }).catch(e => {
      // app.showToast({
      //   title: "数据异常",
      // })
      console.log(e)
    })
  },
  guanzhu(e, t, f) { //关注

    this.getFormId(e, t)
    let that = t;
    let id = e.currentTarget.dataset.id;
    let business_id = e.currentTarget.dataset.business_id;
    let data = that.data.wenzData;
    let idx = e.currentTarget.dataset.idx;
    let type;
    if (business_id != 0) {
      type = 1
    } else {
      type = 2
    }
    common.post('/memberinfo/clickConcern', {
      member_id: that.data.member_id,
      be_member_id: id,
      type
    }).then(res => {

      console.log("关注")
      console.log(res)

      if (res.data.code == 200) {

        let arr = [];
        for (let i in data) {
          if (data[idx].member_id == data[i].member_id) {
            arr.push(i)
          }
        }
        for (let i in arr) {
          if (res.data.msg == "已关注") {
            data[arr[i]].is_concern = 1
          } else {
            data[arr[i]].is_concern = 0
          }
        }
        that.setData({
          wenzData: data
        })

        // if (typeof f == "function") {
        //   return f(res.data)
        // }
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  openFun(e, t) { //打开私信和拨打电话
    this.getFormId(e, t)
    let that = t
    let ind = e.currentTarget.dataset.curindex
    // wx.hideTabBar()
    that.setData({
      ind,
      popidx: ind,
      pop3: true
    })
  },
  callTel(e, t) { //拨打电话
    this.getFormId(e, t)
    let that = t;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
      complete: function() {
        wx.showTabBar()
        that.setData({
          popidx: false,
          pop3: false
        })
      }
    })
  },
  openFulltxt(e, t) { //打开全文
    let that = t;
    let curIdx = e.currentTarget.dataset.curidx;
    that.data.showFull[curIdx].status = !that.data.showFull[curIdx].status
    that.setData({
      showFull: that.data.showFull
    })
  },
  previewImage(e, t) { //图片预览
    let that = t
    var curIndex = e.target.dataset.curindex;
    var subIndex = e.target.dataset.subidx;
    var imgUrls = [];
    for (var i in that.data.wenzData[curIndex].images) {
      imgUrls.push(that.data.wenzData[curIndex].images[i].url)
    }
    wx.previewImage({
      current: that.data.wenzData[curIndex].images[subIndex].url, // 当前显示图片的http链接  
      urls: imgUrls // 需要预览的图片http链接列表  
    })
  },
  delCircle(e, t) { //删除图文
    let that = t;
    let id = e.currentTarget.dataset.id;
    let curIdx = e.currentTarget.dataset.curidx;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function(res) {
        if (res.confirm) {
          common.get('/content/selfDelete', {
            member_id: that.data.member_id,
            id
          }).then(res => {

            console.log("删除图文")
            console.log(res)
            if (res.data.code == 200) {
              that.setData({
                popidx: false,
                pop3: false
              })
              let data = that.data.wenzData
              data.splice(curIdx, 1)
              if (data.length <= 0) {
                that.setData({
                  dataStatus: true
                })
              }
              that.setData({
                wenzData: data
              })
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })

  },
  loadMore(e, t) { //加载更多评论
    let that = t
    let idx = e.currentTarget.dataset.curindex
    let page1 = that.data.page1[idx]
    page1++
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/content/loadMore', {
      content_id: that.data.wenzData[idx].id,
      page: page1
    }).then(res => {

      wx.hideLoading()
      console.log("加载评论")
      console.log(res)
      if (res.data.code == 200) {
        if (res.data.data.length <= 0) {
          // var a = `page1[${idx}]`
          // that.setData({
          //   [a]: page1
          // })
          that.data.loadend[idx] = !that.data.loadend[idx]
          that.setData({
            loadend: that.data.loadend
          })
          return
        }

        let wenzData = that.data.wenzData;
        let comments = wenzData[idx].comments;
        let obj = res.data.data
        for (var i in obj) {
          comments.push(obj[i])
        }
        var a = `page1[${idx}]`
        that.setData({
          wenzData,
          [a]: page1
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  hfComment(e, t) { //回复评论
    let that = t;
    let ind = e.currentTarget.dataset.curindex;
    let plind = e.currentTarget.dataset.plidx;
    let data = that.data.wenzData;
    let member_name = data[ind].member_name;

    if (that.data.member_id == data[ind].comments[plind].other_id) {
      wx.showToast({
        title: '不能回复自己的评论哦',
        icon: 'none'
      })
      return
    }
    let inpPlaceholder = '回复' + data[ind].comments[plind].member_name + ':';
    console.log()
    that.setData({
      member_name,
      inpPlaceholder,
      hfStatus: 1,
      ind,
      plind,
      pop1: true
    })
  },
  openComment(e, t) { //打开评论弹框
    let that = t
    let ind = e.currentTarget.dataset.curindex
    let plind = e.currentTarget.dataset.plidx;

    that.setData({
      hfStatus: 0,
      ind,
      plind,
      pop1: true
    })
  },
  bindTextChange(e, t) { //留言val
    let that = t
    that.setData({
      textVal: e.detail.value
    })
  },
  sendComment(e, t) { //评论
    let that = t
    let ind = that.data.ind
    let plind = that.data.plind
    let savaStatus = that.data.savaStatus
    let hfStatus = that.data.hfStatus
    let wenzData = that.data.wenzData;
    let comments = wenzData[ind].comments;


    if (!savaStatus) {
      return
    }
    if (that.data.textVal == '' || that.data.textVal == null) return;
    that.setData({
      savaStatus: false
    })

    let params = {
      member_id: that.data.member_id,
      content_id: that.data.wenzData[ind].id,
      content: that.data.textVal,
    }

    let obj = {
      "content": that.data.textVal,
      "other_id": that.data.member_id,
    };

    if (hfStatus == 1) { //回复评论
      params.replay_member_id = that.data.wenzData[ind].comments[plind].other_id

      obj.replay_member_name = that.data.inpPlaceholder.replace("回复", "")
      if (that.data.member_id == wenzData[ind].member_id) { //自己评论自己
        obj.member_name = wenzData[ind].member_name
      } else {
        obj.member_name = that.data.user_info.nickName
      }

    } else {
      if (that.data.member_id == wenzData[ind].member_id) { //自己评论自己
        obj.member_name = wenzData[ind].member_name
      } else {
        obj.member_name = that.data.user_info.nickName
      }
    }




    common.post('/content/comment', params).then(res => {
      that.setData({
        savaStatus: true
      })
      console.log("评论")
      console.log(res)
      if (res.data.code == 200) {



        comments.push(obj)
        that.setData({
          pop1: false,
          textVal: '',
          inpPlaceholder: '发表评论',
          wenzData
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      that.setData({
        savaStatus: true
      })
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  like(e, t) { //点赞
    let that = t
    let ind = e.currentTarget.dataset.curindex
    common.get('/content/praise', {
      member_id: that.data.member_id,
      content_id: e.currentTarget.dataset.zxid
    }).then(res => {
      console.log("点赞")
      console.log(res)
      let zan = 'wenzData[' + ind + '].laud_status';
      let zannums = 'wenzData[' + ind + '].laud_count';
      if (that.data.wenzData[ind].laud_status == 1) {
        that.setData({
          [zan]: 0,
          [zannums]: that.data.wenzData[ind].laud_count -= 1
        })
      } else {
        that.setData({
          [zan]: 1,
          [zannums]: that.data.wenzData[ind].laud_count += 1
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  getFormId: function(e, t) { //取FormId
    let that = t;
    common.post('/saveFormId', {
      member_id: that.data.member_id,
      form_id: e.detail.formId
    }).then(res => {
      console.log('取FormId')
      console.log(res)
    })
  },
  getPos(t) { // 获取定位
    let _this = t;
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        common.post('/location', {
          member_id: _this.data.member_id,
          latitude: _this.data.latitude,
          longitude: _this.data.longitude
        }).then(res => {
          console.log("获取定位")
          console.log(res)
        })
      },
      fail: function(res) {
        console.log(res)
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(_this)
        }
      }
    })
  },
  getUserInfo(e,t,f){
    let that = t
    wx.setStorageSync('user_info', e.detail.userInfo)
    wx.login({
      success: function (data) {
        common.post('/member/oauth', {
          code: data.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            that.setData({
              isAuthorize: false
            })
            console.log("授权成功")
            console.log(res)
            wx.showTabBar()
            that.setData({
              member_id: res.data.member_id
            })
            wx.setStorageSync('member_id', that.data.member_id)
            if (typeof f == "function") {
              return f(res)
            }
          }
        }).catch(e => {
          app.showToast({
            title: "数据异常",
          })
          console.log(e)
        })
      }
    })
   
  },
  openSetting(t) { //打开授权设置
    let _this = t;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '你的位置信息将用于小程序位置接口的效果展示',
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
}


module.exports = publicMethod
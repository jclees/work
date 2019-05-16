var util = require("we7/resource/js/util.js");
var cj = require("we7/resource/js/cuttingImg.js");

App({
  data:{
    imgUrl:'https://icard.weixingzpt.com/images/wacode/'
  },
  onLaunch: function(o) {},
  onShow: function(o) {},
  onHide: function() {},
  onError: function(o) {
    console.log(o);
  },
  onLoad(e){
  },
  util: util,
  cj: cj,
  userInfo: {
    sessionid: null
  },
  globalData: {
    userInfo: null,
    addres: [],
    order_complete: [],
    pop1: false,
    pop2: false,
    pop3: false,
    pop4: false,
    pop5: false,
    pop6: false,
  },
  popLock: function(id) {
    // debugger
    if (id == 1) {
      this.globalData.pop1 = true;
      return false
    } else if (id == 2) {
      this.globalData.pop2 = true;
      return false
    } else if (id == 3) {
      this.globalData.pop3 = true;
      return false
    } else if (id == 4) {
      this.globalData.pop4 = true;
      return false
    } else if (id == 5) {
      this.globalData.pop5 = true;
      return false
    } else if (id == 6) {
      this.globalData.pop6 = true;
      return false
    } else {
      this.globalData.pop1 = false;
      this.globalData.pop2 = false;
      this.globalData.pop3 = false;
      this.globalData.pop4 = false;
      this.globalData.pop5 = false;
      this.globalData.pop6 = false;
    }

    // switch (id) {
    //   case '1':
    //     if (!this.globalData.pop1) {
    //       this.globalData.pop1 = true;
    //     }
    //     break;
    //   case '2':
    //     if (!this.globalData.pop2) {
    //       this.globalData.pop2 = true;
    //     }
    //     break;
    //   case '3':
    //     if (!this.globalData.pop3) {
    //       this.globalData.pop3 = true;
    //     }
    //     break;
    //   case '4':
    //     if (!this.globalData.pop4) {
    //       this.globalData.pop4 = true;
    //     }
    //     break;
    //   case '5':
    //     if (!this.globalData.pop5) {
    //       this.globalData.pop5 = true;
    //     }
    //     break;
    //   case '6':
    //     if (!this.globalData.pop6) {
    //       this.globalData.pop6 = true;
    //     }
    //     break;
    //   default:
    //     this.globalData.pop1 = false;
    //     this.globalData.pop2 = false;
    //     this.globalData.pop3 = false;
    //     this.globalData.pop4 = false;
    //     this.globalData.pop5 = false;
    //     this.globalData.pop6 = false;
    // }
  },
  //多张图片上传
  uploadimg(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    console.log("data.path[i]")
    console.log(data.path[i])
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'img', //这里根据自己的实际情况改
      formData: {
        'content-type': 'multipart/form-data',
        img: data.path,
        news_id: data.news_id,
      }, //这里是上传图片时一起上传的数据
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        console.log("resp")
        console.log(resp)
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用 
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          typeof data.picUpSuccess == 'function' && data.picUpSuccess(data);
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  copying(e) {
    let that = this, txt = e.currentTarget.dataset.txt, msg = e.currentTarget.dataset.msg || "复制成功";
    wx.setClipboardData({
      data: txt,
      success: function (res) {
          wx.showToast({
          title: msg,
          icon:'none'
        })
      }
    });
  },
  openSetting(t) { //打开授权设置
    let _this = t;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '你的位置信息将用于小程序位置接口的效果展示',
      success: function (res) {
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
  savaRecord(p){
    // debugger
    console.log("===========")
    console.log(p)
    console.log("===========")
    
    util.request({
      url: "/action/doactions",
      data: p,
      method: "POST",
      success: function (d) {
        // debugger
        if(d.data.code==200){
          console.log("记录成功")
          console.log(d)
        }else{
          console.log("记录失败")
          console.log(d)
        }
      },
      fail: function (res) {
        console.log("记录 数据错误");
        console.log(res);
        // wx.showToast({
        //   title: res.data.message,
        //   icon: "none"
        // })
      }
    });
  },
  recordChata(m,p) {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?parent_id=" + p
    })
    // debugger
    // util.request({
    //   url: "/chat/userInto",
    //   data: {
    //     parent_id: p,
    //     member_id: m
    //   },
    //   method: "POST",
    //   success: function (t) {
    //     console.log("聊天室 通知发送模板消息"), console.log(t), wx.navigateTo({
    //       url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?parent_id=" + p
    //     });
    //   },
    //   fail: function (t) {
    //     console.log("数据错误"), console.log(t);
    //   }
    // });
  },
  siteInfo: require("siteinfo.js"),
});
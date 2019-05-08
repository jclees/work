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
    debugger

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
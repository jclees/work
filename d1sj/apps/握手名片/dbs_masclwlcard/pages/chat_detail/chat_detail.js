var app = getApp(),
  member_id = 0,
  parent_id = 0,
  toViewInd = 0,
  user_flag,
  is_chating = !0;
Page({
  data: {
    inputValue: "",
    returnValue: "",
    addImg: !1,
    card_detail: [],
    fromid: "",
    toView: "",
    allContentList: [],
    i_time: "",
    num: 0
  },
  onLoad: function(t) {
    member_id = wx.getStorageSync("member_id"),
      user_flag = wx.getStorageSync("user_flag"),
      parent_id = t.parent_id;
    var e = this;
    e.getParentCard(parent_id); //对方的名片详情
    let allContentList = wx.getStorageSync("allContentList" + parent_id);
    // 浏览做记录
    app.savaRecord({
      type: 6,
      member_id: member_id,
      be_member_id: parent_id
    })
    if (allContentList) {
      toViewInd = allContentList.length
      e.setData({
        allContentList: allContentList,
        toView: "uid_" + (toViewInd - 1)
      })
    }
    e.getMsgs()
    e.chatHomeStatus(1)
    let timer = setInterval(function() {
      e.getMsgs()
    }, 3000)
    // debugger
    e.setData({
      i_time: timer,
      member_id: member_id,
      parent_id: parent_id,
      user: wx.getStorageSync("userInfo").wxInfo,
      memberInfo: wx.getStorageSync("memberInfo"),
      user_flag: wx.getStorageSync("user_flag"),
    })
  },
  //对方的名片详情
  getParentCard(p) {
    let r, n = this;
    app.util.request({
      url: "/index/cardInfo",
      data: {
        member_id: p
      },
      success: function(d) {
        console.log("对方的名片详情")
        console.log(d)
        if (d.data.errno == 0) {
          wx.setNavigationBarTitle({
            title: d.data.data.card_name,
          })
          n.setData({
            parentInfo: d.data.data
          })
        }
      },
      fail: function(res) {
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  //对方是否在聊天室
  chatHomeStatus(s) {
    // debugger
    let that = this
    app.util.request({
      url: "/chat/chatHomeStatus",
      data: {
        member_id: member_id,
        parent_id: parent_id,
        status: s
      },
      method: "POST",
      success: function(d) {
        // debugger
        console.log("对方是否在聊天室")
        console.log(d)
        // if (d.data.errno == 0) {
        //   for (var i = 0; i < d.data.data.length; i++) {
        //     that.data.allContentList.push({
        //       is_ai: true,
        //       text: d.data.data[i].content,
        //       card_logo: d.data.data[i].card_logo,
        //       id: 2
        //     })
        //   }
        //   that.setData({
        //     allContentList: that.data.allContentList,
        //     toView: "uid_" + (toViewInd++)
        //   })
        //   wx.setStorageSync("allContentList" + parent_id, that.data.allContentList)
        // }
      },
      fail: function(res) {
        console.log("数据错误");
        console.log(res);
        // wx.showToast({
        //   title: res.data.message,
        //   icon: "none"
        // })
        // clearInterval(that.data.i_time)
      }
    });
  },
  getMsgs() {
    let that = this
    // console.log(member_id)
    // console.log(parent_id)
    app.util.request({
      url: "/chat/getMsg",
      data: {
        member_id: member_id,
        chat_id: parent_id
      },
      success: function(d) {
        debugger
        console.log("对方聊天消息")
        console.log(d)
        debugger
        if (d.data.errno == 0) {
          for (var i = 0; i < d.data.data.length; i++) {
            that.data.allContentList.push({
              is_ai: true,
              text: d.data.data[i].content,
              card_logo: d.data.data[i].card_logo,
              id: 2
            })
          }
          that.setData({
            allContentList: that.data.allContentList,
            toView: "uid_" + (toViewInd++)
          })
          wx.setStorageSync("allContentList" + parent_id, that.data.allContentList)
        }
      },
      fail: function(res) {
        // console.log("数据错误");
        // console.log(res);
        // wx.showToast({
        //   title: res.data.message,
        //   icon: "none"
        // })
        // clearInterval(that.data.i_time)
      }
    });
  },
  card_options: function(a) {
    var t, e, i, d, s, r = this,
      n = a.currentTarget.dataset.target;
    switch (a.currentTarget.dataset.option) {
      case "call":
        wx.makePhoneCall({
          phoneNumber: n
        });
        if (user_flag == 1) {
          // 浏览做记录
          app.savaRecord({
            type: 13,
            member_id: member_id,
            be_member_id: parent_id
          })
        }
        break;

      case "copy":
        s = a.currentTarget.dataset.copy, wx.setClipboardData({
          data: n + "",
          success: function(a) {
            wx.showToast({
              title: "复制成功",
              icon: "success",
              duration: 1e3
            });
          }
        });

        if (user_flag == 1 && s == "wxid") {
          // 浏览做记录
          app.savaRecord({
            type: 3,
            member_id: member_id,
            be_member_id: parent_id
          })
        }
        break;
    }
  },
  //收藏名片
  collectCard() {
    let that = this
    app.util.request({
      url: "/index/collectCard",
      data: {
        member_id: member_id,
        card_id: parent_id
      },
      method: "POST",
      success: function(d) {
        console.log("收藏成功")
        console.log(d)
        let t = that.data.card_detail
        t.collectStatus = d.data.data.status
        that.setData({
          card_detail: t
        })
        if (d.data.data.status != 1) {
          wx.showToast({
            title: "收藏成功",
            icon: "none"
          })
          if (user_flag == 1) {
            // 浏览做记录
            app.savaRecord({
              type: 8,
              member_id: member_id,
              be_member_id: parent_id
            })
          }
        } else {
          wx.showToast({
            title: "已收藏",
            icon: "none"
          })
        }
      },
      fail: function(res) {
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  isNull(str) {
    if (str == "") {
      return true;
    }
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  },
  from_send: function(t) {
    var a = this,
      i = a.data.inputValue;
    app.util.getFormId(wx.getStorageSync("member_id"), t);
    if (a.isNull(i)) return;
    a.data.allContentList.push({
        id: 1,
        is_my: {
          text: a.data.inputValue
        },
        sendStatus: !0
      }),
      a.setData({
        allContentList: a.data.allContentList,
        inputValue: "",
        toView: "uid_" + (toViewInd++)
      }),

      is_chating && (is_chating = !1, app.util.request({
        url: "/chat/sendMsg",
        data: {
          member_id: member_id,
          chat_id: parent_id,
          content: i
        },
        method: "POST",
        success: function(d) {
          is_chating = !0
          // debugger
          console.log("发送聊天消息")
          console.log(d)
          if (d.data.errno == 0) {
            a.forallContentList(),
              wx.setStorageSync("allContentList" + parent_id, a.data.allContentList);
          }
        },
        fail: function(res) {
          is_chating = !0
          console.log("数据错误");
          console.log(res);
        }
      }));
  },
  forallContentList() {
    let that = this,
      d = that.data.allContentList;
    for (let i = 0; i < d.length; i++) {
      d[i].sendStatus = !1
    }
    that.setData({
      allContentList: d
    })
  },
  _callPhone: function(t) {
    var a = t.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: a
    });
    if (user_flag == 1) {
      // 浏览做记录
      app.savaRecord({
        type: 13,
        member_id: member_id,
        be_member_id: parent_id
      })
    }
  },
  onShow: function(t) {
    this.chatHomeStatus(1)
  },
  onReady: function() {},
  bindKeyInput: function(t) {
    this.setData({
      inputValue: t.detail.value
    });
  },
  onUnload: function() {
    clearInterval(this.data.i_time)
    this.chatHomeStatus(2)
  },
  onHide: function() {
    clearInterval(this.data.i_time)
    this.chatHomeStatus(2)
  },
  bottom: function() {
    this.setData({});
  }
});
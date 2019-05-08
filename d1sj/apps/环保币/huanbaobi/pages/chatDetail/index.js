const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
var app = getApp(),
  member_id = 0,
  parent_id = 0,
  toViewInd = 0;
Page({
  data: {
    is_chating: !0,
    inputValue: "",
    toView: "",
    allContentList: [],
  },
  onLoad: function(t) {
    member_id = wx.getStorageSync("member_id"),
      parent_id = t.be_member_id;
    wx.setNavigationBarTitle({
      title: t.name || '青山派'
    })
    var e = this;
    e.getMsgs()
    e.setData({
      member_id: member_id,
      user: wx.getStorageSync("user_info")
    })
  },
  onShow: function(t) {},
  onUnload: function() {},
  onHide: function() {},
  bindKeyInput: function(t) {
    this.setData({
      inputValue: t.detail.value
    });
  },
  getMsgs() {
    wx.showNavigationBarLoading();
    let that = this
    common.get('/chat/getMsgs', {
      member_id: member_id,
      be_member_id: parent_id
    }).then(d => {
      wx.hideNavigationBarLoading()
      console.log("对方聊天消息")
      console.log(d)
      if (d.data.errno == 0) {
        for (var i = 0; i < d.data.data.length; i++) {
          if (d.data.data[i].is_right == 1) {
            that.data.allContentList.push({
              id: 1,
              is_my: {
                text: d.data.data[i].content
              },
              sendStatus: !1
            })
          } else {
            that.data.allContentList.push({
              is_ai: true,
              text: d.data.data[i].content,
              card_logo: d.data.data[i].send_avatar,
              id: 2
            })
          }
        }
        toViewInd = (that.data.allContentList.length - 1)

        that.setData({
          allContentList: that.data.allContentList,
          toView: "uid_" + toViewInd
        })
        // wx.setStorageSync("allContentList" + parent_id, that.data.allContentList)
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
    })

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
    var that = this;
    let inputValue = that.data.inputValue;
    if (that.isNull(inputValue)) return;

    that.data.allContentList.push({
      id: 1,
      is_my: {
        text: inputValue
      },
      sendStatus: !0
    })
    toViewInd++
    that.setData({
      allContentList: that.data.allContentList,
      inputValue: "",
      toView: "uid_" + toViewInd
    })


    if (that.data.is_chating) {
      that.setData({
        is_chating: !1
      })
      debugger
      common.post('/chat/sendMsg', {
        member_id: member_id,
        be_member_id: parent_id,
        content: inputValue
      }).then(res => {
        console.log("发送聊天消息")
        console.log(res)
        if (res.data.errno == 0) {

          that.forallContentList()
          // wx.setStorageSync("allContentList" + parent_id, a.data.allContentList)
          that.setData({
            is_chating: !0
          })
        }
      }).catch(e => {
        console.log(e)
        that.setData({
          is_chating: !0
        })
      })
    }

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
  }
});
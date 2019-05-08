// pages/test/test.js
const app = getApp()
let type,
  member_id = 0,
  user_flag,
  parent_id,
  windowWRPX = 750;
Page({
  data: {
    img_url: app.data.imgUrl,
    card_logo: [],
    u_name: '姓名',
    u_tel: '我的联系电话',
    u_comp: '公司名称',
    u_job: '当前职位',
    pop1: true,
    savaStatus: !0,
    upLoadStatus: !0,
    submitTxt: '保存',

    imageFixed: false, //裁剪浮层
    imageSrc: '', //要裁剪的图片
    isShowImg: false,
    // 初始化的宽高
    cropperInitW: windowWRPX,
    cropperInitH: windowWRPX,
    // 动态的宽高
    cropperW: windowWRPX,
    cropperH: windowWRPX,
    // 动态的left top值
    cropperL: 0,
    cropperT: 0,

    // 图片缩放值
    scaleP: 0,
    imageW: 0,
    imageH: 0,

    // 裁剪框 宽高
    cutW: 700,
    cutH: 600,
    cutL: 0,
    cutT: 0,

  },
  popLock: function(event) { // 初始化弹框
    if (!member_id) {
      this.setData({
        isAuthorize: !0
      })
      return false
    }
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  onLoad: function(s) {
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: '/a11.pdf',
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath,
          success(res) {
            debugger
            console.log('打开文档成功')
          }
        })
      }
    })

    member_id = wx.getStorageSync('member_id')
    user_flag = wx.getStorageSync('user_flag')
    // let user = wx.getStorageSync('userInfo').wxInfo
    // this.setData({
    //   user: user,
    //   u_name: user.nickName,
    // })
  },
  bindChangeInp(e) {
    let that = this,
      v = e.detail.value,
      w = e.currentTarget.dataset.w;
    if (w == 1) {
      that.setData({
        u_name: v
      })
    } else if (w == 2) {
      that.setData({
        u_tel: v
      })
    } else if (w == 3) {
      that.setData({
        u_comp: v
      })
    } else if (w == 4) {
      that.setData({
        u_job: v
      })
    }
  },
  // 拖动时候触发的touchStart事件
  contentStartMove(e) {
    app.cj.contentStartMove(e)
  },

  // 拖动时候触发的touchMove事件
  contentMoveing(e) {
    app.cj.contentMoveing(e, this)
  },
  // 获取图片
  getImageInfo(a) {
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    let that = this;
    app.cj.getImageInfo(this, 'myCanvas')
  },
  // 关闭裁剪框
  closeUpImg(a) {
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    this.setData({
      imageFixed: false
    })
  },
  // 设置大小的时候触发的touchStart事件
  dragStart(e) {
    app.cj.dragStart(e, this)
  },
  // 设置大小的时候触发的touchMove事件
  dragMove(e) {
    app.cj.dragMove(e, this)
  },
  bindchoose(e) {
    let which = e.currentTarget.dataset.which,
      t = this,
      a, s,
      w, h, i, n;
    if (which == 1) {
      w = 300, h = 300, i = 'card_logo', a = t.data.card_logo, s = 2
    }
    this.setData({
      tempImgName: i,
      tempS: s,
      tempArr: a,
      cutW: w,
      cutH: h
    })
    app.cj.chooseImage({
      e: e,
      t: t,
      i: i,
      n: n,
      a: a
    })
  },
  savaData(e) { //提交名片
    app.util.getFormId(wx.getStorageSync("member_id"), e);
    let that = this;
    if (that.data.card_logo.length <= 0) {
      wx.showToast({
        title: "请上传名片头像",
        icon: "none"
      })
      return false
    }
    if (that.data.savaStatus) {
      that.setData({
        savaStatus: !1,
        submitTxt: '保存中...'
      })
      let param = {}
      param = e.detail.value
      param.member_id = member_id

      console.log("提交名片参数")
      console.log(param)

      //提交表单
      app.util.request({
        url: "/index/createCard",
        data: param,
        method: "POST",
        success: function(res) {
          // debugger
          if (that.data.card_logo.length > 0) { 
            that.setData({
                upLoadStatus: !1
              }),
              app.util.uploadFile({
                url: '/index/createCardImg',
                path: that.data.card_logo, //这里是选取的图片的地址数组
                name: 'card_logo',
                _this: that,
                formData: {
                  'content-type': 'multipart/form-data',
                  member_id: member_id,
                  card_logo: that.data.card_logo,
                },
                picUpSuccess: function(res) {
                  console.log("头像上传成功")
                  console.log(res)
                  setTimeout(function() {
                    that.setData({
                      upLoadStatus: !0
                    })
                  }, 1000)
                }
              });
          }
          let timer = setInterval(function() {
            if (that.data.upLoadStatus) {
              that.setData({
                  submitTxt: '已保存'
                }),
                user_flag == 1 && (
                  app.savaRecord({
                    type: 4,
                    member_id: member_id,
                    be_member_id: parent_id
                  }), app.savaRecord({
                    type: 17,
                    member_id: member_id,
                    be_member_id: parent_id
                  })
                ),
                wx.showModal({
                  title: '提示',
                  content: '去看看我的名片',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/dbs_masclwlcard/pages/tab/tab',
                      })
                    }
                  }
                }),
                clearInterval(timer)
            }
          }, 500);
        },
        fail: function(res) {
          debugger
          console.log("数据错误");
          console.log(res);
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })

          that.setData({
            savaStatus: !0,
            submitTxt: '保存'
          })

        }
      });
    }
  },
  //名片详情
  getCard: function() {
    var t = this;
    app.util.request({
      url: "/index/cardInfo",
      data: {
        member_id: member_id
      },
      success: function(a) {
        console.log("名片详情")
        console.log(a)
        if (a && null != a.data.data.card_name) {
          a.data.data.parent_id != null && (
            parent_id = a.data.data.parent_id,
            t.getShare()
          );
        }
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  // 绑定上级
  getShare: function() {
    // debugger
    s.util.request({
      url: "/index/share",
      data: {
        parent_id: parent_id,
        member_id: member_id
      },
      method: "POST",
      success: function(t) {
        console.log("分享"), console.log(t);
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  //判断是否注册
  is_create_card() {
    let that = this
    app.util.request({
      url: "/index/is_create_card",
      data: {
        member_id: member_id
      },
      success: function(a) {
        // debugger
        console.log("判断是否注册")
        console.log(a)
        if (a.data.errno == 0) {
          if (a.data.data.status == 1) {
            wx.reLaunch({
              url: '/dbs_masclwlcard/pages/tab/tab',
            })
          } else {
            that.getCard();
          }
        }
      },
      fail: function(a) {
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  //授权
  bindgetuserinfoHandler: function(t) {
    var e = this;
    // t = this;
    app.util.getUserInfo(function(a) {
      if (a && a.data.data.member_id) {
        member_id = a.data.data.member_id;
        e.is_create_card();
        e.setData({
          isAuthorize: !1
        });
      }
    });
  }
})
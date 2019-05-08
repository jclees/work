// pages/test/test.js
const app = getApp()
let windowWRPX = 750,
  member_id = 0;
Page({
  data: {
    textareaShow: true,
    card_logo: [],
    photo: [],
    card_instr: '',
    company_logo: [],
    savaStatus: !0,
    upLoadStatus: !0,
    submitTxt: '提交',

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
    cutT: 0
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  textareaInp(e) {
    let that = this
    that.setData({
      card_instr: e.detail.value
    })
  },
  onLoad: function(s) {
    member_id = wx.getStorageSync('member_id')
    this.getData()
  },

  // 拖动时候触发的touchStart事件
  contentStartMove(e) {
    app.cj.contentStartMove(e)
  },
  // 设置大小的时候触发的touchMove事件
  dragMove(e) {
    app.cj.dragMove(e, this)
  },
  // 拖动时候触发的touchMove事件
  contentMoveing(e) {
    app.cj.contentMoveing(e, this)
  },
  // 获取图片
  getImageInfo(a) {
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    let that = this;
    that.setData({
      textareaShow: true
    })
    app.cj.getImageInfo(this, 'myCanvas')
  },
  // 关闭裁剪框
  closeUpImg(a) {
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    this.setData({
      imageFixed: false,
      textareaShow: true
    })
  },
  // 设置大小的时候触发的touchStart事件
  dragStart(e) {
    app.cj.dragStart(e, this)
  },
  bindchoose(e) {
    let which = e.currentTarget.dataset.which,
      t = this,
      a,
      w, h, i, n, s;
    if (which == 1) {
      w = 300, h = 300, i = 'card_logo', s = 2
    } else if (which == 2) {
      w = 300, h = 300, i = 'company_logo', a = t.data.company_logo, s = 2
    } else if (which == 3) {
      w = 300, h = 600, i = 'photo', a = t.data.photo, s = 1
    }
    this.setData({
      tempImgName: i,
      tempArr: a,
      tempS: s,
      cutW: w,
      cutH: h,
      textareaShow: false
    })
    app.cj.chooseImage({
      e: e,
      t: t,
      w: w,
      h: h,
      i: i,
      n: n,
      a: a
    })
  },
  getData() {
    let that = this
    app.util.request({
      url: "/index/cardInfo",
      data: {
        member_id: member_id
      },
      success: function(res) {
        //  debugger
        console.log(res)
        let card_logo = res.data.data.card_logo;
        let newcard_logo = card_logo.split();

        let company_logo = res.data.data.company_logo;
        let newcompany_logo = company_logo.split();

        let photo = res.data.data.photo;
        let newphoto = [];
        let phptoName = [];

        let sexItems = res.data.data.sexItems
        let defaultItems = that.data.defaultItems

        res.data.data.sex == 1 ? (that.setData({
          ["sexItems[0].checked"]: "true",
        })) : (that.setData({
          ["sexItems[1].checked"]: "true"
        }))
        // res.data.data.mrtype == 1 ? (that.setData({
        //   ["defaultItems[0].checked"]: "true",
        // })) : (that.setData({
        //   ["defaultItems[1].checked"]: "true"
        // }))
        for (var i = 0; i < photo.length; i++) {
          newphoto.push(photo[i].url)
          phptoName.push(photo[i].imgName)
        }
        that.setData({
          regData: res.data.data,
          card_logo: newcard_logo,
          company_logo: newcompany_logo,
          photo: newphoto,
          photoName: phptoName,
          card_instr: res.data.data.card_instr
        })
      },
      fail: function(res) {
        debugger
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  openPic(e) {
    let that = this
    var current = e.target.dataset.url;
    var curIndex = e.target.dataset.index;
    var id = e.currentTarget.dataset.id;
    var urls;
    if (id == 1) {
      urls = that.data.photo
    } else if (id == 2) {
      urls = that.data.picture
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: urls // 需要预览的图片http链接列表  
    })
  },
  closePic() {
    let that = this
    that.setData({
      textareaShow: true,
      layer: false
    })
  },
  delPic(e) {
    let that = this,
      picsUp,
      pics,
      id = e.currentTarget.dataset.id,
      w = e.currentTarget.dataset.w;

    debugger
    if (id == 1) {
      picsUp = that.data.card_logo, pics = "card_logo"
    } else if (id == 2) {
      picsUp = that.data.photo, pics = "photo";
      picsUp.length > 0 ? app.util.request({
        url: "/index/deletePhoto",
        data: {
          member_id: member_id,
          photo: that.data.photoName[w]
        },
        method: "POST",
        success: function(res) {
          console.log("刪除")
          console.log(res)
          that.data.photoName.splice(Number(w), 1)
        },
        fail: function(res) {
          debugger
          console.log("数据错误");
          console.log(res);
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }) : ''
    } else if (id == 3) {
      picsUp = that.data.company_logo, pics = "company_logo"
    }
    picsUp.splice(Number(w), 1)
    console.log(id)
    console.log(picsUp)
    console.log(pics)
    that.setData({
      [pics]: picsUp,
      layer: false
    })
  },
  queryImg(d) {
    let that = this
    let oldImg = d
    let newImg = []
    for (var i = 0; i < oldImg.length; i++) {
      let str = oldImg[i]
      if (str.indexOf("wxfile:") != -1 || str.indexOf("http:") != -1) {
        newImg.push(oldImg[i])
      }
    }
    return newImg
  },
  savaData(e) { //提交名片
    app.util.getFormId(wx.getStorageSync("member_id"), e)
    let that = this;
    if (that.data.savaStatus) {
      that.setData({
        savaStatus: !1,
        submitTxt: '提交中...'
      })
      let param = {}
      param = e.detail.value
      param.member_id = member_id

      console.log("提交名片参数")
      console.log(param)

      let newcard_logo = that.queryImg(that.data.card_logo)
      let newcompany_logo = that.queryImg(that.data.company_logo)
      let newPhoto = that.queryImg(that.data.photo)

      console.log("需要上传的图片链接")
      console.log(newcard_logo)
      console.log(newcompany_logo)
      console.log(newPhoto)
      //提交表单
      app.util.request({
        url: "/index/createCard",
        data: param,
        method: "POST",
        success: function(res) {
          // debugger
          if (newcard_logo.length > 0 || newcompany_logo.length > 0 || newPhoto.length > 0) {
            that.setData({
                upLoadStatus: !1
              }),
              newcard_logo.length > 0 && app.util.uploadFile({
                url: '/index/createCardImg',
                path: newcard_logo, //这里是选取的图片的地址数组
                name: 'card_logo',
                _this: that,
                formData: {
                  'content-type': 'multipart/form-data',
                  member_id: member_id,
                  card_logo: newcard_logo,
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
              }),
              newcompany_logo.length > 0 && app.util.uploadFile({
                url: '/index/createCardImg',
                path: newcompany_logo, //这里是选取的图片的地址数组
                name: 'company_logo',
                _this: that,
                formData: {
                  'content-type': 'multipart/form-data',
                  member_id: member_id,
                  company_logo: newcompany_logo,
                },
                picUpSuccess: function(res) {
                  console.log("公司logo上传成功")
                  console.log(res)
                  setTimeout(function() {
                    that.setData({
                      upLoadStatus: !0
                    })
                  }, 1000)
                }
              }),
              newPhoto.length > 0 && app.util.uploadFile({
                url: '/index/createCardImg',
                path: newPhoto, //这里是选取的图片的地址数组
                name: 'photo',
                _this: that,
                formData: {
                  'content-type': 'multipart/form-data',
                  member_id: member_id,
                  photo: newPhoto
                },
                picUpSuccess: function(res) {
                  console.log("个人照片上传成功")
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
                submitTxt: '提交成功'
              })
              // debugger
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '提交成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
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
            submitTxt: '提交'
          })
        }
      });
    }
  }
})
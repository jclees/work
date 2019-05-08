// pages/test/test.js
const app = getApp()
let type, product_id, member_id = 0,
  windowWRPX = 750;
Page({
  data: {
    banner: [],
    picture: [],
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
    cutT: 0,
  },
  onLoad: function(s) {
    // debugger
    member_id = wx.getStorageSync('member_id'),
      this.getData(),
      this.getCate();
  },
  delCate(a) {
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    let that = this,
      w = a.currentTarget.dataset.w;
    // debugger
    wx.showModal({
      title: '提示',
      content: '是否确认删除该分类',
      success(res) {
        if (res.confirm) {
          app.util.request({
            url: "/cateDel",
            data: {
              member_id: member_id,
              cate_id: that.data.cates[w].id
            },
            success: function(t) {
              console.log("删除分类"), console.log(t);
              if (t.data.errno == 0) {
                that.getCate()
              }
              wx.showToast({
                title: t.data.message,
                icon: "none"
              })
            },
            fail: function(t) {
              console.log("数据错误"), console.log(t), wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 3000
              })
            }
          });
        }
      }
    })
  },
  getCate: function(t) {
    var a = this;
    app.util.request({
      url: "/cateShow",
      data: {
        member_id: member_id
      },
      success: function(t) {
        console.log("分类"), console.log(t);
        a.setData({
          cates: t.data.cates
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  getData() {
    let that = this
    app.util.request({
      url: "/mallconf/getConf",
      data: {
        member_id: member_id
      },
      success: function(res) {
        // debugger
        console.log("详情")
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            dataList: res.data.config,
          })

          if (res.data.config.banner[0].bannerName) {
            let banner = that.getIMG(res.data.config.banner)
            console.log(banner)
            that.setData({
              banner: banner.url,
              bannerName: banner.name[0]
            })
            type = 1
          } else {
            type = 0
          }

        } else {
          type = 0

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
  bindchoose(e) {
    let which = e.currentTarget.dataset.which,
      t = this,
      a, s,
      w, h, i, n;
    if (which == 1) {
      w = 480, h = 216, i = 'banner', a = t.data.banner, s = 3
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
  getIMG(d) {
    let obj = {}
    obj.url = []
    obj.name = []
    for (var i = 0; i < d.length; i++) {
      obj.url.push(d[i].url)
      obj.name.push(d[i].bannerName)
    }
    return obj
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
  savaData(e) { //提交数据
    app.util.getFormId(wx.getStorageSync("member_id"), e)
    let that = this
    if (that.data.savaStatus) {
      that.setData({
        savaStatus: !1,
        submitTxt: '提交中...'
      })
      let url
      let param = {}
      param = e.detail.value
      param.member_id = member_id

      let banner = that.queryImg(that.data.banner)
      console.log("提交参数")
      console.log(param)

      let picture = that.queryImg(that.data.picture)
      if (type == 1) {
        url = "/mallconf/addConfig"
        param.banner = that.data.bannerName[0]
      } else {
        url = "/mallconf/addConfig"
      }
      //提交表单
      app.util.request({
        url: url,
        data: param,
        method: "POST",
        success: function(res) {
          console.log("提交表单")
          console.log(res)
          if (res.data.code == 200) {
            if (banner.length > 0) {
              that.setData({
                  upLoadStatus: !1
                }),
                banner.length > 0 && app.util.uploadFile({
                  url: "/mallconf/addConfig",
                  path: banner, //这里是选取的图片的地址数组
                  name: 'banner',
                  _this: that,
                  formData: {
                    'content-type': 'multipart/form-data',
                    member_id: member_id,
                    banner: banner,
                    mall_name: param.mall_name
                  },
                  picUpSuccess: function(res) {
                    console.log("产品展示图上传成功")
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
          } else {
            console.log(res);
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            });
            that.setData({
              savaStatus: !0,
              submitTxt: '提交'
            })
          }
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
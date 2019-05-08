// pages/test/test.js
const app = getApp()
let type, member_id = 0,
  windowWRPX = 750;
Page({
  data: {
    banner: [],
    image: [],
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
    member_id = wx.getStorageSync("member_id")
    this.getData()

    // s.type ? (type = s.type, this.getData()) : (type = 0)
  },
  getData() {
    let that = this
    app.util.request({
      url: "/network/index",
      data: {
        member_id: member_id
      },
      success: function(res) {
        // debugger
        console.log("官网")
        console.log(res)
        if (res.data.code == 200) {
          let banner = that.getIMG(res.data.data.banner)
          let image = that.getIMG(res.data.data.image)
          that.setData({
            dataList: res.data.data,
            banner: banner.url,
            bannerName: banner.name,
            image: image.url,
            imageName: image.name
          })
          type = 1
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
    } else if (which == 2) {
      w = 300, h = 600, i = 'image', a = t.data.image, s = 1
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
      obj.name.push(d[i].imgName)
    }
    return obj
  },
  openPic(e) {
    let that = this
    var current = e.target.dataset.url;
    var curIndex = e.target.dataset.index;
    var id = e.currentTarget.dataset.id;
    var urls;
    if (id == 1) {
      urls = that.data.banner
    } else if (id == 2) {
      urls = that.data.image
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: urls // 需要预览的图片http链接列表  
    })
  },
  delPic(e) {
    let that = this,
      picsUp,
      pics,
      id = e.currentTarget.dataset.id,
      w = e.currentTarget.dataset.w,
      delNamearr,
      delName,
      param = {};

    if (type == 0) {
      if (id == 1) {
        picsUp = that.data.banner, pics = "banner";
      } else if (id == 2) {
        picsUp = that.data.image, pics = "image";
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要删除吗',
        success: function(res) {
          if (res.confirm) {
            param.id = that.data.dataList.id
            param.member_id = member_id
            if (id == 1) {
              param.banner = that.data.bannerName[w],
                delName = that.data.bannerName,
                delNamearr = 'bannerName',
                picsUp = that.data.banner,
                pics = "banner";
            } else if (id == 2) {
              param.image = that.data.imageName[w],
                delName = that.data.imageName,
                delNamearr = 'imageName',
                picsUp = that.data.image, pics = "image";
            }
            console.log("删除参数")
            console.log(param)
            app.util.request({
              url: "/network/deleteInfoImg",
              data: param,
              method: "POST",
              success: function(res) {
                debugger
                console.log(res)
                if (res.data.code == 200) {
                  picsUp.splice(Number(w), 1)
                  delName.splice(Number(w), 1)
                  that.setData({
                    [pics]: picsUp,
                    [delNamearr]: delName
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
              }
            });
          }
        }
      })
    }
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
      let that = this
      let url
      let param = {}
      param = e.detail.value
      param.member_id = member_id
      that.setData({
        savaStatus: !1,
        submitTxt: '提交中...'
      })

      let banner = that.queryImg(that.data.banner)
      let image = that.queryImg(that.data.image)
      if (type == 1) {
        url = "/network/updateInfo"
        param.id = that.data.dataList.id
      } else {
        url = "/network/addInfo"
      }
      console.log("提交参数")
      console.log(param)
      //提交表单
      app.util.request({
        url: url,
        data: param,
        method: "POST",
        success: function(res) {
          console.log("提交表单")
          console.log(res)
          let insertId = res.data.id ? res.data.id : that.data.dataList.id

          if (res.data.code == 200) {
            if (banner.length > 0 || image.length > 0) {
              that.setData({
                upLoadStatus: !1
              })
              banner.length > 0 && app.util.uploadFile({
                  url: "/network/uploadImage",
                  path: banner, //这里是选取的图片的地址数组
                  name: 'banner',
                  _this: that,

                  formData: {
                    'content-type': 'multipart/form-data',
                    id: insertId,
                    banner: banner,
                  },
                  picUpSuccess: function(res) {
                    console.log("公司banner上传成功")
                    console.log(res)
                    setTimeout(function() {
                      that.setData({
                        upLoadStatus: !0
                      })
                    }, 1000)
                  }
                }),
                image.length > 0 && app.util.uploadFile({
                  url: "/network/uploadImage",
                  path: image, //这里是选取的图片的地址数组
                  name: 'image',
                  _this: that,
                  formData: {
                    'content-type': 'multipart/form-data',
                    id: insertId,
                    image: image
                  },
                  picUpSuccess: function(res) {
                    console.log("内容图上传成功")
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
            })
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
// pages/test/test.js
const app = getApp()
let type, product_id, windowWRPX = 750,
  member_id = 0;

Page({
  data: {
    show: [],
    picture: [],
    share: [],
    dataList: {
      cate_name: null
    },
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
  popLock: function(event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  onLoad: function(s) {
    s.is_nullposter && this.setData({
      pop1: true
    });
    // debugger
    member_id = wx.getStorageSync('member_id')
    if (s.product_id) {
      product_id = s.product_id
      this.getData()
      type = 1
    } else {
      type = 0
    }
    this.getCate()
    // s.type ? (type = s.type, this.getData()) : (type = 0)
  },
  select(t) {
    app.util.getFormId(wx.getStorageSync("member_id"), t);
  },
  bindPickerChange(e) { //所有picker index
    // debugger
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this
    let val = e.detail.value
    console.log(that.data.cates)
    console.log(that.data.cateName)
    console.log(that.data.cates[val].name)

    that.setData({
      cateName: that.data.cates[val].name
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
      url: "/proView",
      data: {
        product_id: product_id
      },
      success: function(res) {
        // debugger
        console.log("产品详情")
        console.log(res)
        if (res.data.code == 200) {
          let show = that.getIMG(res.data.products.show)
          let picture = that.getIMG(res.data.products.picture)
          let share = that.getIMG(res.data.products.share_img)
          that.setData({
            dataList: res.data.products,
            show: show.url,
            showName: show.name,
            picture: picture.url,
            pictureName: picture.name,
            share: share.url,
            cateName: res.data.products.cate_name
          })
        } else {}
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
      a, w, h, i, n, s;
    if (which == 1) {
      w = 300, h = 170, i = 'show', a = t.data.show, s = 3
    } else if (which == 2) {
      w = 300, h = 600, i = 'picture', a = t.data.picture, s = 1
    } else if (which == 3) {
      w = 477, h = 477, i = 'share', a = t.data.share, s = 2
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
      obj.name.push(d[i].picName || d[i].showName)
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
      urls = that.data.show
    } else if (id == 2) {
      urls = that.data.picture
    } else if (id == 3) {
      urls = that.data.share
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
      w = e.currentTarget.dataset.w,
      delName,
      delNamearr,
      url, param = {};
      debugger
    if (type == 0) {
      if (id == 1) {
        picsUp = that.data.show
        pics = "show"
      } else if (id == 2) {
        picsUp = that.data.picture
        pics = "picture"
      } else if (id == 3) {
        picsUp = that.data.share
        pics = "share"
      }
      picsUp.splice(Number(w), 1)
      that.setData({
        [pics]: picsUp
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要删除吗',
        success: function(res) {
          if (res.confirm) {
            param.product_id = that.data.dataList.id
            param.member_id = member_id
            if (id == 1) {
              url = "/delShow"
              param.showName = that.data.showName[w]
              delName = that.data.showName
              delNamearr = 'showName'
              picsUp = that.data.show
              pics = "show"
            } else if (id == 2) {
              url = "/delPic"
              param.picName = that.data.pictureName[w]
              delName = that.data.pictureName
              delNamearr = 'pictureName'
              picsUp = that.data.picture
              pics = "picture"
            } else if (id == 3) {
              url = "/delShare"
              picsUp = that.data.share
              pics = "share"
            }
            console.log(param)
            app.util.request({
              url: url,
              data: param,
              method: "POST",
              success: function(res) {
                console.log(res)
                if (res.data.code == 200 || res.data.errno == 0) {
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
      });
    };
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
    app.util.getFormId(wx.getStorageSync("member_id"), e);
    let that = this;
    if (that.data.savaStatus) {
      that.setData({
        savaStatus: !1,
        submitTxt: '提交中...'
      })
      let url;
      // let a = true;
      let param = {};
      param = e.detail.value;
      param.member_id = member_id;

      console.log("提交参数");
      console.log(param);

      let show = that.queryImg(that.data.show);
      let picture = that.queryImg(that.data.picture);
      let share = that.queryImg(that.data.share);
      if (type == 1) {
        url = "/proUp"
        param.product_id = that.data.dataList.id
      } else {
        url = "/proAdd"
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
            // debugger
            let insertId = res.data.product_id ? res.data.product_id : that.data.dataList.id;
            if (show.length > 0 || share.length > 0 || picture.length > 0) {
              that.setData({
                upLoadStatus: !1
              })
              show.length > 0 && app.util.uploadFile({
                url: "/uploadProShow",
                path: show, //这里是选取的图片的地址数组
                name: 'show',
                _this: that,
                formData: {
                  'content-type': 'multipart/form-data',
                  product_id: insertId,
                  show: show,
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
              share.length > 0 && app.util.uploadFile({
                url: "/uploadShare",
                path: share, //这里是选取的图片的地址数组
                _this: that,
                name: 'share',
                formData: {
                  'content-type': 'multipart/form-data',
                  product_id: insertId,
                  show: share,
                },
                picUpSuccess: function(res) {
                  console.log("分享图上传成功")
                  console.log(res)
                  setTimeout(function() {
                    that.setData({
                      upLoadStatus: !0
                    })
                  }, 1000)
                }
              });
              picture.length > 0 && app.util.uploadFile({
                url: "/uploadProPic",
                path: picture, //这里是选取的图片的地址数组
                _this: that,
                name: 'picture',
                formData: {
                  'content-type': 'multipart/form-data',
                  product_id: insertId,
                  picture: picture
                },
                picUpSuccess: function(res) {
                  console.log("产品详情图上传成功")
                  console.log(res)
                  setTimeout(function() {
                    that.setData({
                      upLoadStatus: !0
                    })
                  }, 1000)
                }
              })
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
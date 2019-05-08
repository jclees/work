// pages/test/test.js
const app = getApp()
let type, member_id = 0, parent_id = 0, user_flag;
Page({
  data: {
    banner: [],
    image: [],
    currentTab:0
  },
  onLoad: function(s) {
    parent_id = wx.getStorageSync("parent_id")
    member_id = wx.getStorageSync("member_id")
    user_flag = wx.getStorageSync("user_flag")
    // this.getData()
    // s.type ? (type = s.type, this.getData()) : (type = 0)
  },
  onShow(){
    member_id = wx.getStorageSync("member_id")
    this.getData()
  },
  navbarTap(e) {
    let that = this
    let id = e.currentTarget.dataset.typeid
    wx.showLoading({
      title: '加载中...'
    })
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    that.getProducts(id)
  },
  getData() {
    let that = this
    that.getProducts(0)
    that.getCate()
  },
  getCate(id) {
    // debugger
    let that = this
    app.util.request({
      url: "/cateShow",
      data: {
        member_id: user_flag == 1 ? parent_id : member_id
      },
      success: function (d) {
        // debugger
        console.log("分类")
        console.log(d)
        let obj = {}
        obj.id = 0
        obj.name = "全部"
        d.data.cates.unshift(obj)
        that.setData({
          cates: d.data.cates
        })
      },
      fail: function (res) {
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  getProducts(c) {
    // debugger
    console.log({
      cate_id: c,
      member_id: user_flag == 1 ? parent_id : member_id
    })
    let that = this
    app.util.request({
      url: "/proIndex",
      data: {
        cate_id:c,
        member_id: user_flag == 1 ? parent_id : member_id
      },
      success: function (d) {
        wx.hideLoading()
        // debugger
        console.log("产品列表")
        console.log(d)
        that.setData({
          shops: d.data.index
        })
      },
      fail: function (res) {
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  delProduct(e){
    let that = this
    let prodId = e.currentTarget.dataset.productid
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success:function(res){
        if (res.confirm == true){
          app.util.request({
            url: "/proDel",
            data: {
              product_id: prodId
            },
            success: function (d) {
              // debugger
              console.log("删除")
              console.log(d)
              if(d.data.code == 200){
                wx.showToast({
                  title: "删除成功",
                  icon: "none"
                })
                that.getProducts(0)
              }
            },
            fail: function (res) {
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
    console.log(e)
    that.setData({
      textareaShow: false,
      layer: true,
      preview: e.currentTarget.dataset.url,
      previewIndex: e.currentTarget.dataset.index,
      delid: e.currentTarget.dataset.id
    })
  },
  closePic() {
    let that = this
    that.setData({
      textareaShow: true,
      layer: false
    })
  },
  delPic() {
    let that = this,
      picsUp, pics, id = that.data.delid,param = {};
    param.id = that.data.dataList.id
    param.member_id = member_id

    if (id == 1) {
      param.banner = that.data.bannerName[that.data.previewIndex],picsUp = that.data.banner, pics = "banner";
    } else if (id == 2) {
      param.image = that.data.imageName[that.data.previewIndex],picsUp = that.data.image, pics = "image";
    }
    console.log("删除参数")
    console.log(param)
    app.util.request({
      url: "/network/deleteInfoImg",
      data: param,
      method: "POST",
      success: function (res) {
        // debugger
        console.log(res)
      },
      fail: function (res) {
        debugger
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
    picsUp.splice(Number(that.data.previewIndex), 1)
    // console.log(id)
    // console.log(picsUp)
    // console.log(pics)
    that.setData({
      [pics]: picsUp,
      layer: false
    })
  },
  bindchoose(e) {
    let that = this,
      id = e.currentTarget.dataset.id
    if (id == 1) {
      app.util.chooseImage({
        count: 1,
        success(res) {
          let banner = that.data.banner.concat(res)
          that.setData({
            banner: banner
          })
        }
      })
    } else if (id == 2) {
      app.util.chooseImage({
        count: 6,
        success(res) {
          let image = that.data.image.concat(res)
          that.setData({
            image: image
          })
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
    let that = this
    let url
    let a = false
    let param = {}
    param = e.detail.value
    param.member_id = member_id
    wx.showLoading({
      title: '提交中..',
    })
    console.log("提交参数")
    console.log(param)

    let banner = that.queryImg(that.data.banner)
    let image = that.queryImg(that.data.image)
    if(type == 1){
      url = "/network/updateInfo"
      param.id = that.data.dataList.id
    }else{
      url = "/network/addInfo"
    }
    //提交表单
    app.util.request({
      url: url,
      data: param,
      method: "POST",
      success: function(res) {
        console.log("提交表单")
        console.log(res)
        let insertId = res.data.id ? res.data.id : that.data.dataList.id
        
        if (res.data.code == 200){
          //banner图上传
          banner.length > 0 ? app.util.uploadFile({
            url: "/network/uploadImage",
            path: banner, //这里是选取的图片的地址数组
            name: 'banner',
            formData: {
              'content-type': 'multipart/form-data',
              id: insertId,
              banner: banner,
            },
            picUpSuccess: function (res) {
              console.log("公司banner上传成功")
              console.log(res)
              a = true
              // let data = JSON.parse(res.data);
              // data && data.data.card_logo_img && (card_logo_img = data.data.card_logo_img)
            }
          }) : (a = true)

          //内容图上传
          image.length > 0 ? app.util.uploadFile({
            url: "/network/uploadImage",
            path: image, //这里是选取的图片的地址数组
            name: 'image',
            formData: {
              'content-type': 'multipart/form-data',
              id: insertId,
              image: image
            },
            picUpSuccess: function (res) {
              console.log("内容图上传成功")
              console.log(res)
              a = true
            }
          }) : (a = true)


          let timer = setInterval(function () {
            if (a) {
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '提交成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: "/dbs_masclwlcard/pages/tab/tab"
                    })
                  }
                }
              })
              clearInterval(timer)
            }
          }, 1000)
        }else{
          console.log(res);
          wx.showToast({
            title: res.data.msg,
            icon: "none"
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
})
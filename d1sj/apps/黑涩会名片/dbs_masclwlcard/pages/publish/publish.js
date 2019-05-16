const app = getApp()
// const common = require('../../assets/js/common');
// const setting = require('../../assets/js/setting');
// const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    img_url: app.data.imgUrl,
    index: 0,
    savaStatus: true,
    items: [],
    photos: [], //图片数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      txtWord: wx.getStorageSync('configData').txtWord || ''
    })
    that.getCate()
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
  getCate: function (t) {
    var a = this;
    app.util.request({
      url: "/news/types",
      data: {},
      success: function (t) {
        console.log("分类"), console.log(t);
        a.setData({
          cates: t.data.data
        });
      },
      fail: function (t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  choose: function() { //选取图片
    let that = this;
    let photos = that.data.photos;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        photos = photos.concat(tempFilePaths);
        that.setData({
          photos: photos
        });
      }
    })
  },
  openPhoto: function(event) { //打开图片
    let that = this;
    console.log(event);
    // wx.previewImage({
    //   current: e.currentTarget.dataset.url, // 当前显示图片的http链接
    //   urls: that.data.pics // 需要预览的图片http链接列表
    // })
    that.setData({
      layer: true,
      preview: event.currentTarget.dataset.url,
      previewIndex: event.currentTarget.dataset.index
    });
  },
  closePic: function() { //关闭图片
    let that = this;
    that.setData({
      layer: false
    });
  },
  delPic: function() {
    let that = this;
    let picsUp = that.data.photos;
    picsUp.splice(that.data.previewIndex, 1);
    that.setData({
      photos: picsUp,
      layer: false
    });
  },
  textareaChange(e) {
    let that = this
    that.setData({
      textareaVal: e.detail.value
    })
  },
  filterStr(val) {
    var inputContent = val;
    var arrMg = this.data.txtWord;
    var showContent = inputContent;
    for (var i = 0; i < arrMg.length; i++) {
      var r = new RegExp(arrMg[i], "ig");
      showContent = showContent.replace(r, "**");
    }
    return showContent;
  },
  savaData(e) { //提交
    let that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let savaStatus = that.data.savaStatus;
    let param = e.detail.value;
    param.member_id = that.data.member_id
    if (!savaStatus) {
      return
    }
    let pics = that.data.photos
    if (that.data.textareaVal == '' || that.data.textareaVal == null) {
      wx.showToast({
        title: '请输入标题',
        icon:"none"
      })
      return
    }
    that.setData({
      savaStatus: false
    })
    wx.showNavigationBarLoading()
    // let words
    // if (that.data.txtWord != ""){
    //   words = that.filterStr(that.data.textareaVal)
    // }else{
    //   words = that.data.textareaVal
    // }
   

    console.log(param)
    app.util.request({
      url: "/news/add",
      data: param,
      method: "POST",
      success: function (res) {
        console.log("发表");
        console.log(res);

        if (res.data.errno == 0) {
          prevPage.setData({
            nav_footer_active: 2
          })
          if (pics.length <= 0) {
            wx.showToast({
              title: '发表成功',
              icon: 'none'
            })
            setTimeout(function () {
              wx.hideNavigationBarLoading()
              wx.navigateBack({
                delta: 2
              })
            }, 1000)
          } else {
            app.uploadimg({
              url: 'https://dongguanicard.weixingzpt.com/api/news/addimgs', //这里是你图片上传的接口
              path: pics, //这里是选取的图片的地址数组
              news_id: res.data.data.news_id,
              picUpSuccess: function (res) {
                console.log(res)
                wx.showToast({
                  title: '发表成功',
                  icon:'none'
                })
                setTimeout(function () {
                  wx.hideNavigationBarLoading()
                  wx.navigateBack({
                    delta: 2
                  })
                }, 1000)
              }
            });
          }
        } else {
          that.setData({
            savaStatus: true
          })
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }

      },
      fail: function (res) {
        console.log("数据错误");
        console.log(res);
        that.setData({
          savaStatus: true
        })
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    });
  },
})
const app = getApp()
const common = require('../../assets/js/common');
const setting = require('../../assets/js/setting');
const publicMethod = require('../../assets/js/publicMethod');
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
    if (options.business_id) {
      that.setData({
        business_id: options.business_id,
        is_business: 1,
      })
    } else {
      that.setData({
        is_business: 2
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      txtWord: wx.getStorageSync('configData').txtWord || ''
    })
    that.getFansnear()
    that.getBan()
  },
  checkboxChange(e) {
    let checkVal = e.detail.value

    this.setData({
      checkVal: e.detail.value
    })
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
    console.log(11);
  },
  textareaChange(e) {
    let that = this
    that.setData({
      textareaVal: e.detail.value
    })
  },
  getBan(t) {
    let that = this;
    common.get('/content/isBan', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("禁言")
      console.log(res)
      if (res.data.errno == 0) {
        if (res.data.data.is_ban == 1) {
          wx.showModal({
            title: '禁言提示',
            content: '禁言截止到：' + res.data.data.ban_to,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      }
    }).catch(e => {
      console.log(e)
    })
  },
  getFansnear() {
    let that = this;
    common.get('/content/fansnear', {
      member_id: that.data.member_id,
      is_business: that.data.is_business
    }).then(res => {
      console.log("是否有通知开关")
      console.log(res)
      if (res.data.errno == 0) {
        if (res.data.data.is_fans == 1) {
          that.data.items.push({
            name: '1',
            value: '通知关注自己的人'
          })
        }
        if (res.data.data.is_near == 1) {
          that.data.items.push({
            name: '2',
            value: '告知周围三公里的用户'
          })
        }
        that.setData({
          items: that.data.items
        })
      }
    }).catch(e => {
      console.log(e)
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
    publicMethod.getFormId(e, this)
    let that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let savaStatus = that.data.savaStatus;
    if (!savaStatus) {
      return
    }
    let pics = that.data.photos
    if (that.data.textareaVal == '' || that.data.textareaVal == null) {
      app.showToast({
        title: '请输入标题',
      })
      return
    }
    that.setData({
      savaStatus: false
    })
    wx.showNavigationBarLoading()
    let checkVal = that.data.checkVal
    let words
    if (that.data.txtWord != ""){
      words = that.filterStr(that.data.textareaVal)
    }else{
      words = that.data.textareaVal
    }
    let param = {
      member_id: that.data.member_id,
      words,
      business_id: that.data.business_id,
      is_business: that.data.is_business
    }
    for (let i in checkVal) {
      if (checkVal[i] == 1) {
        param.is_fans = 1
      } else if (checkVal[i] == 2) {
        param.is_near = 1
      }
    }
    console.log(param)
    common.post('/content/createContent', param).then(res => {
      prevPage.setData({
        isReset: 1,
      })
      console.log(res)
      if (res.data.code == 200) {
        if (pics.length <= 0) {
          app.showToast({
            title: '发表成功',
          })
          setTimeout(function() {
            wx.hideNavigationBarLoading()
            app.turnBack(1)
          }, 1000)
        } else {
          app.uploadimg({
            url: setting.apiUrl + '/content/uploadImage', //这里是你图片上传的接口
            path: pics, //这里是选取的图片的地址数组
            content_id: res.data.content_id,
            picUpSuccess: function(res) {
              console.log(res)
              wx.hideNavigationBarLoading()
              app.showToast({
                title: '发表成功',
              })
              setTimeout(function() {
                wx.hideNavigationBarLoading()
                app.turnBack(1)
              }, 1000)
            }
          });
        }
      } else {
        that.setData({
          savaStatus: true
        })
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      that.setData({
        savaStatus: true
      })
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
})
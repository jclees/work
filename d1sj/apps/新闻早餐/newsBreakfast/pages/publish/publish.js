const app = getApp()
const common = require('../../assets/js/common');
const setting = require('../../assets/js/setting');

Page({
  data: {
    img_url: app.data.imgUrl,
    index: 0,
    photos: [], //图片数组
    address: [], //位置信息获取
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
    that.getData()
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
  position: function() {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.chooseLocation({
          success: function(res1) {
            that.setData({
              address: res1
            });
            console.log(that.data.address);
          }
        })
      }
    })
  },
  getData() {
    let that = this
    //获取咨询分类
    that.getCates()
  },
  getCates() { //获取咨询分类
    let that = this
    common.get('/cates', {
      member_id: that.data.member_id
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        console.log("/cates 成功")
        that.setData({
          znrIdData: res.data.cates
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/cates 接口获取数据失败",
      })
      console.log(e)
    })
  },
  bindPickerChange(e) {
    let that = this
    that.setData({
      index: e.detail.value,
      znrId: that.data.objectArray[index].id
    })
  },
  textareaChange(e) {
    let that = this
    that.setData({
      textareaVal: e.detail.value
    })
  },
  savaData() { //提交
    let that = this
    let pics = that.data.photos
    console.log(pics)
    if (that.data.textareaVal == '' || that.data.textareaVal == null) {
      app.showToast({
        title: '分享点新鲜事呗..',
      })
      return false
    }
    wx.showNavigationBarLoading()
    common.post('/addInfo', {
      member_id: that.data.member_id,
      content: that.data.textareaVal,
      informations_cate_id: that.data.znrId || '',
      location: that.data.address.address || ''
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {

        if (pics.length == 0) {
          wx.hideNavigationBarLoading()
          app.showToast({
            title: '发表成功',
          })
          app.turnBack(1)
        } else {
          app.uploadimg({
            url: setting.apiUrl + '/uploadImage', //这里是你图片上传的接口
            path: pics, //这里是选取的图片的地址数组
            information_id: res.data.insertId,
            picUpSuccess: function(res) {
              console.log(res)
              wx.hideNavigationBarLoading()
              app.showToast({
                title: '发表成功',
              })
              app.turnBack(1)
            }
          });
        }
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/sign/dosign 接口获取数据失败",
      })
      console.log(e)
    })
  },
})
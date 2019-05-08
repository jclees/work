const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: app.data.imgUrl,
    items: [{
      img: imgUrl + 'photo.jpg',
      name: '这是名字',
      centent: '这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这内容这是内容这是内容这是内容这是内容这是内容这是内容这内容这是内容这是内容这是内容这是内容这是内容这是内容这内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容',
      time: '两分钟前',
      unfold: false
    }, {
      img: imgUrl + 'photo.jpg',
      name: '这是名字',
      centent: '这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容',
      time: '两分钟前',
      unfold: false
    }, {
      img: imgUrl + 'photo.jpg',
      name: '这是名字',
      centent: '这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容',
      time: '两分钟前',
      unfold: false
    }, {
      img: imgUrl + 'photo.jpg',
      name: '这是名字',
      centent: '这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容',
      time: '两分钟前',
      unfold: false
    }, {
      img: imgUrl + 'photo.jpg',
      name: '这是名字',
      centent: '这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容',
      time: '两分钟前',
      unfold: false
    }, {
      img: imgUrl + 'photo.jpg',
      name: '这是名字',
      centent: '这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容',
      time: '两分钟前',
      unfold: false
    }, {
      img: imgUrl + 'photo.jpg',
      name: '这是名字',
      centent: '这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容',
      time: '两分钟前',
      unfold: false
    }, ]
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

  getData() {
    let that = this
    //消息
    that.getMsg()
  },
  getMsg() { //消息
    let that = this
    common.get('/message/info', {
      member_id: that.data.member_id
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          msgData: res.data.data
        })
      }else{
        app.showToast({
          title:res.data.msg
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/member/info 接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },

  // 展开隐藏
  unfold: function(event) {
    console.log(event.currentTarget.dataset);
    let currentUnfold = 'items[' + event.currentTarget.dataset.index + '].unfold'
    if (event.currentTarget.dataset.value == true) {
      this.setData({
        [currentUnfold]: false
      })
    } else {
      this.setData({
        [currentUnfold]: true
      })
    };
  }
})
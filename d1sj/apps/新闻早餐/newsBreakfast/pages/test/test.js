//把winHeight设为常量，不要放在data里（一般来说不用于渲染的数据都不能放在data里）
const winHeight = wx.getSystemInfoSync().windowHeight

const app = getApp()
const imgUrl = app.data.imgUrl
Page({
  data: {
    items: [{
      title: "第一届少儿足球比赛",
      txt: "第一届郑州足球比赛开幕式z乒启动计划",
      time: "2017年11月20日",
      images: '',
    }, {
      title: "第一届少儿足球比赛",
      txt: "第一届郑州足球比赛开幕式z乒启动计划",
      time: "2017年11月22日",
      images: '',
    }],
    ite: [{
      title: "第一届少儿足球比赛",
      txt: "第一届郑州足球比赛开幕式z乒启动计划",
      time: "2017年11月20日",
      images: "http://img2.niutuku.com/desk/1208/1401/ntk-1401-8806.jpg",
    }, {
      title: "第一届少儿足球比赛",
      txt: "第一届郑州足球比赛开幕式z乒启动计划",
      time: "2017年11月22日",
      images: "http://img2.niutuku.com/desk/1208/1401/ntk-1401-8806.jpg",
    }],
    imglist: [imgUrl + 'icon-star1.png' ,imgUrl + 'icon-star2.png', imgUrl + 'icon-star3.png']
  },
  internet: function () {
    let ite = this.data.ite;
    setTimeout(function () {
      this.setData({
        items: ite,
      })
    }.bind(this), 2000);
  },
  onLoad: function () {
    this.internet()
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imglist // 需要预览的图片http链接列表  
    })
  },
  onShow: function () {
  },
})
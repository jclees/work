// newsBreakfast.js
const app = getApp()
const imgUrl = app.data.imgUrl
let music = [{
  musicID: 0,
  musicName: '丹青千里',
  musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
  musicImg: imgUrl + 'posters_01.png'
}, {
  musicID: 1,
  musicName: '丹青千里1',
    musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
    musicImg: 'https://jclees.github.io/images/bg3.png'
}, {
  musicID: 2,
  musicName: '丹青千里2',
    musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
    musicImg: 'https://jclees.github.io/images/bg2.png'
}, {
  musicID: 3,
  musicName: '丹青千里3',
    musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
    musicImg: imgUrl + 'posters_01.png'
  }, {
    musicID: 3,
    musicName: '丹青千里3',
    musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
    musicImg: 'https://jclees.github.io/images/bg1.png'
  }, {
    musicID: 3,
    musicName: '丹青千里3',
    musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
    musicImg: imgUrl + 'posters_01.png'
  }, {
    musicID: 3,
    musicName: '丹青千里3',
    musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
    musicImg: 'https://jclees.github.io/images/bg1.png'
  }]

Page({
  data: {
    img_url: app.data.imgUrl,
    music: music,
    actImgSrc: music[0].musicImg
  },
  onReady: function () {

  },
  onLoad: function(event) {

  },
  switchImg(e){
    let that = this
    let imgSrc = e.currentTarget.dataset.src
    that.setData({
      actImgSrc: imgSrc
    })
  },
  previewImage(e) {
    var current = e.target.dataset.src;
    var arr = []
    arr.push(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: arr // 需要预览的图片http链接列表  
    })
  },
  popLock: function (event) {
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop3: app.globalData.pop3,
    });
  }
})
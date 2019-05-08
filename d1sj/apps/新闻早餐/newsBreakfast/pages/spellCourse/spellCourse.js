// newsBreakfast.js
const app = getApp()
const imgUrl = app.data.imgUrl
// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
let kecheng = [{
  img: '../../images/img-2.png',
  title: '第一课',
  text: '学而时习之，不亦说乎，监督岗你电话李立冬，阿士大夫。',
  num: 2236,
  time: '08-03 17:23'
}, {
  img: '../../images/img-2.png',
  title: '第一课',
  text: '学而时习之，不亦说乎，监督岗你电话李立冬，阿士大夫。',
  num: 2236,
  time: '08-03 17:23'
}, {
  img: '../../images/img-2.png',
  title: '第一课',
  text: '学而时习之，不亦说乎，监督岗你电话李立冬，阿士大夫。',
  num: 2236,
  time: '08-03 17:23'
}, {
  img: '../../images/img-2.png',
  title: '第一课',
  text: '学而时习之，不亦说乎，监督岗你电话李立冬，阿士大夫。',
  num: 2236,
  time: '08-03 17:23'
}]
let music = [{
  musicID: 0,
  musicName: '丹青千里',
  musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
  musicImg: imgUrl + 'album-art.png'
}, {
  musicID: 1,
  musicName: '丹青千里1',
  musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
  musicImg: imgUrl + 'album-art.png'
}, {
  musicID: 2,
  musicName: '丹青千里2',
  musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
  musicImg: imgUrl + 'album-art.png'
}, {
  musicID: 3,
  musicName: '丹青千里3',
  musicUrl: 'http://fs.w.kugou.com/201808221023/58948443a7c934ae9c2105923c986fb2/G085/M04/04/19/lQ0DAFh_OnOAEvaeAFAaxR3PVO4400.mp3',
  musicImg: imgUrl + 'album-art.png'
}]

let curriculum = [{
  img: imgUrl + 'img-2.png',
  title: '名师荔波：语文启蒙课一年级(上))',
  total: '2.3万',
  jishu: 15
}, {
  img: imgUrl + 'img-2.png',
  title: '名师荔波：语文启蒙课一年级(中))',
  total: '2.3万',
  jishu: 15
}, {
  img: imgUrl + 'img-2.png',
  title: '名师荔波：语文启蒙课一年级(下))',
  total: '2.3万',
  jishu: 15
}]

const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    img_url: app.data.imgUrl,
    duration: 0, //歌曲总时长(秒)
    currentTime: 0, //当前歌曲播放时间（秒）
    durationFormat: "00:00", //歌曲总时长(00:00)
    currentTimeFormat: "00:00", //当前歌曲播放时间(00:00)
    musicNum: 0, //默认播放第一首歌曲
    currentTimeStop: {}, //定时器
    autoplay: false, //是否自动播放,
    musicData: {}, //当前播放的歌曲名称，
    isMovingSlider: false, //滑动进度条改变播放时间 锁
    currentTimeSlider: 0, //滑动进度条时的显示时间（秒）
    currentTimeSliderFormat: 0, //滑动进度条时的显示时间（00:00）
    isPlay: true, //播放锁
    navActive: 1,
    music: music,
    curriculum: curriculum, //课程
    kecheng: kecheng,
    tab: 1,
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  /* 毫秒级倒计时 */
  countdown() {
    let that = this
    let total_micro_second = that.data.total_micro_second
    // 渲染倒计时时钟
    that.setData({
      msDjsName: "距结束仅剩",
      ms_days: that.dateformat(total_micro_second).days,
      ms_hr: that.dateformat(total_micro_second).hr,
      ms_min: that.dateformat(total_micro_second).min,
      ms_sec: that.dateformat(total_micro_second).sec,
      ms_micro_sec: that.dateformat(total_micro_second).micro_sec,
      pop1: app.globalData.pop1
    });

    if (total_micro_second <= 0) {
      that.setData({
        msDjsName: "活动已截止",
        total_micro_second: 0
      });
      // timeout则跳出递归
      return;
    }
    setTimeout(function() {
      // 放在最后--
      that.data.total_micro_second -= 10;
      that.countdown(that);
    }, 10)
  },
  // 时间格式化输出，如3:25:19 86。每10ms都会调用一次
  dateformat(micro_second) {    // 秒数
    var days = Math.floor(micro_second / (1000 * 60 * 60 * 24));
    var hr = Math.floor((micro_second % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var min = Math.floor((micro_second % (1000 * 60 * 60)) / (1000 * 60));
    var sec = Math.floor((micro_second % (1000 * 60)) / 1000);
    // 毫秒位，保留2位
    var micro_sec = Math.floor((micro_second % 1000) / 100);
    var obj = {}
    obj.days = days
    obj.hr = hr
    obj.min = min
    obj.sec = sec
    obj.micro_sec = micro_sec
    return obj;
  },
  tab1: function(event) {
    console.log();
    if (event.currentTarget.dataset.id == 1) {
      this.setData({
        tab: 1
      });
    } else {

      this.setData({
        tab: 2
      });
    }
  },
  listenerSlidering: function(event) {
    this.setData({
      currentTime: event.detail.value,
      currentTimeSlider: event.detail.value,
      isMovingSlider: true
    });
  },
  listenerSlider: function(event) {
    //获取滑动后的值
    this.setData({
      isMovingSlider: false
    });
    clearInterval(this.data.currentTimeStop);
    this.timer();
    innerAudioContext.seek(event.detail.value);
    innerAudioContext.play();
  },
  onLoad: function(event) {
    let that = this

    let psuccTimer = setTimeout(function(){
      that.setData({
        psucsSatus: true
      })
    },1000)
    setTimeout(function () {
      that.setData({
        psucsSatus: false
      })
    }, 3000)
    this.setData({
      total_micro_second: 600000 * 1000
    })
    this.countdown();
    innerAudioContext.autoplay = this.data.autoplay; //是否自动播放
    innerAudioContext.src = music[this.data.musicNum].musicUrl;
    this.musicData(this.data.musicNum);
    innerAudioContext.onPlay(() => {  
      this.setData({
        isPlay: false
      });

    });
    innerAudioContext.onWaiting(() => { //音乐加载中
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
      })
    });
    innerAudioContext.onEnded(() => { //音乐自然播放完成
      this.nextAudio();
    });
    innerAudioContext.onError((res) => {
      wx.showToast({
        title: '音频错误',
        icon: 'none',
      })
    });
  },
  timer: function() { //定时器
    let that = this;
    that.data.currentTimeStop = setInterval(function() {
      that.setData({
        duration: Math.round(innerAudioContext.duration),
        currentTime: Math.round(innerAudioContext.currentTime),
        durationFormat: that.secondsFormat(that.data.duration),
        currentTimeFormat: that.secondsFormat(that.data.currentTime),
        currentTimeSliderFormat: that.secondsFormat(that.data.currentTimeSlider)
      });
    }, 100);
  },
  play: function() { //开始播放
    let that = this;
    if (that.data.isPlay) { //开始播放
      innerAudioContext.play();
      that.timer();
    } else { //暂停播放
      innerAudioContext.pause();
      clearInterval(this.data.currentTimeStop);
      that.setData({
        isPlay: true
      });
    }
  },

  stop: function() { //停止播放
    innerAudioContext.stop();
    clearInterval(this.data.currentTimeStop);
  },
  beforeAudio: function() { //上一首
    clearInterval(this.data.currentTimeStop);
    if (this.data.musicNum > 0) {
      this.data.musicNum--;
    } else {
      this.data.musicNum = music.length - 1;
    }
    this.musicData(this.data.musicNum);
    innerAudioContext.src = music[this.data.musicNum].musicUrl;
    innerAudioContext.play();
    this.timer();
  },

  nextAudio: function() { //下一首
    clearInterval(this.data.currentTimeStop);
    if (this.data.musicNum + 1 < music.length) {
      this.data.musicNum++;
    } else {
      this.data.musicNum = 0;
    };
    this.musicData(this.data.musicNum);
    innerAudioContext.src = music[this.data.musicNum].musicUrl;
    innerAudioContext.play();
    this.timer();
  },

  cutAudio: function(event) { //点击切换Audio
    let num = event.currentTarget.dataset.id;
    this.musicData(num);
    innerAudioContext.src = music[num].musicUrl;
    innerAudioContext.play();
    this.timer();
  },

  secondsFormat: function(sec) { //秒转换
    let secondTime = parseInt(sec); // 秒
    let minuteTime = 0; // 分
    let hourTime = 0; // 小时
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
      if (minuteTime > 60) {
        hourTime = parseInt(minuteTime / 60);
        minuteTime = parseInt(minuteTime % 60);
      }
    }

    let result;
    let second = (parseInt(secondTime) >= 10 ? parseInt(secondTime) : '0' + parseInt(secondTime));
    let minute = (parseInt(minuteTime) >= 10 ? parseInt(minuteTime) : '0' + parseInt(minuteTime));
    let hour = (parseInt(hourTime) >= 10 ? parseInt(hourTime) : '0' + parseInt(hourTime));

    if (hourTime > 0) {
      result = `${hour}:${minute}:${second}`;
    } else {
      result = `${minute}:${second}`;
    }
    return result;
  },
  musicData: function(num) { //获取当前歌曲信息
    this.setData({
      musicData: {
        musicName: music[num].musicName,
        musicUrl: music[num].musicUrl,
        musicImg: music[num].musicImg,
      }
    });
  },
  popLock: function (event) {
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
    });
  },
  jumpPosters() {
    app.turnToPage('/pages/posters/posters')
  },
  shareWxpyq(){
    wx.showLoading({
      title: '生成海报中..',
    })
    wx.downloadFile({
      url: imgUrl + 'img-2.png',
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
            console.log(res)
          },
          fail: function (res) {
            wx.showToast({
              title: '生成海报失败',
              icon: 'none',
              duration: 2000
            })
            console.log(res)
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })

  }
})
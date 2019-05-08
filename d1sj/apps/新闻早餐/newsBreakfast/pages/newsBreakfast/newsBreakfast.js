// newsBreakfast.js
const app = getApp()
const imgUrl = app.data.imgUrl

let music = [{
  musicID: 0,
  musicName: '丹青千里',
  musicUrl: 'http://fs.w.kugou.com/201808281349/4e73d2165a0a431957c469466f30a526/G090/M0A/10/07/-oYBAFi9k32AOUNlAFBdC38pXks694.mp3',
  musicImg: imgUrl + 'album-art.png'
}, {
  musicID: 1,
  musicName: '丹青千里1',
    musicUrl: 'http://fs.w.kugou.com/201808281349/4e73d2165a0a431957c469466f30a526/G090/M0A/10/07/-oYBAFi9k32AOUNlAFBdC38pXks694.mp3',
  musicImg: imgUrl + 'album-art.png'
}, {
  musicID: 2,
  musicName: '丹青千里2',
    musicUrl: 'http://fs.w.kugou.com/201808281349/4e73d2165a0a431957c469466f30a526/G090/M0A/10/07/-oYBAFi9k32AOUNlAFBdC38pXks694.mp3',
  musicImg: imgUrl + 'album-art.png'
}, {
  musicID: 3,
  musicName: '丹青千里3',
    musicUrl: 'http://fs.w.kugou.com/201808281349/4e73d2165a0a431957c469466f30a526/G090/M0A/10/07/-oYBAFi9k32AOUNlAFBdC38pXks694.mp3',
  musicImg: imgUrl + 'album-art.png'
}]

let curriculum = [{
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
  onHide(){
    wx.playBackgroundAudio({
      dataUrl: 'http://fs.w.kugou.com/201808281349/4e73d2165a0a431957c469466f30a526/G090/M0A/10/07/-oYBAFi9k32AOUNlAFBdC38pXks694.mp3',
      title: '',
      coverImgUrl: ''
    })
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
  jumpPosters() {
    app.turnToPage('/pages/posters/posters')
  },
  jumpKcDetails(e){//跳转课程详情页面
    let types = e.currentTarget.dataset.id
    if (types == 'try'){
      app.turnToPage('/pages/courseDetails/courseDetails')
    } else if (types == 'pin'){
      app.turnToPage('/pages/spellCourse/spellCourse')
    }
  }
})
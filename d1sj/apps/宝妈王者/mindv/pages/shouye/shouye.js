// pages/shouye/shouye.js
const app=getApp();

var total_micro_second = 180/60 * 60 * 60 * 1000;
var time = '';

/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "00:00:00"
    });
    // timeout则跳出递归
    return;
  }
  time = setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that);
  }, 10)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = fill_zero_prefix(Math.floor(second / 3600));
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  return hr + ":" + min + ":" + sec;
}
// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
Page({
  data: {
    clock: '',
    tupian: app.globalData.imgUrl,
    user_info:app.getUserInfo(),
    showModalStatus: false,
    is_sponsor:0
  },
  onLoad: function (options={}) {
    this.powerSet('frist')//设置
    let user_info = app.getUserInfo();
    !user_info || this.getUserInfo();
    let is_fpk = typeof options.is_fpk!='undefined' && options.is_fpk;//是否好友对战
    let pk_id = typeof options.pk_id!='undefined' && options.pk_id;//
    let _path = '/pages/duizhan/duizhan?room_id='+options.room_id+'&to_client_id='+options.to_client_id+'&uid='+options.uid+'&is_fpk=1';
    count_down(this);
    //_path = '/pages/duizhan/duizhan?is_auto_answer=1&room_id=o8MwD5tehCKiWle6wTsSYGIvB6DU&to_client_id=o8MwD5tehCKiWle6wTsSYGIvB6DU&uid=217&is_fpk=1';
    //       app.turnToPage(_path+'&pk_id=3924');
    if(is_fpk==1 && options.uid){//跳转对战
      
      let apiurl = 'user/is_friends'; //加好友
      app.getdata.fetchApi(apiurl,{to_user_id:options.uid,room_id:options.room_id})
      .then(d => {
          let data = d.data;
          if(pk_id){
            //wx.setStorageSync('is_auto_answer',1);//自动答
            _path = _path+'&is_auto_answer='+options.is_auto_answer+'&pk_id='+pk_id;
            app.turnToPage(_path);
          }else{
            if(data.sponsor_flag==1){
              app.turnToPage(_path);
            }else{
              console.log('房主离开')
              app.turnToPage('/pages/likai/likai');
            }
          }
      })
      
    }
  },
  showok: function () {
    let that = this;
    let apiurl = 'user/get_bank_points'; 
    app.getdata.fetchApi(apiurl,{})
    .then(d => {
      if (d.status==1) {
          let data = d.data;
          if(data.points>0){
            total_micro_second = 180/60 * 60 * 60 * 1000;
            count_down(this);
             wx.showToast({
              title: '荣耀金币+'+data.points,
              icon: 'success',
              duration: 2000
            })
          }
      } else {
          wx.showToast({
              title: d.message,
              icon: 'loading',
              duration: 2000
          })
      }
    })
    .catch(e => {
      this.setData({ subtitle: '获取数据异常', loading: false })
      console.error(e)
    })
    
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)  
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;
    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  powerSet:function(e){
    if (e == "frist") {
        var currentSend = e;
        var currentSound = e;
    } else {
        var currentSound=e.target.dataset.sound
        var currentSend=e.target.dataset.send
    }
    let apiurl = 'user/is_setting';
    app.getdata.fetchApi(apiurl, { is_send: currentSend,is_sound:currentSound })
      .then(d => {
        if (d.status == 1) {
            this.setData({
                is_check:d.data.is_check,
                is_send_check: d.data.is_send_check,
                sound:d.data.sound,
                send:d.data.send
            })
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
        console.error(e)
      })
  },
  paiwei: function (e) {
    //e.currentTarget.dataset
    app.turnToPage('/pages/paiwei/paiwei');

  },
  friendsPk: function (params={}) {
    let room_id = 0;
    let to_client_id = 0;
    if(params.room_id && params.to_client_id){
      room_id = params.room_id;
      to_client_id = params.to_client_id;
    }else{
      room_id = wx.getStorageSync('client_id');
      to_client_id = wx.getStorageSync('client_id');
    }
    //room_id = 'o8MwD5tehCKiWle6wTsSYGIvB6DU';
    //to_client_id = 'o8MwD5tehCKiWle6wTsSYGIvB6DU';
    
		console.log(room_id);

  app.turnToPage('/pages/duizhan/duizhan?room_id='+room_id+'&to_client_id='+to_client_id+'&is_fpk=1');
  }, 
  getUserInfo: function () {
    let that = this;
    let apiurl = 'user/get_user_info'; 
    let params = {}
    app.getdata.fetchApi(apiurl,params)
    .then(d => {
      if (d.status==1) {
          this.isReq = true;
          let data = d.data;
          app.setUserInfoStorage(data);//更新本地用户缓存信息
          total_micro_second =data.clock;
          this.setData({ user_info:data })
      } else {
          this.setData({ hasMore: false, loading: false })
      }
    })
    .catch(e => {
      this.setData({ subtitle: '获取数据异常', loading: false })
      console.error(e)
    })
    
  },
  onShow: function (e) {
    wx.setStorageSync('room_id');
    let is_sponsor = this.data.is_sponsor?this.data.is_sponsor:wx.getStorageSync('is_sponsor');
    this.setData({
      'is_sponsor':is_sponsor
    });
    if(this.isReq){
      this.getUserInfo();
    }
    
  },
  factory: function (e) {
    let user_info = app.getUserInfo();
    if(user_info.check_status==0){
      app.showModal({content: '暂未开通，敬请留意！'});
      return;
    }
    app.turnToPage('/pages/rychuti/rychuti');
  },

  onShareAppMessage: function (res) {
    let that = this;
    let user_info = app.getUserInfo();
    //let _path = '/pages/duizhan/duizhan?room_id='+user_info.openid+'&to_client_id='+user_info.openid+'&uid='+user_info.id+'&is_fpk=1';
    let _path = '/pages/shouye/shouye?room_id='+user_info.openid+'&to_client_id='+user_info.openid+'&uid='+user_info.id+'&is_fpk=1';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)

      return {
        title: user_info.display_name+' 向你发起知识挑战，看谁知道面更广！',
        path: _path,
        success: function(res) {
          // 转发成功
          that.data.is_sponsor = 1;
          console.log(res);
          wx.setStorageSync('is_sponsor',that.data.is_sponsor);//设置发起者标志
          that.setData({
            'is_sponsor':that.data.is_sponsor
          });
          that.friendsPk({room_id:user_info.openid,to_client_id:user_info.openid,uid:user_info.id});//分享成功后进入pk
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    /*
    
     return {
      title: user_info.display_name+' 向你发起知识挑战，看谁知道面更广！',
      path: _path,
      success: function(res) {
        // 转发成功
        console.log(res);
        wx.setStorageSync('is_sponsor',1);//设置发起者标志
        that.setData({
          'is_sponsor':wx.getStorageSync('is_sponsor')
        });
        that.friendsPk({room_id:user_info.openid,to_client_id:user_info.openid,uid:user_info.id});//分享成功后进入pk
      },
      fail: function(res) {
        // 转发失败
      }
    }
    */
  }

});
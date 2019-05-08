import socket from '../../utils/socket'
import { formatTime } from '../../utils/util'
const app = getApp()

var is_fpk = 0;//是否是好友对战
var client_id = wx.getStorageSync('member_id') //当前登录用户
//var score = 0;
var time = '';
var time_1 = '';
var time_2 = '';
var time_3 = '';
var rtime = '';
var from_client_id = ''; //目前只有好友pk才有
var to_client_id = ''; //wx.getStorageSync('to_client_id');//对战用户
var is_auto_answer = 0; //0&&wx.getStorageSync('is_auto_answer');//是否自动回答 0,1(机器人或者分享挑战用户：1)

//计时
var x = 25,
  y = 25,
  radius = 20; //x坐标，y坐标长度, radius圆角
var aa = {};

// pages/duizhan/duizhan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    title: "",
    smallmodel: true,
    messages: {}, //发送消息
    animation: {},
    animation_2: {},
    tap: "tapOff",
    height: 0,
    msg: '',
    emotionBox: false,
    emotions: [],

    count: 0, // 设置 计数器 初始为0
    wgnum: 0,
    pkBtn: 3,
    countTimer: '',
    checked: false,
    flagIng: false,
    flag_type: 0,
    isShow: true,
    consume_point: 0, //段位金币数
    score: 0, //当前累计分数
    th_score: 0, //本题得分
    seconds: 10, //初始秒数
    total_seconds: 10, //倒数秒数
    curr_subject_index: 0, //当前题目下标
    continu_right_num: 0, //连续答对
    temp_continu_right_num: 0, //临时连续答对
    user_curr_answer: {}, //用户每题答案
    user_answer_info: {}, //用户答题所有信息
    user_all_answer: [], //全部答案
    is_all_answer: [], //是否双方都回答了题目
    subject_info: {}, //题目信息
    user_data: {}, //用户数据
    subjects: {} //题目

  },

  chooseEmotion(e) {
    //表情
    //console.log('emotion:'+e.target.dataset.name)
    let that = this;
    let emotion = "[" + e.target.dataset.name + "]";
    let room_id = wx.getStorageSync("room_id");
    let data = {
      action: "send_msg",
      msg_type: "2",
      client_uid: client_id,
      room_id: room_id,
      content: "" + emotion + ""
    };

    socket.sendMessage(data);

    setTimeout(function () {
      that.setData({
        emoFlag: false
      });
    }, 200);
  },

  //获取题目
  getSubjectInfo(data, type = 0) {//获取题目
    let that = this;
    if (type = 1) {
      // let apiurl = 'pk/getQuestions';  
      let apiurl = 'Questions/getQestionAnswer';
      let params = {
        room_id: data.room_id,
        to_user_id: data.uid,
        is_auto_answer: is_auto_answer,
        pk_id: data.pk_id
      }

      app.getdata.fetchApi(apiurl, params).then(d => {
        if (d.status == 1) {
          that.data.subject_info.subjects = d.data.subjects;
          that.data.subject_info.pk_id = d.data.pk_id;
          that.score_scale = d.data.score_scale;
          that.answer = d.data.answer;
          that.user_answer = d.data.user_answer;

          console.log(that.data.subject_infos);  //题目信息

          this.data.subjects = this.data.subject_info.subjects; //题目
          wx.setStorageSync('from_client_info', d.data.from_client_info);
          wx.setStorageSync('to_client_info', d.data.to_client_info);
          this.setData({
            from_client_info: wx.getStorageSync('from_client_info'),
            to_client_info: wx.getStorageSync('to_client_info'),
            subject: this.data.subjects[this.data.curr_subject_index] //默认显示第一题
          });

        } else {
          this.setData({
            hasMore: false,
            loading: false
          });
        }
      }).catch(e => {
        this.setData({
          subtitle: '数据获取异常',
          loading: false
        });
      })
    } else {
      console.log('这里不是好友对战');

      let d = data.questions;
      that.data.subject_info.subjects = d.subject; //题目
      that.data.subject_info.pk_id = d.pk_id; //
      that.score_scale = d.score_scale; //分数
      that.answer = d.answer;   //回答
      that.user_answer = d.user_answer; //机器人回答
      this.data.subjects = this.data.subject_info.subjects; //题目

      this.setData({
        subject: this.data.subjects[this.data.curr_subject_index]
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    this.drawProgressbg();
    client_id = wx.getStorageSync('client_id') //当前用户ID
    is_fpk = typeof options.is_fpk !== 'undefined' && options.is_fpk; //是否好友对战
    that.data.consume_point = typeof options.gold !== 'undefined' && options.gold;

    this.resetInfo();
    socket.onLogin(options);

    if (is_fpk = 1 && options.id) {
      wx.setStorageSync('to_client_id', 0);
      wx.setStorageSync('to_client_info', 0);
      wx.setStorageSync('room_id', options.home_id); //*****这个会影响是否重新登陆
    };
    if (is_fpk == 1 && options.id && options.id != client_id) {
      let is_auto_answer = typeof options.is_auto_answer != 'undefined' && options.is_auto_answer;
      wx.setStorageSync('is_sponsor', 0);
      wx.setStorageSync('to_client_id', options.to_client_id); //pk用户id
      wx.setStorageSync('is_auto_answer', is_auto_answer);
    }
    else if (is_fpk == 1 && typeof options.to_client_id == client_id) { //如果进入房间的用户是自己
      wx.setStorageSync('is_sponsor', 1); //设置发起者标志
    }

    socket.onMessage(data => {
      //console.log(data)
      is_auto_answer = wx.getStorageSync("is_auto_answer"); //是否自动回答 0,1(机器人或者分享挑战用户：1)

      console.log(is_auto_answer);
      if (is_auto_answer == 1) {
        //自动答
        setTimeout(function () {
          that.data.flagIng = true;
          if (is_fpk == 1) {
            //好友pk2018/3/12
            that.getSubjectInfo(options, 1); //
          } else {
            that.getSubjectInfo(data); //
          }

          that.showPk();
        }, 2000);
      } else if (is_fpk == 1) {
        //好友对战类型
        if (data.action == "login") {
          //登陆成功回调
          console.log(99999999);
          console.log(wx.getStorageSync("to_client_id"));
          let to_client_id = wx.getStorageSync("to_client_id");
          let is_sponsor = wx.getStorageSync("is_sponsor");
          if (options.to_client_id == client_id) {
            to_client_id = 0;
          }
          console.log("匹配" + wx.getStorageSync("client_id"));

          socket.sendMessage({
            action: "match_friends_succ",
            client_uid: client_id,
            to_client_id: to_client_id,
            is_sponsor: is_sponsor,
            is_auto_answer: is_auto_answer
          }); //发送匹配玩家指令
        }
        if (data.action == "match_friends_succ" && data.match_status == 1) {
          //等待双方匹配成功，同时进入pk页面 && data.client_uid!=client_id
          that.getSubjectInfo(data); //
          that.friendsPk(
            {
              type: 1
            },
            data
          );
          that.data.flagIng = true;
        } else if (data.action == "match_fpk_succ") {
          //发起方确认答题开始
          //that.getSubjectInfo(data);//
          that.friendsPk(
            {
              type: 2
            },
            data
          );
        } else if (data.action == "fpk_wg_succ") {
          let is_sponsor = wx.getStorageSync("is_sponsor");
          let from_client_info = data.from_client_info;
          let to_client_info = data.to_client_info;
          let pkBtn = 2; //围观

          if (data.type == 2) {
            that.data.wgnum = data.wg_room_num;
            pkBtn = !data.is_entry || 1;
            wx.showToast({
              title: "用户进入观战",
              icon: "success",
              duration: 2000
            });
            if (data.client_uid == client_id) {
              /*this.setData({
                user_info:{},
                from_client_info:{}
              })*/
            }
          } else if (data.type == 1) {
            wx.showToast({
              title: "用户进入比赛",
              icon: "success",
              duration: 2000
            });
            that.data.wgnum = data.wg_room_num;
            if (data.is_entry != client_id) {
              pkBtn = 3;
            }
          }
          if (to_client_info.openid != client_id && data.type == 1) {
            //好友
            from_client_info = data.from_client_info;
            to_client_info = data.to_client_info;
          } else if (is_sponsor || to_client_info.openid == client_id) {
            //房主
            from_client_info = data.to_client_info;
            to_client_info = data.from_client_info;
          }
          this.setGzFlag(data); //
          this.setData({
            user_info: {},
            from_client_info: from_client_info,
            to_client_info: to_client_info,
            pkBtn: pkBtn,
            wgnum: that.data.wgnum,
            entry_id: data.is_entry
          });
        } else if (data.action == "leave_group") {
          //对战用户中途退出
          //if(data.type==2){//离开房间
          this.stopAnwser(2, data);
          return;
          //let is_sponsor = wx.getStorageSync('is_sponsor');
          /*if(client_id!=data.client_uid && !is_sponsor){
            app.showModal({content:'房主跑路了～，房间解散！',confirm:function(){
              app.turnBack();
            }});
            return;
          }*/
          //}
        }
      } else {
        //
        if (data.action == "login") {
          //登陆成功回调
          //socket.sendMessage({"action":"match_succ","client_uid":client_id,'is_auto_answer':is_auto_answer});//发送匹配玩家指令
        }
        if (data.action == "match_succ" && data.match_status == 1) {
          //等待双方匹配成功，同时进入pk页面data.client_uid!=client_id
          that.getSubjectInfo(data); //
          that.showPk();
          that.data.flagIng = true;
        }
      }
    });

    let emotions = [];
    for (let i = 1; i < 18; i++) {
      let j = i;
      if (j < 10) {
        j = '00' + i;
      } else {
        j = '0' + i;
        emotions.push({
          src: "../../static/images/face-icons-flat/smiley_" + j + ".png",
          id: i,
          name: "smiley_" + j
        });
      }
    }

    //好友对战类型

    let show_step = 1;
    if (is_fpk == 1) {
      show_step = 6;
      this.friendsPk();
    }

    clearTimeout(rtime);
    if (that.data.flagIng == false && is_fpk == 0) {
      rtime = setTimeout(function () {
        if (that.data.flagIng == false) {
          client_id = wx.getStorageSync('client_id');
          console.log('10s没有匹配用户，发送机器人指令' + client_id);
          socket.sendMessage({
            action: 'match_succ',
            client_uid: client_id,
            is_auto_answer: 1,
            is_robot: 1
          }); //发送匹配玩家指令
        }
      }, 10000);
    }

    this.setData({
      emotions: emotions,
      total_seconds: this.data.total_seconds,
      step: show_step,
      tupian: app.globalData.imgUrl,
      user_info: app.getUserInfo(),
      consume_point: that.data.consume_point
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  targetAnwser() {    //对方回答完成

    if (typeof this.data.user_answer_info[to_client_id] != 'undefined') {
      this.data.user_answer_info[to_client_id].showanswer = true;
      this.setData({
        user_info2: this.data.user_answer_info[to_client_id]  //被挑战用户
      });
    }
  },

  countdown(seconds) {  //
    //倒计时 
    let that = this;
    this.data.seconds = seconds; //当前秒数
    if (seconds == 0) {
      clearTimeout(time); //终止当前倒计时
      this.targetAnswer(); //对方回答完成

      this.setData({
        publish_is_right: 1 //公布正确答案
      });
      time_1 = setTimeout(function () {
        that.nextQuestion(); //进入下一题
      }, 2000);
      return;
    } else {
      time = setTimeout(function () {
        let diff_second = seconds - 1;
        that.setData({
          seconds: diff_second
        });
        that.countdown(diff_second);
      }, 1000);
    }

  },

  drawProgressbg() {//第一个圆
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(7); // 设置圆环的宽度
    ctx.setStrokeStyle('#ffffff'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(30, 30, 25, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },


  drawCircle(step) { //倒计时圆环
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#f55c6f");
    gradient.addColorStop("0.5", "#f55c6f");
    gradient.addColorStop("1.0", "#f55c6f");

    context.setLineWidth(5);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(30, 30, 25, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  bindFriendsPk(e) {    //开始比赛

    let that = this;
    let fpk_status = e.currentTarget.dataset.fpk_status;
    let is_sponsor = e.currentTarget.dataset.is_sponsor;
    let is_entry = e.currentTarget.dataset.is_entry; //对战用户
    if (fpk_status == 1 && is_sponsor == 1 && is_entry) {
      //发送开始指令
      socket.sendMessage({
        action: "match_fpk_succ",
        client_uid: client_id
      }); //
    } else {
      app.showModal({
        content: "房间参赛人数不足，赶快邀请好友吧!"
      });
    }
  },
  bindFriendsWg(e) {    //围观

    let that = this;
    let fpk_status = e.currentTarget.dataset.fpk_status;
    let is_sponsor = e.currentTarget.dataset.is_sponsor;
    let to_client_id = wx.getStorageSync("to_client_id");
    if (fpk_status == 1 && !is_sponsor) {
      //发送开始指令
      socket.sendMessage({
        action: "fpk_wg_succ",
        client_uid: client_id,
        to_client_id: to_client_id,
        type: 2
      }); //用户观战
    }
  },
  bindFriendsCs(e) {    //参赛

    let that = this;
    let fpk_status = e.currentTarget.dataset.fpk_status;
    let is_sponsor = e.currentTarget.dataset.is_sponsor;
    let to_client_id = wx.getStorageSync("to_client_id");
    if (fpk_status == 1 && !is_sponsor) {
      //发送开始指令
      socket.sendMessage({
        action: "fpk_wg_succ",
        client_uid: client_id,
        to_client_id: to_client_id,
        type: 1
      }); //用户参赛
    }
  },
  bindLeaveGroup(e) {    //放弃比赛

    clearTimeout(time_2);
    app.showModal({
      content: "是否放弃对战，并离开房间?",
      confirm: function () {
        socket.sendMessage({
          action: "leave_group",
          client_uid: client_id,
          type: 2
        }); //
        app.turnBack();
      },
      showCancel: true
    });
  },
  showPk() {//显示用户pk信息
    
    let that = this;
    this.setData({
      step: 2,
      from_client_info: wx.getStorageSync("from_client_info"),
      to_client_info: wx.getStorageSync("to_client_info")
    });
    setTimeout(function () {
      that.readyAnswer(); //准备开始答题
    }, 2000);
  },
  readyAnswer(options) {
    let that = this;
    this.setData({
      step: 3  //显示题目界面
    });
    this.startAnswer(this.data.total_seconds); //开始答题

    socket.onMessage(deta => {
      console.log(data);
      this.data.message = data;

      if (data.action == 'leave_group') {
        that.stopAnwser(2, data);
      };


      if (typeof this.data.user_answer_info[data.client_uid] != 'undefined' && this.data.user_answer_info[data.client_uid]) {
        //累计用户数据
        this.data.score = this.data.user_answer_info[data.client_uid]['score']; //当前累计得分
        this.data.th_score = this.data.user_answer_info[data.client_uid]['th_score']; //本题得分
        this.data.continu_right_num = this.data.user_answer_info[data.client_uid]['continu_right_num']; //
      } else {
        //用户首次初始数据
        this.data.score = 0;
        this.data.th_score = 0;
        this.data.continu_right_num = 0;
        this.data.temp.continu_right_num = 0;
      }

      let curr_subject_index = this.data.curr_subject_index + 1; //当前题
      let last_subject_index = 0; // 是否是最后一题
      if (curr_subject_index == this.data.subjects.length) {
        last_subject_index = 1;
      }

      if (data.msg_type == 1) {  // **********************
        //答题中

        this.data.user_curr_answer = data.content; //每次作答答案记录
        if (data.client_uid == client_id) {
          this.data.user_all_answer.push(this.data.user_curr_answer);  //当前用户全部答案
        }


        this.data.is_all_answer.push(data.content.answer_id);
        let curr_all_answer = [];
        curr_all_answer[data.content.question_id] = this.data.is_all_answer;


        //计算得分

        let answer_is_right = this.checkAnswer(this.data.subjects, data);
        let th_time_arr = this.score_scale; //{1:100,2:90,3:80,4:70,5:60,6:50,7:40,8:30,9:20,10:10}//得分比例

        if (answer_is_right) {
          let th_time = data.content.answer_seconds; //答对所用时间
          let max_score = 200; //单题最高的的分数
          let th_score_scale = th_time_arr[th_time] / 100; //时段分数百分比

          this.data.th_scale = max_score * th_score_scale; //本题得分

          //如果是最后一题，分数翻倍
          if (last_subject_index) {
            this.data.th_scale = this.data.th_scale * 2;  //得分翻倍
          }
          // 是否使用道具？？？？？？？？？ todo...

          this.data.score += this.data.th_score;  //把本题得分加到总分里面
          this.data.continu_right_num += 1;  //连续答对

        } else {
          //答错处理
          //上一次对的记录
          if (this.data.continu_right_num > this.data.temp_continu_right_num) {
            this.data.temp_continu_right_num = this.data.continu_right_num;
          };
          this.data.continu_right_num = 0; //清0

        }


        //最后答对最多数
        if (curr_subject_index == this.data.subjects.length && this.data.continu_right_num < this.data.temp_continu_right_num) {
          this.data.continu_right_num = this.data.temp_continu_right_num; /****************** */
        }

        let s_height = parseInt(this.data.score / 1200 * 100) + '%'; //显示得分比例   总分为1200
        let user_answer_item = {
          messages: data,
          s_height: s_height,
          score: this.data.scroe,
          th_score: this.data.th_score,
          continu_right_num: this.data.continu_right_num,
          client_id: data.client_uid,
          showAnswer: false
        }
        this.data.user_answer_info[data.client_uid] = user_answer_item; /******************* */



        to_client_id = wx.getStorageSync('to_client_id'); //对战用户
        //双方本题作答完毕，才显示对方答案

        if (this.data.is_all_answer.length == 2) { //两个用户都回答完毕
          this.data.is_all_answer == [];
          this.targetAnwser(); //对方回答完成
          that.countdown(0);
          that.countInterval(true);
        } else if (is_auto_answer == 1) {
          //自动答题  
          if (data.client_uid == client_id && typeof this.data.user_answer_info[to_client_id] != 'undefined') {
            this.targetAnwser();//对方回答完成
          }
        }


        //此判断是解决多人观战显示数据
        let from_client_info = wx.getStorageSync('from_client_info');
        form.client_id = from_client_info.openid ? from_client_info.openid : client_id

        this.setData({
          data: user_answer_item,
          user_info1: this.data.user_answer_info[from_client_id], //挑战用户
          user_info2: this.data.user_answer_info[to_client_id], //被挑战用户
          last_subject_index: last_subject_index, //是不是最后一道题
          isShow: this.data.isShow
        });

      } else if (data.msg_type == 2) {
        this.setData({
          data2: data,
          //emoFlag: true,
          //showEmo: true
        });
        /* 不执行表情 */
        // setTimeout(function(){
        //   that.setData({
        //     //emoFlag: false,
        //     showEmo: false
        //   });
        // }, 2000);

        // // this.emotioning();//动画
      } else if (data.msg_type == 3) {
        that.setData({
          data: data
        });
      }

    });

  },

  startAnswer(data) {
    let that = this;
    time_3 = setTimeout(function () {
      that.setData({
        subject: that.data.subjects[that.data.curr_subject_indexs] //默认显示第一题
      });

      if (is_auto_answer == 1) {
        that.autoAnswer();
      }
      that.countdown(data); //倒计时
      that.countInterval();
    }, 2000);

  },

  friendsPk(params = {}, data = {}) {
    //好友PK
    let that = this;

    wx.setStorageSync('grad_id', 0); //好友PK清空段位id

    let is_sponsor = wx.getStorageSync('is_sponsor');

    if (params.type == 1) {
      this.setGzFlag(data);
      this.setData({
        fpk_status: 1,
        is_sponsor: is_sponsor,
        entry_id: data.is_entry,
        pkBtn: data.is_entry == client_id ? 2 : 3 //判断对战操作是否参赛或者围观按钮
      });
    } else if (params.type == 2) {
      setTimeout(function () {
        that.readyAnswer(); //准备开始答题
      }, 2000);
    }

    if (params.type != 2) {
      this.setData({
        is_sponsor: is_sponsor,
        from_client_info: wx.getStorageSync('from_client_info'),
        to_client_info: wx.getStorageSync('to_client_info')
      });
    }


  },

  setGzFlag(data) {
    let is_sponsor = wx.getStorageSync('in_sponsor');
    if (typeof data.is_entry != 'undefined' && data.is_entry.length > 10 && data.in_entry != client_id && !is_sponsor) {
      //设置观战者用户标志，不是房主
      wx.setStorageSync('is_gz_flag', 1);
    } else {
      wx.setStorageSync('is_gz_flag', 0);
    }
  },

  autoAnswer(data = {}) {   //自动答题
    let that = this;
    let curr_subject_index = this.data.curr_subject_index;
    let answer = {};
    let answer_item = {};
    if (curr_subject_index == 9999) {
      return;
    };

    //用户答题记录
    answer = that.user_answer;

    answer_item = answer[curr_subject_index];  //当前题目
    let time = answer_item.answer_seconds * 1000; //答题时间

    time_2 = setTimeout(function () {
      that.selAnswer({}, answer_item)
    }, time);

  },

  selAnswer(e, answer_data = '') {//选择答案
    let is_gz_flag = wx.getStorageSync('is_gz_flag');  //观战者
    let is_sponsor = wx.getStorageSync('is_sponsor');
    let user_curr_answer = {};   //用户每题答案
    if (is_gz_flag && !is_sponsor && !is_auto_answer) {
      console.log('观战者不能答题');
      return;
    };
    if (this.data.message && this.data.user_answer_info[client_id]) {
      //判断双方是否已经选择了该题答案
      user_curr_answer = this.data.message && this.data.user_answer_info[client_id].messages.content;
    }

    let answer = {};
    let question_id = 0;
    let answer_id = 0;
    let answer_val = 0;
    let answer_seconds = 0;
    let client_uid = '';
    let item_data = this.data.subjects[this.data.curr_subject_index]

    if (is_auto_answer && answer_data) { //系统自动答题
      question_id = answer_data.question_id;  //题目id
      answer_id = answer_data.answer_id;  //答案ID
      answer_val = answer_data.answer_val; //答案值
      answer_seconds = answer_data.answer_seconds; //答题秒数
      client_uid = wx.getStorageSync('to_client_id');
    } else { //用户手动答题
      question_id = e.currentTarget.dataset.question_id;
      answer_id = e.currentTarget.dataset.answer_id;
      answer_val = e.currentTarget.dataset.right;
      answer_seconds = this.data.total_seconds - parseInt(this.data.seconds);
      client_uid = client_id;

      //防止用户重复答题
      if ((user_curr_answer && user_curr_answer.question_id == question_id) || this.data.seconds <= 0) {
        console.log('用户重复答题或者答题时间到');
        return false;
      }
    }

    answer.subject_cate_id = item_data.subject_cate_id; //科目大类
    answer.subject_id = item_data.subject_id; //科目子类
    answer.question_id = question_id; //题目id
    answer.answer_id = answer_id; //答案ID
    answer.answer_val = answer_val; //答案值
    answer.answer_seconds = answer_seconds;  //答题秒数

    if (parseInt(this.data.seconds) > 0 && answer.answer_seconds == 0) {
      //作答时间不到一秒，按照一秒处理
      answer.answer_seconds = 1;
    }

    let room_id = wx.getStorageSync('room_id');
    let data = {
      action: 'send_msg',
      msg_type: '1',
      room_id: room_id,
      client_uid: client_uid,
      content: '' + JSON.stringify(answer) + ''
    };
    socket.sendMessage(data);
  },

  resetInfo() {
    //wx.setStorageSync('to_client_id',''); //***重置对战用户to_client_id,暂时注释
    wx.setStorageSync('from_client_info', '');
    wx.setStorageSync('to_client_info', '');
    wx.setStorageSync('is_auto_answer', 0); //清除自动标志2018-03-26 17:16:51
    wx.setStorageSync('is_gz_flag'); //观战者
    this.data.user_answer_info = {};
  },
  countInterval(flag = false) { //定时器
    let that = this;
    that.data.count = 0;
    clearInterval(that.countTimer);

    //设置倒计时， 定时器 每100毫秒执行依次，计数器count+1, 耗时6秒绘一圈

    that.countTimer = setInterval(function () {
      if (flag) {
        that.data.count = 101;
      };
      if (that.data.count <= 100) {
        /* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        that.drawCirele(that.data.count / (100 / 2));
        that.data.count++;
      } else {
        that.setData({
          progress_txt: ''
        });
        clearInterval(that.countTimer);
      }
    }, 100);

  },

  nextQuestion() { //下一题
    let that = this;
    clearTimeout(time);
    clearTimeout(time_1); //终止下一题倒计时 

    this.clearAnswer();  //清空上题

    this.data.curr_subject_index = this.data.curr_subject_index + 1;
    that.setData({
      seconds: this.data.total_seconds,
      subject: this.data.subjects[this.data.curr_subject_index],
      curr_subject_index: that.data.curr_subject_index
    });

    let curr_subject_index = this.data.curr_subject_index + 1;
    if (curr_subject_index == this.data.subjects.length) {

      //如果是最后一题，is_last_subject 设置为true，一秒后设置为false
      that.setData({
        is_last_subject: true
      });

      setTimeout(function () {
        that.setData({
          is_last_subject: false
        });
      }, 1000);

      console.log('最后一题分数翻倍')
    }

    //下一题

    if (this.data.curr_subject_index < this.data.subjects.length) {
      if (is_auto_answer == 1) {
        this.autoAnswer();
        that.countdown(this.data.total_seconds);
        that.countInterval();
      } else {
        console.log('没有题目了');
        that.data.flagIng = false;
        that.setData({
          isShow: false,
          curr_subject_index: this.data.curr_subject_index
        });

        // ***
        from_client_id = from_client_id ? from_client_id : client_id;
        // 分数
        let score_total = typeof this.data.user_answer_info[from_client_id] != 'undefined' ? this.data.user_answer_info[from_client_id].score : 0;

        let to_user_score_total = typeof this.data.user_answer_info[to_client_id] != 'undefined' ? this.data.user_answer_info[to_client_id].score : 0;

        let grad_id = wx.getStorageSync('grad_id') ? wx.getStorageSync('grad_id') : 0;

        let is_gz_flag = wx.getStorageSync('is_gz_flag'); //是否是观战者

        let data = {
          is_gz_flag: is_gz_flag,
          flag_type: this.data.flag_type,
          grad_id: grad_id,
          pk_id: this.data.subject_info.pk_id,
          score_total: score_total,
          to_user_score_total: to_user_score_total,
          answer: JSON.stringify(this.data.user_all_answer),
          user_answer: JSON.stringify(this.user_answer)
        }

        //将数据上传服务器
        //
        //
        //success回调this作用域更新不了外面的数据,所以保存当前this


        let apiurl = "Questions/saveUserAnswer"; //排位和好友pk
        if (is_gz_flag) {
          apiurl = 'Questions/gzUserAnswer' //观战结果
        }

        app.getdata.fetchApi(apiurl, data).then(d => {
          if (d.statue == 1) {
            let data = d.data;
            console.log(data);

            let showpage = data.is_win = 1 ? 4 : data.is_win == 2 ? 5 : 5
            wx.setStorageSync('is_auto_answer');
            that.setData({
              step: showpage,
              result: data
            });
          } else {
            this.setData({
              hasMore: false,
              loading: false
            });
          }
        }).catch(e => {
          this.setData({
            subtitle: '获取数据异常',
            loading: false
          });
          console.log(e);
        });

      }
    }

  },

  clearAnswer() { //清楚上题动作
    this.data.is_all_answer = [];   //清空双方 是否回答题目
    this.setData({
      message: {},    //清空当前用户题 ***猜的 暂时不太确定，等api到了后看
      publish_is_right: 0  //清空当前正确答案
    });

  },

  stopAnwser(type = 1, data = {}) {    //中途停止答题

    let is_sponsor = wx.getStorageSync('is_sponsor');
    let room_id = wx.getStorageSync('room_id');

    if (this.data.falgIng == true && this.data.curr_subject_index < 5 && !is_fpk) {
      this.data.flagIng = false; // PK结束
      this.data.curr_subject_index = 9999;
      this.countInterval(true);
      this.countdown(0);  //中途退出，停止倒计时

      if (type = 2) {
        this.data.flag_type = 2;
        app.showModal({
          title: '对方放弃了战斗',
          content: '你赢得了胜利！'
        });
      } else {
        this.data.flag_type = 1;
        app.showModal({
          title: '你放弃了战斗',
          content: '损失了 ' + this.data.consume_point + ' 个金币'
        });
      }
    } else if (type == 2) {
      let to_client_id = wx.getStorageSync('to_client_id');
      client_id = wx.getStorageSync('client_id');

      if (this.data.falgIng == true && to_client_id == data.client_uid && !is_sponsor) {
        //好友界面提示
        app.showModal({
          title: '房主跑路了，房间解散',
          confirm: function () {
            app.turnBack();
          }
        });
      } else if (this.data.flagIng == true && is_sponsor) {
        //房主界面提示
        wx.showToast({
          title: 'PK用户跑路了',
          icon: 'success',
          duration: 2000
        });
        return
      }
    }
  },
  checkAnswer(subjects, data) {
    let is_right = 0;
    if (!subjects || !data) {
      return
    }
    for (let i = 0; i < subjects.length; i++) {
      let item = subjects[i];
      if (item.id == data.conteng.question_id) {
        for (let j = 0; j < item['answer'].length; j++) {
          let item_answer = item['answer'][j];
          if (item_answer.is_right && item_answer.is_right == data.content.answer_val) {
            is_right = 1;
          }
        }
      }
    }
    return is_right;
  },




})
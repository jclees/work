import socket from "../../utils/socket";
import {
  formatTime
} from "../../utils/util";
let common = require('../../assets/js/common');
const app = getApp();

//设置对战用户信息
/*wx.setStorageSync('client_id','7f00000108fc000013cc2');
wx.setStorageSync('to_client_id','7f00000108fc000013cc1');
wx.setStorageSync('is_auto_answer',1);*/

//var score = 0;
var time = "";
var time_1 = "";
var time_2 = "";
var time_3 = "";
var rtime = "";
var client_id = wx.getStorageSync("client_id"); //当前用户
var from_client_id = ""; //目前只有好友pk才有
var to_client_id = ""; //wx.getStorageSync('to_client_id');//对战用户
var is_auto_answer = 0; //0&&wx.getStorageSync('is_auto_answer');//是否自动回答 0,1(机器人或者分享挑战用户：1)
var is_fpk = 0; //是否好友对战 0,1
var pw_type = ""; //1,现金赛 2，排位赛

//计时
var x = 25,
  y = 25,
  radius = 20; //x坐标，y坐标长度, radius圆角

Page({
  data: {
    img_url: app.data.url,
    animationpka: {},
    animationpkb: {},
    confirmFlag: true,
    isShowToast: true,
    title: "",
    smallmodel: true,
    messages: {}, //发送消息
    animation: {},
    animation_2: {},
    tap: "tapOff",
    height: 0,
    msg: "",
    emotionBox: false,
    emotions: [],

    count: 0, // 设置 计数器 初始为0
    wgnum: 0,
    pkBtn: 3,
    countTimer: "",
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
    subjects: {}, //题目
    tupian: app.data.tupian,
    level: '',
    result: '',
    shareGold: '',
    is_fpk: '',
    is_right_num1: false,
    is_right_num2: false,
    is_lock:true
  },

  onShow: function () {
    console.log(this.data)
  },

  chooseEmotion(e) {
    //表情
    //console.log('emotion:'+e.target.dataset.name)
    let that = this;
    let emotion = "[" + e.target.dataset.name + "]";
    let room_id = wx.getStorageSync("home_id");
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
  getSubjectInfo(data, type = 0) {
    //pk题目列表
    let that = this;

    if (is_fpk == 1) {
      common.post('/pk/updatehome', {
        home_id: this.options.home_id,
        type: 1 //准备
      }).then(res => {
        console.log('房间状态修改为1');
        console.log(res)
      }).catch(e => {
        console.log('房间状态修改为1的时候失败');
      })
    }


    if (type == 1) {
      //题目数据 好友历史记录pk
      let apiurl = "Questions/getQestionAnswer"; //getQuestionsPk
      let params = {
        room_id: data.room_id,
        to_user_id: data.uid,
        is_auto_answer: is_auto_answer,
        pk_id: data.pk_id
      };
      app.getdata
        .fetchApi(apiurl, params)
        .then(d => {
          console.log('这里是d的数据');
          console.log(d);
          if (d.status == 1) {
            that.data.subject_info.subjects = d.data.subject;
            that.data.subject_info.pk_id = d.data.pk_id;
            that.score_scale = d.data.score_scale;
            that.answer = d.data.answer;
            that.user_answer = d.data.user_answer; //机器人回答

            console.log(that.data.subject_info);
            //题目信息
            this.data.subjects = this.data.subject_info.subjects; //题目
debugger
            wx.setStorageSync("from_client_info", d.data.from_client_info),
              wx.setStorageSync("to_client_info", d.data.to_client_info),
              this.setData({
                from_client_info: wx.getStorageSync("from_client_info"),
                to_client_info: wx.getStorageSync("to_client_info"),
                subject: this.data.subjects[this.data.curr_subject_index] //默认显示第一题
              });
          } else {
            this.setData({
              hasMore: false,
              loading: false
            });
          }
        })
        .catch(e => {
          this.setData({
            subtitle: "获取数据异常",
            loading: false
          });
          console.error(e);
        });
    } else {
      console.log(33333333333);

      //socket.sendMessage({"action":"send_subject","client_uid":client_id,'is_auto_answer':is_auto_answer});//发送获取题目指令

      console.log(is_auto_answer);
      let d = data.questions;
      console.log(d);
      // if (d == {}) {
      //   app.showModal({
      //     content: '数据发生紊乱'
      //   })
      //   return false;
      // }
      that.data.subject_info.subjects = d.subject;
      that.data.subject_info.pk_id = d.pk_id;
      that.score_scale = d.score_scale;
      that.answer = d.answer;
      that.user_answer = d.user_answer; //机器人回答
      that.data.subjects = that.data.subject_info.subjects; //题目

      that.setData({
        subject: d.subject[that.data.curr_subject_index] //默认显示第一题
      });
    }
  },
  onLoad(options = {}) {
    let that = this;
    if (options.duanwIndex) { //不同段位给不同的时间
      if (options.duanwIndex <= 2) {
        that.setData({
          seconds: 15,
          total_seconds: 15,
          countDown:150,
          max_seconds: 15,
        })
      } else if (options.duanwIndex <= 4) {
        that.setData({
          seconds: 14,
          total_seconds: 14,
          countDown: 140,
          max_seconds: 14
        })
      } else if (options.duanwIndex <= 6) {
        that.setData({
          seconds: 13,
          total_seconds: 13,
          countDown: 130,
          max_seconds: 13
        })
      } else if (options.duanwIndex <= 8) {
        that.setData({
          seconds: 12,
          total_seconds: 12,
          countDown: 120,
          max_seconds: 12
        })
      } else if (options.duanwIndex <= 10) {
        that.setData({
          seconds: 11,
          total_seconds: 11,
          countDown: 110,
          max_seconds: 11
        })
      } else if (options.duanwIndex <= 12) {
        that.setData({
          seconds: 10,
          total_seconds: 10,
          countDown: 100,
          max_seconds: 10
        })
      }
    } else {
      that.setData({
        seconds: 10,
        total_seconds: 10,
        countDown: 100,
        max_seconds: 10
      })
    }
    this.drawProgressbg();
    console.log("pk用户id");
    console.log(options);
    client_id = wx.getStorageSync("client_id");
    is_fpk = typeof options.is_fpk != "undefined" && options.is_fpk; //是否好友对战
    that.data.consume_point =
      typeof options.gold != "undefined" && options.gold;

    that.setData({
      level: wx.getStorageSync('grade'),
      shareGold: wx.getStorageSync('shareGold'),
      nickname: wx.getStorageSync('name'),
      avatar: wx.getStorageSync('image'),
      userInfo: wx.getStorageSync('userInfo'),
      store:wx.getStorageSync('store'),
      is_fpk: is_fpk
    });

    //////////////////////////////////////////////////
    this.resetInfo(); //对战信息重置 2018-02-23 15:10:31
    socket.onLogin(options); //登录

    if (is_fpk == 1 && options.to_client_id) {
      wx.setStorageSync("to_client_id", 0);
      wx.setStorageSync("to_client_info", 0);
      wx.setStorageSync("room_id", options.room_id); //*****这个会影响是否重新登陆
    }
    if (
      is_fpk == 1 &&
      options.to_client_id &&
      options.to_client_id != client_id
    ) {
      let is_auto_answer =
        typeof options.is_auto_answer != "undefined" && options.is_auto_answer;
      console.log("pk用户id" + options.to_client_id);
      wx.setStorageSync("is_sponsor", 0);
      wx.setStorageSync("to_client_id", options.to_client_id); //pk用户id
      wx.setStorageSync("is_auto_answer", is_auto_answer);
    } else if (
      is_fpk == 1 &&
      options.to_client_id &&
      options.to_client_id == client_id
    ) {
      //自己
      wx.setStorageSync("is_sponsor", 1); //设置发起者标志
    }
    //

    socket.onMessage(data => {
      is_auto_answer = wx.getStorageSync("is_auto_answer"); //是否自动回答 0,1(机器人或者分享挑战用户：1)
      console.log("444444444444444444444");
      console.log(is_auto_answer);
      if (is_auto_answer == 1) {
        //自动答
        console.log('进来自动答题了');
        // debugger
        if (data.action == "match_succ"){
          that.data.flagIng = true;
          if (is_fpk == 1) {
            //好友pk
            console.log("好友pk options")
            console.log(data)
            that.getSubjectInfo(options, 1);
          } else {
            //自动答题
            console.log("自动答题data")
            console.log("答案")
            for (var i in data.questions.subject) {
              
              console.log(data.questions.subject[i].answer) 
            }
            console.log(data)
            that.getSubjectInfo(data)
          }
          that.showPk();
        }
        // setTimeout(function () {
          
        // }, 2000);
      } else if (is_fpk == 1) {
        //好友对战类型
        if (data.action == "login") {
          //登陆成功回调
          console.log(99999999);
          console.log(data);
          console.log(wx.getStorageSync("to_client_id"));
          let to_client_id = wx.getStorageSync("to_client_id");
          let is_sponsor = wx.getStorageSync("is_sponsor");
          if (options.to_client_id == client_id) {
            to_client_id = 0;
          }
          console.log("匹配home_id使用options传过来的参数");
          console.log("action", "match_friends_succ");
          console.log("client_uid", client_id);
          console.log("to_client_id", to_client_id);
          console.log("is_sponsor", is_sponsor);
          console.log("is_auto_answer", is_auto_answer);
          console.log("home_id", options.home_id);
          console.log("member_id", wx.getStorageSync('member_id'));
          socket.sendMessage({
            action: "match_friends_succ",
            client_uid: client_id,
            to_client_id: to_client_id,
            is_sponsor: is_sponsor,
            is_auto_answer: is_auto_answer,
            home_id: options.home_id,
            member_id: wx.getStorageSync('member_id')
          }); //发送匹配玩家指令

          console.log('消息发送完毕');

        }

        if (data.action == "match_friends_succ" && data.match_status == 1) {

          //等待双方匹配成功，同时进入pk页面 && data.client_uid!=client_id
          that.getSubjectInfo(data); //
          that.friendsPk({
            type: 1
          },
            data
          );
          that.data.flagIng = true;
        } else if (data.action == "match_fpk_succ") {
          //发起方确认答题开始
          //that.getSubjectInfo(data);//
          that.friendsPk({
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
          this.stopAnwser(2, data);
          return;
        }
      }

    });


    //表情包
    let emotions = [];
    for (let i = 1; i < 18; i++) {
      let j = i;
      if (j < 10) {
        j = "00" + i;
      } else {
        j = "0" + i;
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
      console.log(this);
      this.friendsPk();
    }

    clearTimeout(rtime);
    if (that.data.flagIng == false && is_fpk == 0) {
      rtime = setTimeout(function () {
        if (that.data.flagIng == false) {

          console.log("2s没有匹配用户，发送机器人指令" + client_id);
          console.log(options.pw_type);
          socket.sendMessage({
            action: "match_succ",
            client_uid: client_id,
            is_auto_answer: 1,
            is_robot: 1,
            member_id: wx.getStorageSync("member_id"),
            qualifying_id: options.id,
            pw_type: options.pw_type
          }); //发送匹配玩家指令

        }
      }, 2000);
    }
    console.log('user_info');
    console.log(app.getUserInfo1());

    //
    this.setData({
      //subject: this.data.subjects[this.data.curr_subject_index],//默认显示第一题
      emotions: emotions,
      total_seconds: this.data.total_seconds,
      step: show_step,
      user_info: app.getUserInfo1(),
      consume_point: that.data.consume_point
    });

  },
  friendsPk(params = {}, data = {}) {
    //好友pk

    let that = this;
    console.log(params);
    wx.setStorageSync("grad_id", 0); //好友pk清空段位id

    console.log(data.is_entry);
    let is_sponsor = wx.getStorageSync("is_sponsor");

    if (params.type == 1) {
      console.log(2222222222222);
      console.log(is_sponsor);

      this.setGzFlag(data); //
      this.setData({
        fpk_status: 1,
        is_sponsor: is_sponsor,
        entry_id: data.is_entry,
        pkBtn: data.is_entry == client_id ? 2 : 3 //判断对战操作是否参赛或者围观按钮
      });
    } else if (params.type == 2) {
      //
      setTimeout(function () {
        that.readyAnswer(); //准备开始答题
      }, 2000);
    }
    ////////
    if (params.type != 2) {

      console.log(wx.getStorageSync("from_client_info"));
      this.setData({
        is_sponsor: is_sponsor,
        from_client_info: wx.getStorageSync("from_client_info"),
        to_client_info: wx.getStorageSync("to_client_info")
      });

    }
    //
  },
  setGzFlag(data) {
    //设置观战者标志
    let is_sponsor = wx.getStorageSync("is_sponsor");
    //data.is_entry.length>10 ........+OK？？
    if (
      typeof data.is_entry != "undefined" &&
      data.is_entry.length > 10 &&
      data.is_entry != client_id &&
      !is_sponsor
    ) {
      //设置观战用户标志,不是房主
      wx.setStorageSync("is_gz_flag", 1);
    } else {
      wx.setStorageSync("is_gz_flag", 0);
    }
  },
  bindFriendsPk(e) {
    //开始比赛
    let that = this;
    if (is_fpk == 1) {
      common.post('/pk/updatehome', {
        home_id: this.options.home_id,
        type: 2 // 开始/正在答题
      }).then(res => {
        console.log('修改房间状态为22222222的时候成功');
        console.log(res)
      }).catch(e => {
        console.log('修改修改房间状态为2222222的时候失败');
      });
    }


    let fpk_status = e.currentTarget.dataset.fpk_status;
    let is_sponsor = e.currentTarget.dataset.is_sponsor;
    let is_entry = e.currentTarget.dataset.is_entry; //对战用户
    if (fpk_status == 1 && is_sponsor == 1 && is_entry) {

      wx.showToast({
        title: '题目加载中...',
        icon: 'loading'
      })

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
  bindFriendsWg(e) {
    //
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
  bindFriendsCs(e) {
    //参赛
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
  bindLeaveGroup(e) {
    //放弃比赛
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
  showPk() {
    //显示用户pk信息
    let that = this;
    this.setData({
      step: 2,
      from_client_info: wx.getStorageSync("from_client_info"),
      to_client_info: wx.getStorageSync("to_client_info")
    });
    that.animationMatch() //匹配成功动画
    setTimeout(function () {
      that.readyAnswer(); //准备开始答题
    }, 3000);
  },
  animationMatch() { //匹配成功动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation

    animation.translateX(170).step()

    this.setData({
      animationpka: animation.export()
    })
    animation.translateX(-190).step()

    this.setData({
      animationpkb: animation.export()
    })
  },
  resetInfo() {
    //wx.setStorageSync('to_client_id',''); //***重置对战用户to_client_id,暂时注释
    wx.setStorageSync("from_client_info", "");
    wx.setStorageSync("to_client_info", "");
    wx.setStorageSync("is_auto_answer", 0); //清除自动标志2018-03-26 17:16:51
    wx.setStorageSync("is_gz_flag"); //观战者
    this.data.user_answer_info = {};
  },
  readyAnswer(options) {
    let that = this;
    this.setData({
      step: 3
    });//显示题目界面

    //console.log(this.data.subjects[0])

    //this.countdown(this.data.total_seconds);//倒计时
    this.startAnswer(this.data.total_seconds); //开始答题
    // 页面初始化 options为页面跳转所带来的参数
    socket.onMessage(data => {
      this.data.message = data; //

      //
      if (data.action == "leave_group") {
        //对战用户中途退出
        that.stopAnwser(2, data);
      }

      //console.log(this.data.user_answer_info[data.client_uid])
      if (
        typeof this.data.user_answer_info[data.client_uid] != "undefined" &&
        this.data.user_answer_info[data.client_uid]
      ) {
        //累计用户数据
        this.data.score = this.data.user_answer_info[data.client_uid]["score"];
        this.data.th_score = this.data.user_answer_info[data.client_uid][
          "th_score"
        ];
        this.data.continu_right_num = this.data.user_answer_info[
          data.client_uid
        ]["continu_right_num"];
      } else {
        //用户首次初始数据
        this.data.score = 0;
        this.data.th_score = 0;
        this.data.continu_right_num = 0;
        this.data.temp_continu_right_num = 0;
      }
      let curr_subject_index = this.data.curr_subject_index + 1; //当前题
      let last_subject_index = 0; //是否最后一题
      if (curr_subject_index == this.data.subjects.length) {
        last_subject_index = 1;
      }
      if (data.msg_type == 1) {
        //答题中

        this.data.user_curr_answer = data.content; //每次作答答案记录
        if (data.client_uid == client_id) {
          this.data.user_all_answer.push(this.data.user_curr_answer); //当前用户全部答案
        }

        //
        this.data.is_all_answer.push(data.content.answer_id); //
        let curr_all_answer = [];
        curr_all_answer[data.content.question_id] = this.data.is_all_answer;

        console.log(curr_all_answer);
        //console.log(this.data.user_all_answer);

        //计算得分
        let answer_is_right = this.checkAnswer(this.data.subjects, data);
        // let th_time_arr = this.score_scale; //{1:100,2:90,3:80,4:70,5:60,6:50,7:40,8:30,9:20,10:10}//得分比例
        if (answer_is_right) {
          let openid = wx.getStorageSync('userInfo')
          //答对
          if (data.client_uid == openid.openid) {
            this.setData({
              is_right_num1: true
            });
          } else {
            this.setData({
              is_right_num2: true
            });
          }

          let th_time = data.content.answer_seconds; //答对时间

          this.data.th_score = (this.data.max_seconds + 1 - th_time) * 20; //本题得分
          //最后一题 分数翻倍
          if (last_subject_index) {
            console.log("最后一题分数翻倍"); //X2
            this.data.th_score = this.data.th_score * 2;
          }
          //是否使用道具？？ todo...
          //
          this.data.score += this.data.th_score;
          this.data.continu_right_num += 1; //连续答对
        } else {
          //答错处理
          //上一次对的记录
          if (this.data.continu_right_num > this.data.temp_continu_right_num) {
            this.data.temp_continu_right_num = this.data.continu_right_num;
          }
          this.data.continu_right_num = 0; //清0
          //
        }

        //最后答对最多数
        // if (
        //   curr_subject_index == this.data.subjects.length &&
        //   this.data.continu_right_num < this.data.temp_continu_right_num
        // ) {
        //   if (this.data.score == 0) {
        //     this.data.continu_right_num = 0;
        //   } else {
        //     this.data.continu_right_num = this.data.temp_continu_right_num;
        //   }
        //   console.log("-----" + this.data.continu_right_num);
        // }
        let th_time = data.content.answer_seconds;
        console.log('分数比例', this.data.score, 6 * this.data.max_seconds * 20);
        let s_height = parseInt(this.data.score / (6 * this.data.max_seconds * 20) * 100) + "%"; //显示分数比例 1200总分
        let user_answer_item = {
          messages: data,
          s_height: s_height,
          score: this.data.score,
          th_score: this.data.th_score,
          continu_right_num: this.data.continu_right_num,
          client_uid: data.client_uid,
          showAnswer: false
        };
        this.data.user_answer_info[data.client_uid] = user_answer_item;

        console.log(this.data.user_answer_info);

        to_client_id = wx.getStorageSync("to_client_id"); //对战用户
        //双方本题作答完毕,才显示对方答案
        if (this.data.is_all_answer.length == 2) {
          console.log("双方作答完成" + curr_subject_index);
          console.log(wx.getStorageSync("to_client_info"));
          this.data.is_all_answer = [];
          this.targetAnwser(); //对方回答完成
          that.countdown(0); //结束当前题目
          that.countInterval(true);
        } else if (is_auto_answer == 1) {
          //自动答题
          if (
            data.client_uid == client_id &&
            typeof this.data.user_answer_info[to_client_id] != "undefined"
          ) {
            this.targetAnwser(); //对方回答完成
          }
        }
        //此判断是解决多人观战显示数据
        let from_client_info = wx.getStorageSync("from_client_info");
        from_client_id = from_client_info.openid ?
          from_client_info.openid :
          client_id;
        this.setData({
          data: user_answer_item,
          user_info1: this.data.user_answer_info[from_client_id], //挑战用户
          user_info2: this.data.user_answer_info[to_client_id], //被挑战用户
          last_subject_index: last_subject_index,
          isShow: this.data.isShow
        });
        // console.log("==被挑战用户数据==")
        // console.log(this.data.user_info2)
      } else if (data.msg_type == 2) {
        //表情
        this.setData({
          data2: data,
          //emoFlag: true,
          showEmo: true
        });
        setTimeout(function () {
          that.setData({
            //emoFlag: false,
            showEmo: false
          });
        }, 2000);
        //this.emotioning();//动画
      } else if (data.msg_type == 3) {
        //
        this.setData({
          data: data
        });
      }
    });
    //end
  },
  startAnswer(data) {
    //开始答题
    let that = this;
    time_3 = setTimeout(function () {
      //显示题目
      that.setData({
        subject: that.data.subjects[that.data.curr_subject_index] //默认显示第一题
      });
      //
      if (is_auto_answer == 1) that.autoAnswer();
      that.countdown(data); //倒计时
      that.countInterval();
    }, 2000);
  },
  autoAnswer(data = {}) {
    //自动答题
    let that = this;
    let curr_subject_index = this.data.curr_subject_index;
    let answer = {};
    let answer_item = {};
    if (curr_subject_index == 9999) return;
    //用户答题记录
    answer = that.user_answer;
    console.log(1111111111);
    console.log(answer);
    //answer = [{"question_id":10,"answer_id":1,"answer_val":1,"answer_seconds":2},{"question_id":11,"answer_id":2,"answer_val":0,"answer_seconds":3},{"question_id":12,"answer_id":2,"answer_val":0,"answer_seconds":4},{"question_id":13,"answer_id":4,"answer_val":1,"answer_seconds":4},{"question_id":14,"answer_id":1,"answer_val":0,"answer_seconds":7}]
    answer_item = answer[curr_subject_index]; //当前题目
    let time = answer_item.answer_seconds * 1000; //答题时间

    console.log(answer[curr_subject_index]);
    time_2 = setTimeout(function () {
      console.log(9999999999);
      that.selAnswer({}, answer_item);
    }, time);
  },
  nextQuestion() {
    //下一题
    let that = this;
    clearTimeout(time);
    clearTimeout(time_1); //中止下一题倒计时 2018-03-27 11:57:48
    this.clearAnswer(); //
    this.data.curr_subject_index = this.data.curr_subject_index + 1;
    that.setData({
      seconds: this.data.total_seconds,
      subject: this.data.subjects[this.data.curr_subject_index],
      curr_subject_index: that.data.curr_subject_index,
      is_lock:true
    });
    let curr_subject_index = this.data.curr_subject_index + 1;
    console.log("题目" + curr_subject_index);
    if (curr_subject_index == this.data.subjects.length) {
      that.setData({
        is_last_subject: true
      });
      setTimeout(function () {
        that.setData({
          is_last_subject: false
        });
      }, 1000);

      console.log("最后一题分数翻倍"); //X2
    }
    //下一题
    if (this.data.curr_subject_index < this.data.subjects.length) {
      that.setData({
        is_lock:true
      })
      if (is_auto_answer == 1) this.autoAnswer();

      that.countdown(this.data.total_seconds);
      that.countInterval();
    } else {
      that.data.flagIng = false;
      that.setData({
        isShow: false,
        curr_subject_index: this.data.curr_subject_index >= 4 ? 4 : this.data.curr_subject_index //最多显示为5题，超过第5题显示为5
      });


      //****
      from_client_id = from_client_id ? from_client_id : client_id;
      let score_total =
        typeof this.data.user_answer_info[from_client_id] != "undefined" ?
          this.data.user_answer_info[from_client_id].score :
          0;
      let to_user_score_total =
        typeof this.data.user_answer_info[to_client_id] != "undefined" ?
          this.data.user_answer_info[to_client_id].score :
          0;
      let grad_id = wx.getStorageSync("grad_id") ?
        wx.getStorageSync("grad_id") :
        0;
      let special_id = wx.getStorageSync("special_id") ?
        wx.getStorageSync("special_id") :
        0;
      let is_gz_flag = wx.getStorageSync("is_gz_flag"); //是否观战者
      let user_all_answer = this.data.user_all_answer.slice(0, 5) //截取前五个答案

      let is_fpk = that.options.is_fpk;
      console.log('is_fpk的只值');
      console.log(this);
      console.log(that.options.is_fpk);
      console.log(this.data.flag_type);
      console.log(grad_id);
      console.log(special_id);
      console.log(this.data.subject_info.pk_id);
      console.log(score_total);
      console.log(to_user_score_total);
      console.log(this.data.user_all_answer);
      console.log(user_all_answer);
      console.log(this.user_answer);
      console.log(wx.getStorageSync('member_id'));

      let data = {
        is_gz_flag: is_gz_flag,
        flag_type: this.data.flag_type,
        qualifying_id: grad_id,
        pk_id: this.data.subject_info.pk_id,
        score_total: score_total,
        to_user_score_total: to_user_score_total,
        answer: JSON.stringify(user_all_answer),
        // answer_data: JSON.stringify(this.user_answer),
        member_id: wx.getStorageSync('member_id')
      };
      console.log("综合赛up data")
      console.log(data)

      //2018-02-11 18:00:25
      //let send_data = {"action":"send_msg","msg_type":"3","client_uid":wx.getStorageSync('client_id'),"content":""+JSON.stringify(data)+""};
      //socket.sendMessage(send_data);//游戏结束发送结果

      //将数据上传服务器
      //
      //
      //success回调this作用域更新不了外面的数据,所以保存当前this

      let apiurl = "/paiweisai/uploadMyData"; //综合
      console.log(this);
      if (this.options.pw_type == 2) { //技能专场
        console.log('这里是现金赛上传数据');
        apiurl = "/sports/uploadMyData"
        data = {
          is_gz_flag: is_gz_flag,
          flag_type: this.data.flag_type,
          sports_id: special_id,
          pk_id: this.data.subject_info.pk_id,
          score_total: score_total,
          to_user_score_total: to_user_score_total,
          answer: JSON.stringify(user_all_answer),
          // user_answer: JSON.stringify(this.user_answer),
          member_id: wx.getStorageSync('member_id')
        };
        console.log("传到后台的数据")
        console.log(data)
      }
      if (is_fpk) { //好友PK
        console.log('好友对战结果')
        apiurl = '/pk/uploadAnswer';

        data = {
          is_fpk: is_fpk,
          is_gz_flag: is_gz_flag,
          flag_type: this.data.flag_type,
          grad_id: grad_id,
          pk_id: this.data.subject_info.pk_id,
          score_total: score_total,
          to_user_score_total: to_user_score_total,
          answer: JSON.stringify(user_all_answer),
          member_id: wx.getStorageSync('member_id')
        }
        console.log(data)

      }
      if (is_gz_flag) apiurl = "Questions/gzUserAnswer"; //观战结果

      common.post(apiurl, data).then(data => {
        console.log('这里是接口获取到的数据');
        console.log(data);
        let showpage = data.data.is_win == 1 ? 4 : data.data.is_win == 2 ? 5 : 5;
        wx.setStorageSync("is_auto_answer");
        wx.setStorageSync('gold', wx.getStorageSync('gold') + data.data.addGold - this.options.gold);

        that.setData({
          step: showpage,
          result: data.data
        });

      }).catch(e => {
        console.log('数据异常');
        that.setData({
          step: showpage,
          result: data.data
        });
      })

      // app.getdata
      //   .fetchApi(apiurl, data)
      //   .then(d => {


      //     console.log('上传返回的经验金币等');
      //     console.log(d);
      //     if (d.status == 200) {
      //       let data = d.data;
      //       console.log(data);
      //       let showpage = data.is_win == 1 ? 4 : data.is_win == 2 ? 5 : 5;
      //       wx.setStorageSync("is_auto_answer");
      //       that.setData({
      //         step: showpage,
      //         result: data
      //       });
      //       //socket.sendMessage({"action":"leave_group","client_uid":client_id});//离开当前房间
      //     } else {
      //       // this.setData({
      //       //   hasMore: false,
      //       //   loading: false
      //       // });
      //       data = {
      //         is_win: 1,
      //         add_exp: 90,
      //         add_point: 90,
      //         share_points: 30
      //       }

      //       let showpage = data.is_win == 1 ? 4 : data.is_win == 2 ? 5 : 5;
      //       wx.setStorageSync("is_auto_answer");
      //       that.setData({
      //         step: showpage,
      //         result: data
      //       });

      //     }
      //   })
      //   .catch(e => {
      //     this.setData({
      //       subtitle: "获取数据异常",
      //       loading: false
      //     });
      //     console.error(e);
      //   });
      //
    }
  },
  checkAnswer(subjects, data) {
    //检查答案是否正确
    let is_right = 0;
    if (!subjects || !data) return;
    for (let i = 0; i < subjects.length; i++) {
      let item = subjects[i];
      if (item.id == data.content.question_id) {
        //
        for (let j = 0; j < item["answer"].length; j++) {
          let item_answer = item["answer"][j];
          if (
            item_answer.is_right &&
            item_answer.is_right == data.content.answer_val
          ) {
            //console.log(item_answer.is_right)
            is_right = 1;
          }
        }
      }
    }
    return is_right;
  },
  selAnswer(e, answer_data = "") {
    //选择答案
    //console.log(this.data.user_answer_info)
    //if(typeof e.currentTarget!='undefined' && is_auto_answer)return;//如果是自动答题就不能选择
    let is_gz_flag = wx.getStorageSync("is_gz_flag");
    let is_sponsor = wx.getStorageSync("is_sponsor");
    let user_curr_answer = {};
    if (is_gz_flag && !is_sponsor && !is_auto_answer) {
      console.log("观战者不能参与答题");
      return;
    }
    if (this.data.message && this.data.user_answer_info[client_id]) {
      //判断双方是否已经选择了该题答案
      user_curr_answer =
        this.data.message &&
        this.data.user_answer_info[client_id].messages.content; //this.data.user_curr_answer;
    }
    console.log(this.data.user_answer_info);

    let answer = {};
    let question_id = 0;
    let answer_id = 0;
    let answer_val = 0;
    let answer_seconds = 0;
    let client_uid = "";
    let item_data = this.data.subjects[this.data.curr_subject_index]; //
    if (is_auto_answer && answer_data) {
      //系统自动
      question_id = answer_data.question_id;
      answer_id = answer_data.answer_id;
      answer_val = answer_data.answer_val;
      answer_seconds = answer_data.answer_seconds;
      client_uid = wx.getStorageSync("to_client_id"); //to_client_id;
    } else {
      //用户手动
      question_id = e.currentTarget.dataset.question_id;
      answer_id = e.currentTarget.dataset.answer_id;
      answer_val = e.currentTarget.dataset.right;
      answer_seconds = this.data.total_seconds - parseInt(this.data.seconds);
      client_uid = client_id;

      //防止用户重复答题
      // if (
      //   (user_curr_answer && user_curr_answer.question_id == question_id) ||
      //   this.data.seconds <= 0
      // ) {
      //   console.log(question_id);
      //   console.log("用户重复答题或者答题时间到");
      //   return false;
      // }

      //防止用户重复答题
      if ((user_curr_answer && user_curr_answer.question_id == question_id) || this.data.seconds <= 0 || this.data.is_lock == false) {
        return false;
      }
    }

    console.log(answer_data);
    console.log('获取用户作答参数');
    console.log(item_data);
    //获取用户作答参数
    answer.subject_cate_id = item_data.subject_cate_id; //科目大类
    answer.subject_id = item_data.subject_id; //科目子类
    answer.question_id = question_id; //题目id
    answer.answer_id = answer_id; //答案id
    answer.answer_val = answer_val; //答案值
    answer.answer_seconds = answer_seconds; //Math.floor(Math.random()*10+1);  //答题秒数
    if (parseInt(this.data.seconds) > 0 && answer.answer_seconds == 0) {
      //作答时间不到一秒处理
      answer.answer_seconds = 1;
    }

    let room_id = wx.getStorageSync("room_id");
    console.log('这里试pk_type的值');
    console.log(is_fpk == 1 ? 2 : 1);
    let data = {
      action: "send_msg",
      msg_type: "1",
      room_id: room_id,
      client_uid: client_uid,
      content: "" + JSON.stringify(answer) + "",
      client_name: wx.getStorageSync("from_client_info").client_name,
      pk_type: is_fpk == 1 ? 2 : 1 //1:排位   2:好友对战
    };

    socket.sendMessage(data);
    if (is_auto_answer && answer_data) {
      return false;
    }
    this.setData({
      is_lock: false
    });
  },
  clearAnswer() {
    //清除上题动作

    this.data.is_all_answer = []; //*

    this.setData({
      messages: {},
      publish_is_right: 0
    });
  },
  //定时器
  countInterval(flag = false) {
    let that = this;
    that.data.count = 0;
    clearInterval(that.countTimer);
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    that.countTimer = setInterval(function () {
      if (flag) that.data.count = (that.data.countDown + 1);
      if (that.data.count <= that.data.countDown) {
        /* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        that.drawCircle(that.data.count / (that.data.countDown / 2));
        that.data.count++;
      } else {
        that.setData({
          progress_txt: ""
        });
        clearInterval(that.countTimer);
      }
    }, 100);
  },
  onUnload() {
    //离开当前页面
    let is_sponsor = wx.getStorageSync("is_sponsor");
    let room_id = wx.getStorageSync("room_id");
    console.log('离开当前页面');
    console.log(room_id);
    this.stopAnwser(1); //
    if (is_sponsor) {
      console.log(this.options.home_id);
      if (is_fpk == 1) {
        common.post('/pk/updatehome', {
          home_id: this.options.home_id,
          type: 3,
        }).then(res => {
          console.log('修改房间状态为3的时候成功');
          console.log(res)
        }).catch(e => {
          console.log('修改房间状态为3的时候失败');
        });
      }


    } else if (!is_sponsor) {
      if (is_fpk == 1) {
        common.post('/pk/updatehome', {
          home_id: this.options.home_id,
          type: 0,
        }).then(res => {
          console.log('修改房间状态为0的时候成功');
          console.log(res)
        }).catch(e => {
          console.log('修改房间状态为0的时候失败');
        });
      }
    }
    wx.setStorageSync("is_auto_answer", 0);
    clearTimeout(rtime);
    socket.sendMessage({
      action: "leave_group",
      client_uid: client_id,
      room_id: room_id,
      is_sponsor: is_sponsor,
      leave_type: is_fpk == 1 ? 2 : 1 //1:排位   2:好友对战
    }); //
    wx.setStorageSync("room_id"); //离开本地房间，服务器房间离开？？todo..
    //wx.closeSocket();//离开关闭socket****** 之前可能产生重复
  },
  stopAnwser(type = 1, data = {}) {
    //中途停止答题
    let is_sponsor = wx.getStorageSync("is_sponsor");
    let room_id = wx.getStorageSync("room_id");
    if (
      this.data.flagIng == true &&
      this.data.curr_subject_index < 5 &&
      !is_fpk
    ) {
      this.data.flagIng = false; //pk结束
      this.data.curr_subject_index = 9999;
      this.countInterval(true);
      this.countdown(0); //中途退出，停止倒计时

      if (type == 2) {
        this.data.flag_type = 2;
        app.showModal({
          title: "对方放弃的战斗",
          content: "你赢得胜利！"
        });
      } else {
        if (is_fpk == 1) {
          common.post('/pk/updatehome', {
            home_id: this.options.home_id,
            type: 3 // 失效/放弃/结束
          }).then(res => {
            console.log('修改房间状态为3的时候成功');
            console.log(res)
          }).catch(e => {
            console.log('修改房间状态为3的时候失败');
          });
        }
        this.data.flag_type = 1;
        app.showModal({
          title: "你放弃的战斗",
          content: "损失了" + this.data.consume_point + "个金币"
        });
        wx.setStorageSync('gold', wx.getStorageSync('gold') - this.data.consume_point);

        /*app.showModal({title:'你放弃的战斗',content:'损失了200金币',confirm:function(){
          console.log(23424234)
        }});
        */
      }
    } else if (type == 2) {
      //is_sponsor = wx.getStorageSync('is_sponsor');
      let to_client_id = wx.getStorageSync("to_client_id");
      client_id = wx.getStorageSync("client_id");

      if (
        this.data.flagIng == true &&
        to_client_id == data.client_uid &&
        !is_sponsor
      ) {
        //好友
        app.showModal({
          content: "房主跑路了～，房间解散！",
          confirm: function () {
            app.turnBack();
          }
        });
      } else if (this.data.flagIng == true && is_sponsor) {
        //房主
        this.setData({
          to_client_info: 0,
          fpk_status: 0
        });
        app.showModal({
          content: 'PK用户跑了',
          confirm: function () {
            app.turnBack();
          }
        });
        return;
        /*
         app.showModal({content:'PK用户跑了',confirm:function(){
          app.turnBack();
        }});
        */
      }
    }

    //clearTimeout(rtime);
    //socket.sendMessage({"action":"leave_group","client_uid":client_id,"room_id":room_id,"is_sponsor":is_sponsor});//
    //wx.setStorageSync('room_id');//离开本地房间，服务器房间离开？？todo..
    //wx.closeSocket();//离开关闭socket****** 之前可能产生重复
  },
  targetAnwser() {
    //对方回答完成
    if (typeof this.data.user_answer_info[to_client_id] != "undefined") {
      this.data.user_answer_info[to_client_id].showAnswer = true;
      this.setData({
        user_info2: this.data.user_answer_info[to_client_id] //被挑战用户
      });
    }
  },
  countdown(seconds) {
    //倒计时
    //console.log(second)
    let that = this;
    this.data.seconds = seconds; //当前秒数
    //let time = '';
    if (seconds == 0) {
      setTimeout(() => {
        that.setData({
          is_right_num1: false,
          is_right_num2: false
        });
      }, 1500);
      if (this.data.curr_subject_index >= this.data.user_all_answer.length) {
        let obj = {}
        if (this.data.subjects[this.data.curr_subject_index].subject_id) {
          obj.subject_id = this.data.subjects[this.data.curr_subject_index].subject_id;
        }
        obj.question_id = this.data.subjects[this.data.curr_subject_index].id;
        obj.answer_id = '';
        obj.answer_val = 0;
        obj.answer_seconds = 10;
        this.data.user_all_answer.push(obj)
      }
      console.log("===user_all_answer===")
      console.log(this.data.user_all_answer)

      clearTimeout(time); //中止当前倒计时
      this.targetAnwser(); //对方回答完成
      this.setData({
        publish_is_right: 1 //公布正确答案
      });
      time_1 = setTimeout(function () {
        that.nextQuestion(); //进入下题
      }, 2000);

      return;
    }
    //倒计时
    time = setTimeout(function () {
      let diff_second = seconds - 1;
      that.setData({
        seconds: diff_second
      });
      that.countdown(diff_second);
    }, 1000);
  },
  //第1个圆
  drawProgressbg() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext("canvasProgressbg");
    ctx.setLineWidth(7); // 设置圆环的宽度
    ctx.setStrokeStyle("#ffffff"); // 设置圆环的颜色
    ctx.setLineCap("round"); // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(30, 30, 25, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle(step) {
    //倒计时圆环
    var context = wx.createCanvasContext("canvasProgress");
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#f55c6f");
    gradient.addColorStop("0.5", "#f55c6f");
    gradient.addColorStop("1.0", "#f55c6f");

    context.setLineWidth(5);
    context.setStrokeStyle(gradient);
    context.setLineCap("round");
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(30, 30, 25, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw();
  },
  emotioning() {
    console.log("动画.....");
    var animation = wx.createAnimation({});
    animation.opacity(0.7).step({
      duration: 1000
    }); //修改透明度,放大
    this.setData({
      emoAnimation: animation.export()
    });
  },
  onReady() {
    // 页面渲染完成
    this.drawProgressbg();
    this.animation = wx.createAnimation();
    this.animation_2 = wx.createAnimation();

    //创建并返回绘图上下文context对象。
    var cxt_arc = wx.createCanvasContext("canvasCircle");
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle("#eaeaea");
    cxt_arc.setLineCap("round");
    cxt_arc.beginPath();
    cxt_arc.arc(x, y, radius, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
  },
  paiwei() {
    app.turnBack();
  },
  emotionBtn() {
    this.setData({
      emoFlag: true,
      data2: {},
      emotionBox: this.data.tap == "tapOff" ? true : false
    });

    if (this.data.tap == "tapOff") {
      this.animation_2.height(this.data.height - 200).step();
      this.setData({
        animation_2: this.animation_2.export()
      });
      this.setData({
        tap: "tapOn"
      });
    } else {
      this.animation_2.height(this.data.height - 50).step();
      this.setData({
        animation_2: this.animation_2.export()
      });
      this.setData({
        tap: "tapOff"
      });
    }
  },
  report() {
    wx.navigateTo({
      url: '../../pages/leavemsg/leavemsg'
    })
  },
  modelClose() {
    this.setData({
      smallmodel: true
    });
  },
  reportSubmit(e) {
    let pk_id = this.data.subject_info.pk_id;
    let to_client_info = wx.getStorageSync("to_client_info"); //
    let apiurl = "UserReport/add_report";
    let arr = e.detail.value.checkbox;
    let params = {
      report_user_id: to_client_info.id,
      report_text: arr.toString(),
      pk_id: pk_id
    };
    app.getdata
      .fetchApi(apiurl, params)
      .then(d => {
        if (d.status == 1) {
          app.showToast({
            title: "举报成功"
          });
          this.modelClose();
        } else {
          app.showModal({
            content: d.message
          });
          return;
        }
      })
      .catch(e => {
        this.setData({
          subtitle: "获取数据异常",
          loading: false
        });
      });

    console.log(e);
  },

  onShareAppMessage: function (res) {
    //分享
    let that = this;
    let user_info = that.data.user_info;
    console.log(that);
    let home_id = that.options.home_id;

    let _path = "/pages/index/index?room_id=" + user_info.openid + "&to_client_id=" + user_info.openid + "&uid=" + user_info.member_id + "&is_fpk=1";
    let title = '';
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log('分享的res');
      console.log(res);
      let stype = res.target.dataset.type; //分享类型

      wx.showShareMenu({
        withShareTicket: true
      }); //分享前置code

      if (res.target.id == 'yaoqing') {
        _path = _path + "&home_id=" + home_id;
        title = "一起来玩!";
      } else {
        _path = "/pages/index/index";
        title = "我的记录在此，谁敢来比，快来挑战吧！";
      }
      let shareImg = wx.getStorageSync('img_pk')
      if (res.target.id == 'success') {
        shareImg = wx.getStorageSync('img_win')
      } else if (res.target.id == 'fail') {
        shareImg = wx.getStorageSync('img_fail')
      }

      console.log(_path);
      return {
        path: _path,
        title: title,
        imageUrl: shareImg,
        success: function (res) {
          // 转发成功
          common.post('/member/shareAddGold', {
            member_id: wx.getStorageSync('member_id')
          }).then(result => {
            let gold = wx.getStorageSync('shareGold');
            if (result.data.status == 200) {
              wx.showToast({
                title: '获得金币' + gold,
                icon: 'success'
              })
              wx.setStorageSync('gold', wx.getStorageSync('gold') + wx.getStorageSync('shareGold'));
            }
          })
        },
        fail: function (res) {
          // 转发失败
        }
      };

    }

    return {

      title: "我的记录在此，谁敢来比，快来挑战吧！",
      path: "/pages/index/index",
      imageUrl: wx.getStorageSync('img_center'),
      success: function (res) {
        // 转发成功
        common.post('/member/shareAddGold', {
          member_id: wx.getStorageSync('member_id')
        }).then(result => {
          let gold = wx.getStorageSync('shareGold');
          if (result.data.status == 200) {
            wx.showToast({
              title: '获得金币' + gold,
              icon: 'success'
            })
            wx.setStorageSync('gold', wx.getStorageSync('gold') + wx.getStorageSync('shareGold'));
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }

    };
  }
});
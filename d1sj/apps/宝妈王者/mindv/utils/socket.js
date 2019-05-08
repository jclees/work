//Socket 服务
const app = getApp();

class Socket {

  constructor(host) {
    this.host = host;
    this.connected = false;
    this.client_list = {};
    this.socketSeconds = 5000; //socket断开,5秒重连
    this.client_id = wx.getStorageSync('client_id');

    //socket初始连接
    wx.connectSocket({
      url: this.host
    })

    // 监听连接成功
    wx.onSocketOpen((res) => {
      console.log('WebSocket连接已打开！')
      this.connected = true
      var name = 'haaha'
      var login_data = '{"action":"login","client_name":"' + name.replace(/"/g, '\\"') + '","room_id":"1"}';
      console.log("websocket握手成功，发送登录数据:" + login_data);
      let room_id = wx.getStorageSync('room_id');
      if (this.client_id && room_id) { //重新登陆2018-03-13 12:35:14
        this.onLogin({
          room_id: room_id
        });
      }
    })

    // 监听连接断开
    wx.onSocketError((res) => {
      console.log('WebSocket连接打开失败，请检查！')
      let that = this;
      that.connected = false;
      /* setTimeout(function(){
      wx.connectSocket({
      	url: that.host
        })
      }
      ,5000)*/
    })

    // 监听连接关闭
    wx.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      let that = this;
      that.connected = false;
      setTimeout(function() {
        wx.connectSocket({
          url: that.host
        })
      }, this.socketSeconds)
    })

  }

  //发送消息到微信
  sendMessage(data) {
    console.log('发送消息到微信', data);
    if (!this.connected) {
      console.log('not connected')
      let room_id = wx.getStorageSync('room_id');
      if (this.client_id && room_id) { //重新登陆2018-03-13 12:35:14
        // 影响打开邀请链接，白屏问题
        wx.showModal({
          title: '数据加载错误',
          content: '数据加载错误，请重新加载',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              this.onLogin({
                room_id: room_id
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      return
    }
    wx.sendSocketMessage({
      data: JSON.stringify(data)
    })
    console.log('发送完毕消息');
  }

  //接收消息
  onMessage(callback) {
    //console.log(callback)
    // 监听服务器消息
    wx.onSocketMessage((res) => {
      console.log(res);
      console.log('服务器返回数据')
      const data = JSON.parse(res.data)
      console.log(data);
      switch (data.action) {
        // 服务端ping客户端
        case 'ping':
          socket.sendMessage({
            "action": "pong"
          });
          break;
        case 'match_succ':
        case 'match_friends_succ':
        case 'fpk_wg_succ': //重置切换好友对战用户

          if (data.action == 'match_succ' && data.res_code == 403) {
            app.showModal({
              content: data.res_msg,
              confirm: function() {
                app.turnBack();
              }
            });
            return false;
          }
          //对战用户信息
          let is_sponsor = wx.getStorageSync('is_sponsor');

          if (data.client_uid == this.client_id && data.action != 'fpk_wg_succ' || (!data.is_sponsor && data.is_entry == this.client_id && !data.type) || (!data.is_sponsor && data.action == 'fpk_wg_succ' && data.type == 1 && data.is_entry != this.client_id)) { // || data.is_entry==this.client_id 2018-03-21 16:41:50

            wx.setStorageSync('from_client_info', data.from_client_info);

            if (data.to_client_info.openid) {
              wx.setStorageSync('to_client_id', data.to_client_info.openid);
              wx.setStorageSync('to_client_info', data.to_client_info);
            }
          } else if (data.from_client_info.openid && data.to_client_info.openid) {
            //if(this.client_id != data.from_client_info.openid || this.client_id != data.to_client_info.openid){}
            wx.setStorageSync('to_client_id', data.from_client_info.openid);
            wx.setStorageSync('from_client_info', data.to_client_info);
            wx.setStorageSync('to_client_info', data.from_client_info);
            //data.from_client_info = data.to_client_info
            //data.to_client_info = data.from_client_info
          }

          //wx.setStorageSync('is_fpk',data.to_client_info.is_fpk==1 ? 1:0);
          wx.setStorageSync('is_auto_answer', data.to_client_info.is_robot == 1 ? 1 : 0);

          wx.setStorageSync('room_id', data.room_id);

          break;
        case 'fpk_wg_succ':

          break;
          // 登录 更新用户列表
        case 'login':
          //{"action":"login","client_id":xxx,"client_name":"xxx","client_list":"[...]","time":"xxx"}
          this.say(data.client_id, data.client_name, data.client_name + ' 加入了聊天室', data.time);
          //wx.setStorageSync('client_id', data.client_id);
          //
          if (data.client_list) {
            this.client_list = data.client_list;
          } else {
            this.client_list[data.client_id] = data.client_name;
          }
          this.flush_client_list();
          console.log(data.client_name + "登录成功");
          // console.log(callback);
          break;
          // 发言
        case 'send_msg':

          //{"action":"say","from_client_id":xxx,"to_client_id":"all/client_id","content":"xxx","time":"xxx"}
          // console.log(data.content);
          if (!data.content.indexOf('{')) { //json字符串
            data.content = JSON.parse(data.content);
          } else {
            data.content = data.content.replace(/(^\[*)|(\]*$)/g, "")
            data.content = '../../static/images/face-icons-flat/' + data.content + '.png';
          }

          // console.log(data.content);
          // console.log(callback)

          this.say(data.from_client_id, data.from_client_name, data.content, data.time);
          break;
          // 用户退出 更新用户列表
        case 'logout':
          //{"action":"logout","client_id":xxx,"time":"xxx"}
          this.say(data.from_client_id, data.from_client_name, data.from_client_name + ' 退出了', data.time);
          //2018-02-27 18:15:14
          //app.showModal({content:'玩家退出了'});

          delete this.client_list[data.from_client_id]; //删除退出用户
          this.flush_client_list(); //刷新在线人数

      }
      //回调方法
      /*if((data.action =='send_msg' || data.action =='login' || data.action =='match_succ' ||  data.action =='match_friends_succ') && typeof(callback) == 'function' && callback!='undefined'){

				return callback(data);
			}
*/
      if ((data.action != 'ping') && typeof(callback) == 'function' && callback != 'undefined') {

        return callback(data);
      }
    })
  }
  //登录
  onLogin(data = {}) {
    var user_info = app.getUserInfo1();
    console.log('登录用户数据')
    console.log(user_info)

    if (typeof user_info.openid != 'undefined' && user_info.openid) {
      this.client_id = user_info.openid;
      wx.setStorageSync('client_id', user_info.openid);
    }
    if (1 || !this.client_id) {
      let room_id = data.room_id ? data.room_id : 666;
      this.sendMessage({
        "action": "login",
        "room_id": room_id,
        "client_uid": this.client_id
      });
    }
  }

  //用户发消息
  say(from_client_id, from_client_name, content, time) {
    wx.setStorageSync('test', 12344567888);
    // console.log(wx.getStorageSync('test'))
    // console.log(from_client_id + '-' + from_client_name + '-' + content + '-' + time);
  }

  //刷新在线人数
  flush_client_list() {
    // console.log(this.client_list)
    var user = '';
    for (var p in this.client_list) {

      user += '-' + this.client_list[p];
    }
    // console.log('在线用户：' + user)
  }

}

//const socket = new Socket('ws://caibei.weixingzpt.com:1992');//socket连接 http:ws|https:wss
const socket = new Socket('wss://motherking.weixingzpt.com/wm'); //socket连接 http:ws|https:wss

export default socket
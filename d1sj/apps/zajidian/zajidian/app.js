'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _wxValidate = require('utils/wxValidate');

var _wxValidate2 = _interopRequireDefault(_wxValidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
var wechat = require('./utils/wechat.js');

/**
 * 获取数据 API 模块
 * @type {Object}
 */
var getdata = require('./utils/getdata.js');

//工具类方法
var util = require('./utils/util.js');

//html解析方法
var wxParse = require('./wxParse/wxParse.js');

//js验证
//const wxValidate = require('./utils/wxValidate.js')

App({

  /**
   * WeChat API
   */
  wechat: wechat,

  /**
   * getdata API
   */
  getdata: getdata,

  /**
   * util API
   */
  util: util,

  /**
   * util API
   */
  wxParse: wxParse,

  wxValidateForm: function wxValidateForm(rules, messages) {
    return new _wxValidate2.default(rules, messages);
  },

  onLaunch: function onLaunch() {
    var userInfo;
    if (userInfo = wx.getStorageSync('userInfo')) {
      //用户信息初始
      this.globalData.userInfo = userInfo;
    }
    this.getSystemInfo(); //获取系统信息
  },
  getSystemInfo: function getSystemInfo() {
    var that = this;
    wx.getSystemInfo({
      success: function success(res) {
        that.systemInfo = res;
      }
    });
  },
  sendRequest: function sendRequest(param, customSiteUrl) {
    var that = this,
        data = param.data || {},
        header = param.header,
        requestUrl;

    /*if(data.app_id){
      data._app_id = data.app_id;
    } else {
      data._app_id = data.app_id = this.getAppId();
    }*/
    // data._app_id = this.getAppId();
    data.app_id = this.getAppId();
   // console.log('111' + this.getSessionKey());
    if (!this.globalData.notBindXcxAppId) {}
      data.session_key = this.getSessionKey();


    if (customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = this.globalData.siteBaseUrl +'/'+ param.url;
      // requestUrl = param.url;
    }

    if (param.method) {
      if (param.method.toLowerCase() == 'post') {
        data = this.modifyPostParam(data);
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        };
      }
      param.method = param.method.toUpperCase();
    }

    if (!param.hideLoading) {
      this.showToast({
        title: '请求中...',
        icon: 'loading'
      });
    }

    //发送请求接口数据
    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'POST',
      header: header || {
        'content-type': 'application/json'
      },
      success: function success(res) {
        if (res.data.status == 1) {//错误提示

        } else if (res.data.status >= 0) {
          //请求成功
          that.hideToast();
          that.showModal({
            content: '' + res.message
          });
          typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal();
          return;
        }else if(res.data.status == '-90001'){//token 失效
          that.setSessionKey('');
          that.login()
        } else {
          that.showToast({ title: '请求错误' });
        }
        typeof param.success == 'function' && param.success(res.data);
      },
      fail: function fail(res) {
        that.showModal({
          content: '请求失败 ' + res.message
        });
        typeof param.fail == 'function' && param.fail(res.data);
      },
      complete: function complete(res) {
        // wx.hideLoading();
        that.hideToast();
        typeof param.complete == 'function' && param.complete(res.data);
      }
    });
  },
  turnToPage: function turnToPage(url, isRedirect) {
    var tabBarPagePathArr = this.getTabPagePathArr();
    // tabBar中的页面改用switchTab跳转
    if (tabBarPagePathArr.indexOf(url) != -1) {
      this.switchToTab(url);
      return;
    }
    if (!isRedirect) {
      wx.navigateTo({
        url: url
      });
    } else {
      wx.redirectTo({
        url: url
      });
    }
  },
  tapPrevewPictureHandler: function tapPrevewPictureHandler(e) {
    this.previewImage({
      urls: e.currentTarget.dataset.imgarr instanceof Array ? e.currentTarget.dataset.imgarr : [e.currentTarget.dataset.imgarr]
    });
  },
  switchToTab: function switchToTab(url) {
    wx.switchTab({
      url: url
    });
  },
  turnBack: function turnBack(options) {
    //options.delta 返回页面数
    wx.navigateBack({
      delta: options ? options.delta || 1 : 1
    });
  },
  setPageTitle: function setPageTitle(title) {
    wx.setNavigationBarTitle({
      title: title
    });
  },
  showToast: function showToast(param={}) {
    wx.showToast({
      title: param.title||'操作成功',
      icon: param.icon,
      duration: param.duration || 1500,
      success: function success(res) {
        //成功是否回调app.showToast({title:'1213',success:app.util.test_callback});
        typeof param.success == 'function' && param.success(res);
      },
      fail: function fail(res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function complete(res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    });
  },
  hideToast: function hideToast() {
    wx.hideToast();
  },
  showModal: function showModal(param) {
    //wx弹窗提示
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function success(res) {
        if (res.confirm) {
          //确定
          //res.stype = param.stype||0;//2017-12-08 14:43:45
          typeof param.confirm == 'function' && param.confirm(param);
        } else {
          //取消
          typeof param.cancel == 'function' && param.cancel(param);
        }
      },
      fail: function fail(res) {
        typeof param.fail == 'function' && param.fail(param);
      },
      complete: function complete(res) {
        typeof param.complete == 'function' && param.complete(param);
      }
    });
  },
  //选择视频
  chooseVideo: function chooseVideo(callback, maxDuration) {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: maxDuration || 60,
      camera: ['front', 'back'],
      success: function success(res) {
        typeof callback == 'function' && callback(res.tempFilePaths[0]);
      }
    });
  },
  //选择上传图片到服务器
  chooseImage: function chooseImage(callback, count) {
    var that = this;
    wx.chooseImage({
      count: count || 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function success(res) {
        var tempFilePaths = res.tempFilePaths,
            imageUrls = [];

        that.showToast({
          title: '提交中...',
          icon: 'loading',
          duration: 10000
        });
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: that.globalData.siteBaseUrl + 'upload_img',
            filePath: tempFilePaths[i],
            name: 'img_data',
            success: function success(res) {
              var data = JSON.parse(res.data);
              if (data.status == 0) {
                imageUrls.push(data.data);
                if (imageUrls.length == tempFilePaths.length) {
                  that.hideToast();
                  typeof callback == 'function' && callback(imageUrls);
                }
              } else {
                that.showModal({
                  content: data.data
                });
              }
            },
            fail: function fail(res) {
              that.hideToast();
              console.log(res.errMsg);
            }
          });
        }
      }
    });
  },
  //图片预览options.urls(数组)
  previewImage: function previewImage(options) {
    wx.previewImage({
      current: options.current || '',
      urls: options.urls || [options.current]
    });
  },
  playVoice: function playVoice(filePath) {
    wx.playVoice({
      filePath: filePath
    });
  },
  pauseVoice: function pauseVoice() {
    wx.pauseVoice();
  },
  // 统计用户分享
  countUserShareApp: function countUserShareApp() {
    this.sendRequest({
      url: 'user_share'
    });
  },

  // 调用微信支付接口
  wxPay: function wxPay(param) {
    var _this = this;
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': param.signType,
      'paySign': param.paySign,
      success: function success(res) {
        _this.wxPaySuccess(param);
        typeof param.success === 'function' && param.success();
      },
      fail: function fail(res) {

        if (res.errMsg === 'requestPayment:fail cancel') {
          res.errMsg = '支付取消';
          typeof param.fail === 'function' && param.fail(param);
          return;
        }
        if (res.errMsg === 'requestPayment:fail') {
          res.errMsg = '支付失败';
        }
        _this.showModal({
          content: res.errMsg
        });
        _this.wxPayFail(param, res.errMsg);
        typeof param.fail === 'function' && param.fail();
      }
    });
  },
  //支付成功回调
  wxPaySuccess: function wxPaySuccess(param) {
    let params = {};
    let that = this;
    params.order_id = param.order_id;

    return this.getdata.fetchApi('order/order_status',params)
    .then(d => {
      if (d.status==1) {
        that.turnToPage('/pages/paySuccess/paySuccess?order_id='+params.order_id,true);
      } else {
        
      }
    })

  },
  //支付失败回调
  wxPayFail: function wxPayFail(param, errMsg) {
    let params = {};
    let that = this;
    params.order_id = param.orderId;
    params.fail_reason = errMsg;

    return this.getdata.fetchApi('order/order_status',params)
    .then(d => {
      if (d.status==1) {
        this.turnToPage('/pages/payFail/payFail?order_id='+param.order_id+'&order_sn='+param.order_sn,true);
      } else {
        
      }
    })

  },
  resetPay:function(params){//重新支付
    let that = this;
    this.getdata.fetchApi('order/get_pay_info',params)
      .then(d => {
        if (d.status==1) {
          that.wxPay(d.data);
        } else {
          that.showModal({content:'请求失败'})
        }
      })
  },
  // 拨打电话
  makePhoneCall: function makePhoneCall(number, callback) {
    if (number.currentTarget) {
      var dataset = number.currentTarget.dataset;

      number = dataset.number;
    }
    wx.makePhoneCall({
      phoneNumber: number,
      success: callback
    });
  },
  // 获取地理位置
  getLocation: function getLocation(options) {
    wx.getLocation({
      type: 'wgs84',
      success: options.success,
      fail: options.fail
    });
  },
  // 选择地图上位置
  chooseLocation: function chooseLocation(options) {
    wx.chooseLocation({
      success: function success(res) {
        console.log(1111);
        console.log(res);
        options.success(res);
      },
      cancel: options.cancel,
      fail: options.fail
    });
  },
  locationOpenSetting: function locationOpenSetting(res) {
    if(res.errMsg=="chooseLocation:fail auth deny"){//地理位置失败
      this.wxOpenSetting({success:getApp().getAppCurrentPage().setLocation,stype: 1});
    }
  },
  //使用微信内置地图查看位置
  openLocation: function openLocation(options) {
    wx.openLocation(options);
  },
  //设置系统剪贴板的内容
  setClipboardData: function setClipboardData(options) {
    wx.setClipboardData({
      data: options.data || '',
      success: options.success,
      fail: options.fail,
      complete: options.complete
    });
  },
  //获取系统剪贴板内容
  getClipboardData: function getClipboardData(options) {
    wx.getClipboardData({
      success: options.success,
      fail: options.fail,
      complete: options.complete
    });
  },
  //显示当前页面的转发按钮
  showShareMenu: function showShareMenu(options) {
    options = options || {};
    wx.showShareMenu({
      withShareTicket: options.withShareTicket || false,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    });
  },
  //调起客户端扫码界面
  scanCode: function scanCode(options) {
    options = options || {};
    wx.scanCode({
      onlyFromCamera: options.onlyFromCamera || false,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    });
  },

  // 登录微信
  login: function login() {
    var that = this;

    wx.login({
      success: function success(res) {
        if (res.code) {
          //正常获取到jscode
          that.sendCode(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      },
      fail: function fail(res) {
        console.log('login fail: ' + res.errMsg);
      }
    });
  },
  //检查登陆是否有效
  checkLogin: function checkLogin() {
    if (!this.getSessionKey()) {
      this.sendSessionKey();
    } else {
      this.pageInitial();
    }
  },
  //登陆成功后初始当前页面数据方法
  pageInitial: function pageInitial() {
    //this.getAppCurrentPage().dataInitial();
  },
  // 向服务器发送微信code授权返回的SessionKey
  sendCode: function sendCode(code) {
    var that = this;
    this.sendRequest({
      url: 'user/login',
      data: {
        code: code
      },
      success: function success(res) {

        that.setSessionKey(res.data.session_key); //获得SessionKey
        that.requestUserInfo(res.data.is_login,res.data.session_key); //
        that.pageInitial();
      },
      fail: function fail(res) {
        console.log('sendCode fail');
      },
      complete: function complete(res) {}
    });
  },
  sendSessionKey: function sendSessionKey() {
    var that = this;
    try {
      var key = wx.getStorageSync('session_key');
    } catch (e) {}
    //sessionkey不存在就重新登陆
    if (!key) {
      console.log("check login key=====");
      this.login();
    } else {
      this.globalData.sessionKey = key;
      this.sendRequest({
        url: 'user/login',
        success: function success(res) {
          if (!res.is_login) {
            // 如果没有登录
            that.login();
            return;
          } else if (res.is_login == 2) {
            that.globalData.notBindXcxAppId = true;
          }
          that.requestUserInfo(res.is_login);
          that.pageInitial();
        },
        fail: function fail(res) {
          console.log('sendSessionKey fail');
        }
      });
    }
  },
  //判断获取用户是否新用户，获取信息
  requestUserInfo: function requestUserInfo(is_login,session_key) {
    if (is_login == 1) {
      this.requestUserXcxInfo(session_key,is_login); //已存在，获取服务器用户信息
    } else {
      this.requestUserWxInfo(session_key,is_login); //不存在，获取微信服务器用户信息
    }
  },
  //从服务器获取用户信息
  requestUserXcxInfo: function requestUserXcxInfo(session_key) {
    let that = this;
    let params = {};
    params.session_key = session_key;
    
    return this.getdata.fetchApi('user/get_user_info',params)
    .then(d => {
      if (d.status==1) {
        that.setUserInfoStorage(d.data,that.getAppCurrentPage().onLoad()); //设置登陆信息
      } else {
        
      }
    })

  },
  //获取微信信息上传服务器
  requestUserWxInfo: function requestUserWxInfo(session_key='',is_login=0) {
    var that = this;
    wx.getUserInfo({
      lang:'zh_CN',
      success: function success(res) {
        that.sendUserInfo(res.userInfo);
      },
      fail: function fail(res) {
        //没有授权，则重新询问授权
        console.log(res.errMsg)
        if(res.errMsg=="getUserInfo:fail auth deny" || res.errMsg=="getUserInfo:fail data no response"){
          console.log(that.globalData.isConfirmAuth)
          if(that.globalData.isConfirmAuth==false){
            that.globalData.isConfirmAuth = true;
            that.showModal({content:'微信向您询问授权，请您允许通过！！如果没有提示获取授权,请在小程序列表删除再进入。',confirm:that.wxOpenSetting,stype:2});
          }
        }
      }
    });
    
  },
  wxOpenSetting: function wxOpenSetting(options={}) {//询问微信用户信息授权
    var that = this;
    wx.openSetting({
      success: (res) => {
        if(options.stype==1){//地理位置授权
          that.chooseLocation(options);
        }else if(options.stype==2){//用户信息
          wx.getUserInfo({
            lang:'zh_CN',
            success: function success(res) {
              that.sendUserInfo(res.userInfo);
            },
            fail: function fail(res) {
              that.setSessionKey('');
              that.globalData.isConfirmAuth = false;
            }
          });
        }
      }
    })
  },
  //***将微信用户信息上传服务器，注册并返回用户数据
  sendUserInfo: function sendUserInfo(userInfo) {
    var that = this;
    this.sendRequest({
      url: 'user/login_user',
      method: 'post',
      data: {
        nickname: userInfo['nickName'],
        gender: userInfo['gender'],
        city: userInfo['city'],
        province: userInfo['province'],
        country: userInfo['country'],
        headimg: userInfo['avatarUrl']
      },
      success: function success(res) {
        if (res.status == 1) {
          that.setUserInfoStorage(res.data,that.getAppCurrentPage().onLoad()); //设置登陆信息
		  
        }
      },
      fail: function fail(res) {
        console.log('requestUserXcxInfo fail');
      }
    });
  },

  //页面数据初始
  dataInitial: function dataInitial() {
    var _this = this,
        pageInstance = this.getAppCurrentPage(),
        newdata = {};
  },

  inputChange: function inputChange(dataset, value) {
    var pageInstance = this.getAppCurrentPage();
    var datakey = dataset.datakey;
    var segment = dataset.segment;

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    var newdata = {};
    newdata[datakey] = value;
    pageInstance.setData(newdata);
  },
  bindDateChange: function bindDateChange(dataset, value) {
    var pageInstance = this.getAppCurrentPage();
    var datakey = dataset.datakey;
    var compid = dataset.compid;
    var formcompid = dataset.formcompid;
    var segment = dataset.segment;
    var newdata = {};

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }

    var obj = pageInstance.data[formcompid]['form_data'];
    if (util.isPlainObject(obj)) {
      obj = pageInstance.data[formcompid]['form_data'] = {};
    }
    obj = obj[segment];

    if (!!obj) {
      var date = obj.substr(0, 10);
      var time = obj.substr(11);

      if (obj.length == 16) {
        newdata[datakey] = value + ' ' + time;
      } else if (obj.length == 10) {
        newdata[datakey] = value;
      } else if (obj.length == 5) {
        newdata[datakey] = value + ' ' + obj;
      } else if (obj.length == 0) {
        newdata[datakey] = value;
      }
    } else {
      newdata[datakey] = value;
    }
    newdata[compid + '.date'] = value;
    pageInstance.setData(newdata);
  },
  bindTimeChange: function bindTimeChange(dataset, value) {
    var pageInstance = this.getAppCurrentPage();
    var datakey = dataset.datakey;
    var compid = dataset.compid;
    var formcompid = dataset.formcompid;
    var segment = dataset.segment;
    var newdata = {};

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }

    var obj = pageInstance.data[formcompid]['form_data'];
    if (util.isPlainObject(obj)) {
      obj = pageInstance.data[formcompid]['form_data'] = {};
    }
    obj = obj[segment];

    if (!!obj) {
      var date = obj.substr(0, 10);
      var time = obj.substr(11);

      if (obj.length == 16) {
        newdata[datakey] = date + ' ' + value;
      } else if (obj.length == 10) {
        // 只设置了 date
        newdata[datakey] = obj + ' ' + value;
      } else if (obj.length == 5) {
        // 只设置了 time
        newdata[datakey] = value;
      } else if (obj.length == 0) {
        newdata[datakey] = value;
      }
    } else {
      newdata[datakey] = value;
    }
    newdata[compid + '.time'] = value;
    pageInstance.setData(newdata);
  },
  bindSelectChange: function bindSelectChange(dataset, value) {
    var pageInstance = this.getAppCurrentPage();
    var datakey = dataset.datakey;
    var segment = dataset.segment;

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    var newdata = {};
    newdata[datakey] = value;
    pageInstance.setData(newdata);
  },
  bindScoreChange: function bindScoreChange(dataset) {
    var pageInstance = this.getAppCurrentPage();
    var datakey = dataset.datakey;
    var value = dataset.score;
    var compid = dataset.compid;
    var formcompid = dataset.formcompid;
    var segment = dataset.segment;

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    var newdata = {};
    newdata[datakey] = value;
    newdata[compid + '.editScore'] = value;
    pageInstance.setData(newdata);
  },
  tapMapDetail: function tapMapDetail(dataset) {
    var params = dataset.eventParams;
    if (!params) return;

    params = JSON.parse(params)[0];
    this.openLocation({
      latitude: params.latitude,
      longitude: params.longitude,
      name: params.desc,
      address: params.name
    });
  },
  udpateVideoSrc: function udpateVideoSrc(dataset) {
    var pageInstance = this.getAppCurrentPage();
    var compid = dataset.compid;

    this.chooseVideo(function (filePath) {
      var newdata = {};
      newdata[compid + '.src'] = filePath;
      pageInstance.setData(newdata);
    });
  },
  uploadFormImg: function uploadFormImg(dataset) {
    var pageInstance = this.getAppCurrentPage();
    var compid = dataset.compid;
    var formcompid = dataset.formcompid;
    var datakey = dataset.datakey;
    var segment = dataset.segment;

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      console.log('segment empty 请绑定数据对象字段');
      return;
    }
    this.chooseImage(function (res) {
      var img_src = res[0];
      var newdata = pageInstance.data;
      _typeof(newdata[compid + '.content']) == 'object' ? '' : newdata[compid + '.content'] = [];
      _typeof(newdata[datakey]) == 'object' ? '' : newdata[datakey] = [];
      newdata[datakey].push(img_src);
      newdata[compid + '.display_upload'] = false;
      newdata[compid + '.content'].push(img_src);
      pageInstance.setData(newdata);
    });
  },
  deleteUploadImg: function deleteUploadImg(dataset) {
    var pageInstance = this.getAppCurrentPage();
    var formcompid = dataset.formcompid;
    var index = dataset.index,
        compid = dataset.compid,
        datakey = dataset.datakey,
        newdata = pageInstance.data;
    compid = formcompid + compid.substr(4);
    this.showModal({
      content: '确定删除该图片？',
      confirm: function confirm() {
        newdata[compid + '.content'].splice(index, 1);
        newdata[datakey].splice(index, 1);
        pageInstance.setData(newdata);
      }
    });
  },
  listVesselTurnToPage: function listVesselTurnToPage(dataset) {
    var pageInstance = this.getAppCurrentPage();
    var data_id = dataset.dataid;
    var router = dataset.router;
    var page_form = pageInstance.page_form;

    if (router == -1 || router == '-1') {
      return;
    }
    if (page_form != '') {
      this.turnToPage('/pages/' + router + '/' + router + '?id=' + data_id);
    }
  },
  getAssessList: function getAssessList(param) {
    param.url = 'user/get_assess_list';
    this.sendRequest(param);
  },
  modifyPostParam: function modifyPostParam(obj) {
    var query = '',
        name = void 0,
        value = void 0,
        fullSubName = void 0,
        subName = void 0,
        subValue = void 0,
        innerObj = void 0,
        i = void 0;

    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.modifyPostParam(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.modifyPostParam(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },
  getHomepageRouter: function getHomepageRouter() {
    return this.globalData.homepageRouter;
  },
  getAppId: function getAppId() {
    return this.globalData.appId;
  },
  getDefaultPhoto: function getDefaultPhoto() {
    return this.globalData.defaultPhoto;
  },
  getSessionKey: function getSessionKey() {
    //return this.globalData.sessionKey;
    let session_key = this.getLocalStorage('session_key');
    if(!session_key){
      wx.getStorage({key: 'session_key',
        success: function(res) {
            return res.data;
        }
      })
    }else{
      return session_key;
    }
  },
  setSessionKey: function setSessionKey(session_key) {
    this.globalData.sessionKey = session_key;
    wx.setStorage({
      key: 'session_key',
      data: session_key
    });
  },
  setLocalStorage: function setLocalStorage(key, value) {
    //设置本地数据
    wx.setStorage({
      key: key,
      data: value
    });
  },
  getLocalStorage: function getLocalStorage(key) {
    //get本地数据
    return wx.getStorageSync(key);
  },
  //获取用户信息
  getUserInfo: function getUserInfo() {
    return this.globalData.userInfo;
  },
  setUserInfoStorage: function setUserInfoStorage(info,callback) {
    for (var key in info) {}
	var key = 'userInfo';
      this.globalData.userInfo = info;
    wx.setStorageSync('client_id',this.globalData.userInfo.openid);//2018-03-14 10:05:52
    wx.setStorage({
      key: key,
      data: this.globalData.userInfo
    });
	typeof callback == 'function' && callback();
  },
  setPageUserInfo: function setPageUserInfo() {
    var currentPage = this.getAppCurrentPage(),
        newdata = {};

    newdata['userInfo'] = this.getUserInfo();
    currentPage.setData(newdata);
  },
  //获取当前页面js实例
  getAppCurrentPage: function getAppCurrentPage() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
  },
  getWaimaiTotalNum: function getWaimaiTotalNum() {
    return this.globalData.waimaiTotalNum;
  },
  setWaimaiTotalNum: function setWaimaiTotalNum(num) {
    this.globalData.waimaiTotalNum = num;
  },
  getWaimaiTotalPrice: function getWaimaiTotalPrice() {
    return this.globalData.waimaiTotalPrice;
  },
  setWaimaiTotalPrice: function setWaimaiTotalPrice(price) {
    this.globalData.waimaiTotalPrice = price;
  },
  getWaimaiCartIds: function getWaimaiCartIds() {
    return this.globalData.waimaiCartIds;
  },
  setWaimaiCartId: function setWaimaiCartId(goodsId, cartId) {
    if (cartId && cartId != 0) {
      this.globalData.waimaiCartIds[goodsId] = cartId;
    } else {
      delete this.globalData.waimaiCartIds[goodsId];
    }
  },
  getTabPagePathArr: function getTabPagePathArr() {
    return JSON.parse(this.globalData.tabBarPagePathArr);
  },

  tapInnerLinkHandler: function tapInnerLinkHandler(event) {
    var param = event.currentTarget.dataset.eventParams;
    if (param) {
      param = JSON.parse(param);
      var url = param.inner_page_link;
      if (url === 'prePage') {
        this.turnBack();
      } else if (url) {
        var is_redirect = param.is_redirect == 1 ? true : false;
        this.turnToPage(url, is_redirect);
      }
    }
  },
  tapPhoneCallHandler: function tapPhoneCallHandler(event) {
    if (event.currentTarget.dataset.eventParams) {
      var phone_num = JSON.parse(event.currentTarget.dataset.eventParams)['phone_num'];
      this.makePhoneCall(phone_num);
    }
  },

  getAppTitle: function getAppTitle() {
    return this.globalData.appTitle;
  },
  getAppDescription: function getAppDescription() {
    return this.globalData.appDescription;
  },
  pageScrollTo: function pageScrollTo(position=0) {
    wx.pageScrollTo({
      scrollTop: position
    })
  },
  //用户位置信息
  setLocationInfo: function setLocationInfo(info) {
    console.log(info)
    this.globalData.locationInfo = info;
  },
  //获取位置信息
  getLocationInfo: function getLocationInfo() {
    return this.globalData.locationInfo;
  },
  //域名根地址
  getSiteBaseUrl: function getSiteBaseUrl() {
    return this.globalData.siteBaseUrl;
  },
  //固定位置信息
  getUrlLocationId: function getUrlLocationId() {
    return this.globalData.urlLocationId;
  },

  //默认公共数据初始
  globalData: {
    appId: 'x6ppP5z73H',
    ver:'v1.0.1',//版本*** online|offline
    tabBarPagePathArr: '[]',
    homepageRouter: '', //主页地址
    firstPage: true,
    formData: null,
    userInfo: {},
    sessionKey: '',
    isConfirmAuth:false,
    notBindXcxAppId: false,
    locationInfo: {
      latitude: '',
      longitude: '',
      address: ''
    },
    urlLocationId: '',
    defaultPhoto: '',
		siteUrl: 'https://caibei.weixingzpt.com',
		siteBaseUrl: 'https://caibei.weixingzpt.com/api',
		imgUrl: 'https://caibei.weixingzpt.com/image/',//小程序图片地址

    appTitle: '',
    appDescription: '',
    appLogo: ''
  }

});
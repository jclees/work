const app = getApp()
const common = require('../../assets/js/common');
var countdown = 60;
var settime = function(that) {
  if (countdown == 0) {
    that.setData({
      is_show: !0
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: !1,
      last_time: countdown
    })
    countdown--;
  }
  setTimeout(function() {
    settime(that)
  }, 1000)
};
Page({
  data: {
    img_url: app.data.imgUrl,
    submitTxt: "确认提交",
    savaStatus: !0,
    phone: '',
    last_time: '',
    is_show: !0,
  },
  onLoad: function(options) {
    let that = this
  },
  onShow() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (member_id) {
      that.setData({
        member_id: member_id,
      })
    }
  },
  bindInpVal(e) {
    let that = this,
      val = e.detail.value;
    that.setData({
      yzmVal: val
    })
  },
  validate(data) {
    // debugger
    let val = data.val,
      reg = data.reg,
      msg = data.msg;
    // if (val == '' || val == null || val == undefined) {
    //   wx.showToast({
    //     title: msg + "不能为空",
    //     icon: 'none'
    //   })
    //   return !1
    // }
    if (reg && !(reg.exec(val))) {
      wx.showToast({
        title: "请输入正确的" + msg,
        icon: 'none'
      })
      return !1
    }
    return !0
  },
  sendCode(e) {
    let data = e.detail.value;
    console.log(data)
    app.getFormId(this, e);
    let that = this;
    if (!that.validate({
      val: data.phone,
        reg: /^[1][3,4,5,7,8][0-9]{9}$/,
        msg: '手机号'
      })) return;
    common.post('/member/sendsmscode',
      data
    ).then(res => {
      console.log("发送验证码")
      console.log(res)
    
      if (res.data.err_code == 0) {
        settime(that);
        data.codekey = res.data.result.codekey
        that.setData({
          formData:data,
          is_show: (!that.data.is_show) //false
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  savaData(e) {
    app.getFormId(this, e);
    let that = this;
    let data = that.data.formData;
    if (data == void 0){
      wx.showToast({
        title: '请完善个人信息',
        icon:'none'
      })
      return
    }
    data.member_id = that.data.member_id;
    data.smscode = that.data.yzmVal
    console.log(data)
    // debugger
    // if (!that.validate({
    //     val: data.name,
    //     reg: /^[\u4e00-\u9fa5]{2,4}$/,
    //     msg: '姓名'
    //   })) return;
    // if (!that.validate({
    //     val: data.icard,
    //     reg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    //     msg: '身份证号'
    //   })) return;

    // if (!that.validate({
    //     val: data.card_name,
    //     msg: '银行名称'
    //   })) return;

    // if (!that.validate({
    //     val: data.card_account,
    //     msg: '银行卡号'
    //   })) return;

    // if (!that.validate({
    //     val: data.phone,
    //     reg: /^[1][3,4,5,7,8][0-9]{9}$/,
    //     msg: '手机号'
    //   })) return;

    // if (!that.validate({
    //   val: data.smscode,
    //   msg: '验证码'
    // })) return;

    that.data.savaStatus && that.setData({
      submitTxt: '提交中...',
      savaStatus: !1
    });
    common.post('/member/register', data).then(res => {
      console.log("提交注册数据")
      console.log(res)

      if (res.data.err_code == 0) {
        that.setData({
          submitTxt: '认证成功，跳转中...',
        });
        setTimeout(function() {
          wx.reLaunch({
            url: '/pages/readingPact/readingPact',
          })
        }, 2000)
      } else {
        that.setData({
          submitTxt: '重新提交',
          savaStatus: !0
        });
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
      that.setData({
        submitTxt: '重新提交',
        savaStatus: !0
      });
    })
  }
})
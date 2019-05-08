//index.js
//获取应用实例
const app = getApp()
let common = require('../../assets/js/common');
Page({
  data: {
    imgUrl: app.data.imgUrl,
    pop: false,
    pop2: false,
    pop3: false,
    isShowToast: false,
    kaifa: false,
    hdStatus: false,
  },
  onShow() {
    let _this = this
    // 获取信息
    _this.getInfo();
    // 获取活动信息
    _this.getActive();
  },
  onLoad: function(options) {
    let _this = this
    if (options.id) {
      _this.setData({
        parent_id: options.id,
        activeId: options.activeId
      })
    }
    if (options.attention) {
      _this.setData({
        attention: options.attention,
      })
    }
  },
  // 打开弹出框
  openPop() {
    this.setData({
      pop: true
    })
  },
  // 关闭弹出框
  closePop() {
    this.setData({
      pop: false
    })
  },
  inputYzcode(e) {
    var that = this;
    that.setData({
      yzcodeValue: e.detail.value
    })
  },
  //原有 新用户
  oldOrNewUser(e) {
    let _this = this
    let yzcodeValue = _this.data.yzcodeValue
    //e.target.id 为1 是旧用户
    //e.target.id 为2 是新用户
    if (e.target.id == 1) {
      if (yzcodeValue == '' || yzcodeValue == undefined) {
        wx.showToast({
          title: "身份验证码不能为空",
          icon: 'none',
          duration: 2000
        })
      } else {
        common.get('/user/index_code', {
          member_id: _this.data.id,
          index_code: yzcodeValue,
          type: e.target.id,
          action_id: _this.data.action_id || ''
        }).then(res => {
          console.log("旧用户")
          console.log(res)
          if (res.data.code == 1000) {
            //同步旧分享数据
            _this.synData()
            _this.setData({
              pop2: false
            })

            // if (res.data.is_chai == 1){
            //   wx.redirectTo({
            //     url: '../../pages/kai/kai'
            //   })
            // }else{

            // }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(res => {
          let reason = [];
          for (let i in res.data.errors) {
            reason.push(res.data.errors[i][0])
          }
          app.showToast(reason[0] || res.data.message, _this, 2000)
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '此操作代表您确认未使用《BST牛》过,或自愿放弃原有收益！',
        success: function(res) {
          if (res.confirm) {
            common.get('/user/index_code', {
              member_id: _this.data.id,
              index_code: yzcodeValue || '',
              type: e.target.id,
              action_id: _this.data.action_id || ''
            }).then(res => {
              console.log("新用户")
              console.log(res)
              if (res.data.code == 1000) {
                _this.setData({
                  pop2: false
                })
                //同步旧分享数据
                _this.synData()
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }).catch(res => {
              let reason = [];
              for (let i in res.data.errors) {
                reason.push(res.data.errors[i][0])
              }
              app.showToast(reason[0] || res.data.message, _this, 2000)
            })
          }
        }
      })
    }
  },
  //同步旧分享数据
  synData() {
    let _this = this
    common.get('/user/tongshare', {
      member_id: _this.data.id,
      action_id: _this.data.action_id || ''
    }).then(res => {
      console.log("同步旧分享数据")
      console.log(res)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  open(e) {
    let _this = this;
    wx.getUserInfo({
      success: function(res) {
        let user = res
        wx.setStorageSync('user', user)
        console.log("	用户信息加密数据")
        console.log(user.encryptedData)
        console.log(user.iv)
        common.post('/user/info', {
          id: _this.data.id,
          action_id: _this.data.info.id,
          encryptedData: user.encryptedData,
          iv: user.iv,
          parent_id: _this.data.parent_id ? _this.data.parent_id : ''
        }).then(res => {
          console.log(res)
          if (res.data.code == 120) {
            _this.setData({
              pop3: true
            })
          } else {
            if (_this.data.attention == 'yes') {
              _this.editUserType()
            }
            _this.setData({
              money: res.data.data,
              formId: e.detail.formId
            })
            _this.getFormId()
            console.log('授权成功 准备跳转页面')
            console.log(res.data)
            if (!_this.data.hdStatus && !_this.data.kaifa) {
              wx.redirectTo({
                url: '../../pages/kai/kai?money=' + res.data.data.balance,
              })
            }
            // wx.navigateTo({
            //   url: '../../pages/kai/kai?money=' + res.data.data.coin,
            // })
          }
        }).catch(res => {
          console.log(res)

          let reason = [];
          for (let i in res.data.errors) {
            reason.push(res.data.errors[i][0])
          }
          app.showToast(reason[0] || res.data.message, _this, 2000)
        })
      }
    })
  },
  editUserType() { //修改用户关注类型
    let _this = this;
    console.log(_this.data.id)
    common.get('/user/types', {
      member_id: _this.data.id
    }).then(res => {
      console.log("获取状态成功")
      console.log(res)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  getFormId() { //取FormId
    let _this = this;
    common.get('/user/notes', {
      member_id: _this.data.id,
      form_id: _this.data.formId
    }).then(res => {
      console.log("获取formid成功===")
      console.log(res)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  // 判断用户是否授权
  getInfo() {
    let _this = this
    let encryptedData = ''
    let iv = ''
    wx.login({
      success: function(res) {
        if (app.globalData.shareInfo) {
          console.log(app.globalData.shareInfo)
          encryptedData = app.globalData.shareInfo.encryptedData
          iv = app.globalData.shareInfo.iv
        }
        console.log("11111111112312312")
        console.log(encryptedData)
        console.log(iv)
        common.get('/user/check', {
          code: res.code,
          encryptedDataGroup: encryptedData,
          ivGroup: iv
        }).then(result => {
          console.log("check接口返回成功")
          console.log(result)
          
          if (result.data.data.code === 0) {
            // 未授权
            console.log("未授权")
            console.log(result.data)
            _this.setData({
              id: result.data.data.id
            })
            wx.setStorageSync('id', result.data.data.id)
            //修改用户关注类型
            if (_this.data.attention) {
              _this.editUserType();
            }
            //result.data.data.status = 0 弹框
            if (result.data.data.status == 0) {
              _this.setData({
                pop2: true
              })
            } else {
              _this.setData({
                pop2: false
              })
              //同步旧分享数据
              _this.synData()
            }
          } else if (result.data.data.code === 1) {
            _this.setData({
              id: result.data.data.id
            })
            console.log("授过权")
            console.log(result.data)
            wx.setStorageSync('id', result.data.data.id)
            //修改用户关注类型
            if (_this.data.attention) {
              _this.editUserType();
            }
            //result.data.data.status = 0 弹框
            if (result.data.data.status == 0) {
              _this.setData({
                pop2: true
              })
            } else {
              _this.setData({
                pop2: false
              })
              //同步旧分享数据
              _this.synData()
            }
            // 已授权,开发为0时才可以跳转
            if (!_this.data.hdStatus && !_this.data.kaifa) {
              wx.redirectTo({
                url: '../../pages/kai/kai',
              })
            }
          }
        }).catch(result => {
          console.log("check接口返回失败")
          console.log(result)
          let reason = [];
          for (let i in result.data.errors) {
            reason.push(result.data.errors[i][0])
          }
          app.showToast(reason[0] || result.data.message, _this, 2000)
        })
      }
    });
  },
  // 获取活动信息
  getActive() {
    common.get('/user/active', {
      id: this.data.activeId ? this.data.activeId : ''
    }).then(res => {
      console.log("活动信息")
      console.log(res)
      this.setData({
        info: res.data.data
      })
      wx.setStorageSync('activeId', res.data.data.id)
      wx.setStorageSync('title', res.data.data.name)
      wx.setNavigationBarTitle({
        title: res.data.data.name
      })
      if (res.data.data.status == 0) {
        this.setData({
          hdStatus: true,
          intro: res.data.data.nostart_intro
        })
      } else if (res.data.data.status == 2) {
        this.setData({
          hdStatus: true,
          intro: res.data.data.end_intro
        })
      } else {
        this.setData({
          hdStatus: false,
        })
      }
      // 获取小程序开发说明
      if (res.data.data.kaifa == 1) {
        this.setData({
          kaifa: true
        })
      }
      // 获取潜力币说明
      this.getArt();
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取潜力币说明
  getArt() {
    common.get('/active/intro', {
      id: this.data.info.id
    }).then(res => {
      this.setData({
        art: res.data.data
      })
      wx.setStorageSync('art', res.data.data)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  closeHd() {
    let _this = this
    _this.setData({
      hdStatus: false
    })
  }
})
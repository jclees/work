// pages/question/question.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pop:false,
    isShowToast: false,
    confirmFlag: true,
    img_url: app.data.url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:wx.getStorageSync('type'),
      name:wx.getStorageSync('name'),
      member_id: wx.getStorageSync('member_id'),
      id:wx.getStorageSync('id')
    })
  },
  // 输入题目
  inputName(e){
    this.setData({
      answerName:e.detail.value
    })
  },  
  // 打开二次确认框
  openPop(){
    this.setData({
      pop:true
    })
  },
  error1(e){
    this.setData({
      error1:e.detail.value
    })
  },
  error2(e) {
    this.setData({
      error2: e.detail.value
    })
  },
  error3(e) {
    this.setData({
      error3: e.detail.value
    })
  },
  error4(e) {
    this.setData({
      error4: e.detail.value
    }) 
  },
  time:null,
  // 二次确认
  confirm(){
    wx.showLoading({
      title: '题目提交中',
    })
    let _this=this;
    let answer=[];
    answer[0] = _this.data.error1||"";
    answer[1] = _this.data.error2||"";
    answer[2] = _this.data.error3||"";
    answer[3] = _this.data.error4||"";
    _this.setData({
      confirmFlag:false
    })
    common.post('/question/create',{
      member_id: _this.data.member_id,
      categorys_id:_this.data.id,
      name: _this.data.answerName,
      question: answer 
    }).then(res=>{
      wx.hideLoading()
      if(res.data.status==200){
        app.showToast('提交成功', _this, 2000);
        _this.setData({
          pop: false
        })
        setTimeout(()=>{
          // wx.navigateBack({
          //   delta: 2
          // })
          wx.reLaunch({
            url: '../../pages/answer/answer'
          })
        },1500)
      }else if(res.data.code==422){
        app.showToast(res.data.message, _this, 2000)
        _this.setData({
          confirmFlag: true
        })
      }
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000);
      _this.setData({
        confirmFlag: true
      })
    })
  },
  closePop:function(){
    this.setData({
      pop: false
    })
  },
  onUnload:function(){
    clearTimeout(this.time);
  }
})
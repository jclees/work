const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {
    numStatus: !0,
    payStatus: 1,
    total: 0,
    payItems: [{
      id: 1,
      checked: !0,
      name: '免费赠送'
    }, {
      id: 2,
      checked: !1,
      name: '环保币'
    }, {
      id: 4,
      checked: !1,
      name: '人民币'
    }, {
      id: 3,
      checked: !1,
      name: '环保积分'
    }, ]
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      lists: app.globalData.huishouTypes
    })
  },
  onShow: function() {
    let that = this
  },
  tapPay(e) {
    publicMethod.getFormId(e, this)
    let that = this;
    let curIdx = e.currentTarget.dataset.curidx;
    let id = e.currentTarget.dataset.id;
    let data = that.data.payItems;
    let lists = that.data.lists;

    for (let i in data) {
      data[i].checked = !1
    }
    data[curIdx].checked = !0
    that.setData({
      payItems: data,
      payStatus: id
    })
    that.tongjiTot()
  },
  tongjiTot() {
    let that = this;
    let lists = that.data.lists;
    let id = that.data.payStatus;
    let tem = 0;

    for (let i in lists) {
      if (id == 2) { //环保币
        tem = tem + (lists[i].num * lists[i].cion_price);
      } else if (id == 3) { //环保积分
        tem += lists[i].num * lists[i].integral_price;
      } else if (id == 4) { //人民币
        tem += lists[i].num * lists[i].money_price;
      }

    }
    let tot = tem.toFixed(2);


    that.setData({
      total: tot
    })
  },
  //增加删除
  addOrRed(e) {
    publicMethod.getFormId(e, this)
    let that = this;
    let curIdx = e.currentTarget.dataset.curidx;
    let who = e.currentTarget.dataset.who;
    let data = that.data.lists;
    let numStatus = that.data.numStatus;

    if (!numStatus) {
      return
    }
    if (who == 2) {
      if (data[curIdx].num == 0) {
        return
      }
      data[curIdx].num--
    } else {
      data[curIdx].num++
    }
    that.setData({
      lists: data
    })
    that.changePrice()
    that.tongjiTot()
  },
  changePrice() {
    let data = this.data.lists;
    for (var i = 0; i < data.length; i++) {

      let old1 = data[i].num * data[i].money_price;
      let new1 = old1.toFixed(2);
      let old2 = data[i].num * data[i].cion_price;
      let new2 = old2.toFixed(2);
      let old3 = data[i].num * data[i].integral_price;
      let new3 = old3.toFixed(2);

      data[i].money = new1
      data[i].coin = new2
      data[i].jifen = new3
    }

    //更新数据
    this.setData({
      lists: data
    })
  },
  savaData(e) {
    publicMethod.getFormId(e, this)
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let formData = prevPage.data.formData;

    let data = that.data.lists;
    let a = [];
    let arr = [];
    for (let i in data) {
      let obj = {}
      obj.goods_id = data[i].id
      obj.goods_num = data[i].num
      arr.push(obj)
      a.push(data[i].name +"：" + data[i].num + data[i].unit)
    }
    let a1 = a.join("，")
    let str = arr

    formData.member_id = that.data.member_id
    formData.goods = str
    formData.pay_mode = that.data.payStatus
    prevPage.setData({
      formData,
      types: a1
    })
    wx.navigateBack()
  }
})
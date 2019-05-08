const app = getApp()
const common = require('../../assets/js/common');
Page({
  data: {
    // markers: [{
    //   latitude: "",
    //   longitude: "",
    //   name: 'T.I.T 创意园'
    // }],
    // covers: [{
    //   latitude: 23.099994,
    //   longitude: 116.297408,
    //   iconPath: '/images/location.png'
    // }, {
    //   latitude: 23.099994,
    //   longitude: 113.304520,
    //     iconPath: '/images/location.png'
    // }]
  },
  onLoad(){
    let that = this
    that.setData({
      nearListData: app.globalData.nearListData
    })
    that.seeAddress()
  },
  seeAddress() {
    let that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        let arr = []
        let obj = {}
        let nearListData = that.data.nearListData
        for (let i = 0; i < nearListData.length; i++) {
          obj.latitude = nearListData[i].lat
          obj.longitude = nearListData[i].lng
          obj.iconPath = '/images/location.png'
        }
        arr.push(obj)

        that.setData({
          // "markers[0].latitude": latitude,
          // "markers[0].longitude": longitude,
          latitude,
          longitude,
          markers: arr
        })
        
        // wx.openLocation({
        //   latitude: that.data.nearListData.lat,
        //   longitude: that.data.nearListData.lng
        // })
      }
    })
  },
})

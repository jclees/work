var wxCharts = require('../../utils/wxcharts-min.js');
var app = getApp();
var radarChart = null;
Page({
  data: {
    tupian: getApp().globalData.imgUrl,
  },
  touchHandler: function (e) {
    console.log(radarChart.getCurrentDataIndex(e));
  },
  onReady: function (e) {
    wx.showLoading({
      title: '加载数据中...',
      mask: true,
    });
    var That = this;
    let apiurl = 'userInfo/getInfo';
    console.log(apiurl);
    app.getdata.fetchApi(apiurl, {})
      .then(d => {
        if (d.status == 1) {
          console.log(d.data.canvas.data)
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          //
          for (let i = 0; i < d.data.canvas.length; i++) {
            console.log(i);
          }
          radarChart = new wxCharts({
            canvasId: 'radarCanvas',
            type: 'radar',
            // categories: ['文科', '流行', '娱乐', '生活', '理科', '文艺'],
            categories: d.data.canvas.names,
            series: [{
              name: d.data.grad_name,
              color: "#8e86c3",
              data: d.data.canvas.data
              // data: [0,0,0,0,0,0,]
            }],
            width: windowWidth,
            height: 260,
            extra: {
              legendTextColor: "#8e86c3",
              radar: {
                max: 200,
                labelColor: "#8e86c3",
              }
            }
          });
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
        console.error(e)
      })
  }
});



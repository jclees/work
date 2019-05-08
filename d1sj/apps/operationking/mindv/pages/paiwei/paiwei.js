//index.js
const app = getApp()

Page({
  data: {
    tupian: getApp().globalData.imgUrl,
    grad_logo: getApp().globalData.siteUrl,
  },
  gradPk(e){
  	let grad_num = e.currentTarget.dataset.grad_num;
        let consume_point = e.currentTarget.dataset.consume_point;
        let apiurl = 'user/is_enough_points';
        app.getdata.fetchApi(apiurl, { grad_id: grad_num})
          .then(d => {
            if (d.status == 1) {
            wx.setStorageSync('grad_id', grad_num);
            app.turnToPage('/pages/duizhan/duizhan?room_id='+grad_num+'&consume_point='+consume_point);
            console.log('id和数量');
            console.log(consume_point)
            console.log(grad_num)
            } else {
              app.showModal({content:d.message});
            }
          })
          .catch(e => {
            this.setData({ subtitle: '获取数据异常', loading: false })
            console.error(e)
          })
  },
  get_grad_list: function (){
      let apiurl = 'Grad/getGradList';
      app.getdata.fetchApi(apiurl, {})
      .then(d => {
        if (d.status == 1) {
          this.isReq=true;
          this.setData({grad:d.data})
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
        console.error(e)
      })
  },
  onLoad: function () {
      wx.setStorageSync('room_id');
      this.get_grad_list();
  },
  onShow: function (e) {
      if(this.isReq){
          this.get_grad_list();
      }
  }
});



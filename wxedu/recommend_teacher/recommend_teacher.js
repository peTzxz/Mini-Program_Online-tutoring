// order_detail.js
var app = getApp()
Page({
  data: {
    detail: [{

    }],
    id: null,
    height:740,
    logo:'../images/head.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      id: options.id,
      phone: options.tphone,
      subject: options.subject
    })
    app.globalData.base=0
    wx.request({
      url: app.globalData.url + 'getteacherinf/'+that.data.phone, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(res.data)
        that.setData({
          name: res.data[0].name,
          grade: res.data[0].grade,
          education: res.data[0].education,
          gender: res.data[0].gender,
          introduction: res.data[0].introduction,
          major: res.data[0].major,
          city: res.data[0].city,
          logo: res.data[0].headImg
        })
      },
    })
    wx.request({
      url: app.globalData.url + 'getteacherrelease/' + that.data.phone, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({ release: res.data })
      }
    })  
  },
 call:function(e){
   var that=this
   wx.makePhoneCall({
     phoneNumber: that.data.phone
   })
 }
})
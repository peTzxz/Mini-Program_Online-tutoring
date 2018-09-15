// order_detail.js
var app = getApp()
Page({
  data: {
    detail: [{headImg:'../images/head.png'

    }],
    id: null,
    height:740,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = null
    this.setData({ state: app.globalData.state, base:app.globalData.base,islogin: app.globalData.islogin })
    console.log(app.globalData.base)
    this.setData({
      id: options.id,
      phone: options.phone,
      subject: options.subject
    })
    console.log(this.data.islogin)
    if (app.globalData.base == 0)
      url = app.globalData.url + 'registeredteachers/'
    else
      url = app.globalData.url + 'registeredstudents/'
    this.setData({ url: url })
    wx.request({
      url: url + options.id, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data)
        that.setData({
          detail: data,
          img:data[0].headImg
        })
      }
    });
    console.log(that.data.phone)
    console.log(that.data.subject)
    wx.request({
      url: app.globalData.url + "getcomment/", //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        phone: that.data.phone,
        subject: that.data.subject
      },
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data)
        that.setData({
          comment: data,
          height:that.data.height+data.length*100
        })
      }
    });
  },
 call:function(e){
   var that=this
   var phone =that.data.phone
   console.log(phone)
   wx.makePhoneCall({
     phoneNumber: phone
   })
 },
 submit:function(){
   console.log(app.globalData.logininf[0])
   if (app.globalData.logininf[0].name == "未填写" || app.globalData.logininf[0].grade == "未填写" || app.globalData.logininf[0].address == "未填写") {
     wx.showModal({
       title: '提示',
       content: '请先填写个人信息（务必认真填写）',
       confirmText: '去填写',
       cancelText: '返回',
       success: function (res) {
         if (res.confirm) {
           console.log('用户点击去登录')
           wx: wx.navigateTo({
             url: '../pages/mydata/mydata',
             success: function (res) { },
             fail: function (res) { },
             complete: function (res) { },
           })
         } else if (res.cancel) {
           console.log('用户点击返回')
         }
       }
     })
   }else{
     wx.navigateTo({
       url: '../confirm_order/confirm_order?id='+this.data.id,
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
   }
 }
})
// order_detail.js
var app=getApp()
Page({
  data: {
      detail:[{

      }],
      id:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var url=null
    this.setData ({state:app.globalData.state,islogin:app.globalData.islogin})
    this.setData({id:options.id})
    console.log(this.data.islogin)
    if (app.globalData.state == 1)
      url = app.globalData.url +'registeredteachers/'
    else
      url = app.globalData.url +'registeredstudents/'
    this.setData({ url: url })
    wx.request({
      url: url+options.id, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data)
        that.setData({
          detail: data
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  islogin:function(){
    if(!this.data.islogin){
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText:'去登录',
        cancelText:'返回',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击去登录')
            wx:wx.redirectTo({
              url: '../pages/login/login',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          } else if (res.cancel) {
            console.log('用户点击返回')
          }
        }
      })
    }
  }
})
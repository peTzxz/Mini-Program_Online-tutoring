// check.js
var app = getApp()
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temp_string:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: App.globalData.url + 'appoint/' + options.id, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          detail: res.data
        })
        that.setData({
          temp_string: that.data.detail[0].comment.replace(that.data.detail[0].comment.slice(0,5),"")
        })
        console.log(that.data.temp_string)
        var s1 = that.data.detail[0].comment[0]
        var s2 = that.data.detail[0].comment[2]
        var s3 = that.data.detail[0].comment[4]
        var a = parseInt(s1)
        var b = parseInt(s2)
        var c = parseInt(s3)
        that.setData({ id: options.id })
        that.$wuxRater = App.Wux().$wuxRater
        that.$wuxRater.init('star1', {
          value: a,
          disabled: !0
        })
        that.$wuxRater.init('star2', {
          value: b,
          disabled: !0
        })
        that.$wuxRater.init('star3', {
          value: c,
          disabled: !0
        })
      }
    })
   
  },
  back: function (e) {
    wx.navigateBack({
      delta: 1
    })
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
  
  }
})
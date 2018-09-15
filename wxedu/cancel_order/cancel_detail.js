const App = getApp()
var util = require('../utils/util.js')
Page({

  data: {

  },
  onLoad: function (options) {
    var that = this
    that.setData({
      receive: options.receive
    })
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
      }
    })
    this.$wuxDialog = App.Wux().$wuxDialog
    this.$wuxXnumber = App.Wux().$wuxXnumber
    this.$wuxXnumber.init('num4', {
      min: 0,
      step: 1,
      longpress: !0,
      disabled: !1,
      callback: (value) => console.log(value),
    })
  },
  gettime: function () {
    var time = util.formatTime(new Date())
    console.log(time)
    this.setData({ generate: time })
  },
  confirm(event) {
    var that = this
    that.gettime()
    this.$wuxDialog.confirm({
      title: '确认退课',
      content: '确认后将扣除退款金额',
      onConfirm(e) {
        wx.request({
          url: App.globalData.url + 'refundaccept/' + that.data.detail[0].id, //仅为示例，并非真实的接口地址
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
          }
        })
        wx.request({
          url: App.globalData.url + 'message/',
          data: {
            state: 0,
            generate: that.data.generate,
            message: '同意了退课请求',
            send: App.globalData.current_phone,
            receive: that.data.receive
          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
          success: function (res) {
            console.log("submit success!!")
            app.globalData.logininf[0].sc-50
          },
        })
        wx.showToast({
          title: '同意退课请求！您被扣除50积分',
          icon: 'success',
          duration: 2000
        });
        wx.navigateBack({
          delta: 1
        })
      },  
      onCancel(e) {

      },
    })
  }, 
  refuse(event){
    var that = this
    that.gettime()
    wx.request({
      url: App.globalData.url + 'refundrefuse/' + that.data.detail[0].id, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    wx.request({
      url: App.globalData.url + 'message/',
      data: {
        state: 0,
        generate: that.data.generate,
        message: '拒绝了退课请求',
        send: App.globalData.current_phone,
        receive: that.data.receive
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        console.log("submit success!!")
      },
    })
    wx.showToast({
      title: '成功拒绝退课请求！',
      icon: 'success',
      duration: 2000
    });
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
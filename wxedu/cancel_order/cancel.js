const App = getApp()
var util = require('../utils/util.js')
Page({

  data: {
    refund_times: null,
    refund_price: null,
    refund_reason: null
  },
  onLoad: function (options) {
    var that = this
    this.$wuxToast = App.Wux().$wuxToast
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
  showToastText(err) {
    this.$wuxToast.show({
      type: 'text',
      timer: 1500,
      color: '#fff',
      text: err,
      success: () => console.log('文本提示')
    })
  },
  confirm(event) {
    var that = this
    that.gettime()
    that.setData({
      refund_times: that.data.$wux.xnumber.num4.value,
      refund_price: that.data.price,
      refund_reason: that.data.reason
    })
    if (that.data.refund_times == null) {
      that.showToastText('请输入已进行课时数')
    }
    else if (that.data.refund_price == null) {
      that.showToastText('请输入退款金额')
    }
    else if (that.data.refund_reason == null) {
      that.showToastText('请输入退款理由')
    }
    else if (that.data.refund_price > that.data.detail[0].price * that.data.detail[0].times - that.data.$wux.xnumber.num4.value * that.data.detail[0].price){
      that.showToastText('超出最大退款金额')
    }
    else {
      this.$wuxDialog.confirm({
        title: '确认退课',
        content: '请确认在退课前已与老师联系？',
        onConfirm(e) {
          wx.request({
            url: App.globalData.url + 'refundadd/' + that.data.detail[0].id, //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
              refund_times: that.data.$wux.xnumber.num4.value,
              refund_price: that.data.price,
              refund_reason: that.data.reason
            },
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
              message: '申请了退课',
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
              wx.showToast({
                title: '已提交退课请求！',
                icon: 'success',
                duration: 3000
              });
              wx.navigateBack({
                delta: 1
              })
            },
          })
        },
        onCancel(e) {

        },
      })
    }
  },
  price(e) {
    var that = this
    that.setData({
      price: e.detail.value
    })
  },
  reason(e) {
    var that = this
    that.setData({
      reason: e.detail.value
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
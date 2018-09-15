// confirm_order.js
var util = require('../utils/util.js')
var app = getApp()
Page({
  data: {
    total: 0,
    id: null,
    times: null,
    time: null,
    price: null,
    generate: null,
    detail: [{
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = null;
    this.setData({ id: options.id })
    this.setData({ state: app.globalData.state })
    this.$wuxToast = app.Wux().$wuxToast
    console.log(this.data.state)
    if (app.globalData.state == 1)
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
          detail: data
        })
      },
    })
    console.log(that.data.detail[0].price)
  },
  getmore: function (e) {
    console.log(e)
    var id = e.target.dataset.id
    wx.navigateTo({
      url: '../order_detail_page/order_detail?id=' + id,
    })
  },
  gettime: function () {
    var time = util.formatTime(new Date())
    console.log(time)
    this.setData({ generate: time })


  },
  get_times: function (e) {
    var that = this
    that.setData({
      times: e.detail.value
    })
    var total = that.data.price * that.data.times
    console.log(total + that.data.price + that.data.times)
    that.setData({
      total: total
    })
    console.log("times=" + that.data.times)
  },
  get_price: function (e) {
    var that = this
    that.setData({
      price: e.detail.value
    })
    var total = that.data.price * that.data.times
    console.log(total + that.data.price + that.data.times)
    that.setData({
      total: total
    })
    console.log("price=" + that.data.price)
  },
  get_time: function (e) {
    var that = this
    that.setData({
      time: e.detail.value
    })
    console.log("time=" + that.data.time)
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
  submit: function (e) {
    this.gettime()
    var that = this
    if (this.data.times == null) {
      this.showToastText('请填写课时数')
    }
    else if (this.data.price == null) {
      this.showToastText('请填写价格')
    }
    else if (this.data.time == null) {
      this.showToastText('请填写可上课时间')
    }
    else {
      wx.showLoading({
        title: '加载中',
      })

      setTimeout(function () {
        wx.hideLoading()
      }, 1500)
      wx.request({
        url: app.globalData.url + 'appoint/',
        data: {
          price: that.data.price,
          times: that.data.times,
          state: 1,
          time: that.data.time,
          generate: that.data.generate,
          comment: 'none',
          sphone_id: app.globalData.current_phone,
          tphone_id: that.data.detail[0].tphone,
          subject: that.data.detail[0].subject,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          wx.showToast({
            title: '预约成功！等待对方回应.',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../pages/one/index',
            })
            wx.navigateTo({

              url: '../main_page/main?activeIndex=1&sliderOffset=94',
            })
          }, 2000)

        },
      })
      wx.request({
        url: app.globalData.url + 'message/',
        data: {
          state: 0,
          generate: that.data.generate,
          message: '有一条新预约',
          send: app.globalData.current_phone,
          receive: that.data.detail[0].tphone
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
    }
  },
  teachersubmit: function (e) {
    this.gettime()
    var that = this
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
    wx.request({
      url: app.globalData.url + 'appoint/',
      data: {
        price: that.data.detail[0].price,
        times: that.data.detail[0].times,
        state: 0,
        time: that.data.detail[0].time,
        generate: that.data.generate,
        comment: 'none',
        tphone_id: app.globalData.current_phone,
        sphone_id: that.data.detail[0].sphone,
        subject: that.data.detail[0].subject,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        wx.showToast({
          title: '预约成功！等待对方回应.',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../pages/one/index',
          })
          wx.navigateTo({

            url: '../main_page/main?activeIndex=1&sliderOffset=94',
          })
        }, 2000)
      },
    })
    wx.request({
      url: app.globalData.url + 'message/',
      data: {
        state: 0,
        generate: that.data.generate,
        message: '有一条新预约',
        send: app.globalData.current_phone,
        receive: that.data.detail[0].sphone
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
  }

})
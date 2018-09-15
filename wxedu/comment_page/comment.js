var app = getApp()
const App = getApp()
var util = require('../utils/util.js')
Page({
  data: {
    button1: [
      {
        text: '听不懂',
        click: 0
      },
      {
        text: '负责',
        click: 0
      },
      {
        text: '态度差',
        click: 0
      },
      {
        text: '耐心',
        click: 0
      },
    ],
    button2: [
      {
        text: '很无聊',
        click: 0
      },
      {
        text: '和蔼',
        click: 0
      },
      {
        text: '幽默',
        click: 0
      },
    ],
    comment: ''
  },
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      receive: options.receive
    })
    this.setData({ id: options.id })
    this.$wuxRater = App.Wux().$wuxRater
    this.$wuxRater.init('star1', {
      value: 0,
    })
    this.$wuxRater.init('star2', {
      value: 0,
    })
    this.$wuxRater.init('star3', {
      value: 0,
    })
  },
  gettime: function () {
    var time = util.formatTime(new Date())
    console.log(time)
    this.setData({ generate: time })
  },
  button1click: function (e) {
    this.data.button1[e.target.id].click++
    if (this.data.button1[e.target.id].click % 2 == 1)
      this.setData({
        comment: this.data.comment + ' ' + this.data.button1[e.target.id].text
      })
    else {
      var del_comment = this.data.comment.replace(' ' + this.data.button1[e.target.id].text, "")
      this.setData({
        comment: del_comment
      })
    }
  },
  button2click: function (e) {
    this.data.button2[e.target.id].click++
    if (this.data.button2[e.target.id].click % 2 == 1)
      this.setData({
        comment: this.data.comment + ' ' + this.data.button2[e.target.id].text
      })
    else {
      var del_comment = this.data.comment.replace(' ' + this.data.button2[e.target.id].text, "")
      this.setData({
        comment: del_comment
      })
    }
  },
  cancel: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  get_comment: function (e) {
    var that = this
    that.setData({
      comment: e.detail.value
    })
  },
  submit: function (e) {
    var that = this
    that.gettime()
    var new_comment = this.data.$wux.rater.star1.value + " " + this.data.$wux.rater.star2.value + " " + this.data.$wux.rater.star3.value + this.data.comment
    console.log(new_comment)
    wx.request({
      url: app.globalData.url + 'commentadd/', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        id: that.data.id,
        comment: new_comment,
        generate:generate
      },
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)

      }
    })
    wx.request({
      url: App.globalData.url + 'message/',
      data: {
        state: 0,
        generate: that.data.generate,
        message: '评价了你，快去查看',
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
  }
})

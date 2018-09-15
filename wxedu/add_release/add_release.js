const App = getApp()
var util = require('../utils/util.js')
Page({
  data: { 
    detail: [{

    }],
    csname: ['000', '111', '222'],
    subject:"",
    price:0,
    time:'',
    times:'',
    disable: true,
    opacity: 0.4,
  },
  onLoad(options) {
    var that = this;
    this.$wuxPicker = App.Wux().$wuxPicker
    this.$wuxPickerCity = App.Wux().$wuxPickerCity
    this.$wuxXnumber = App.Wux().$wuxXnumber
    this.$wuxXnumber.init('num4', {
      min:0,
      step: 5,
      longpress: !0, 
      disabled: !1,
      callback: (value) => console.log(value),
    })
    this.setData({ state: App.globalData.state })
    var url=null
    console.log(this.data.state)
    if (App.globalData.state == 0)
      url = App.globalData.url + 'getteacherinf/'
    else
      url = App.globalData.url + 'getstudentinf/'
    this.setData({ url: url })
    wx.request({
      url:  url + App.globalData.current_phone , //仅为示例，并非真实的接口地址
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
    })
    wx.request({
      url: App.globalData.url+'csname/', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        that.setData({
          csname: data
        })
      },
    })
  },
  onTapDefault() {
    const that = this
    var c = that.data.csname
    that.$wuxPicker.init('default', {
      items:c,
      onChange(value, values) {
        console.log(value, values)
        that.setData({
          subject: values
        })
      },
    })
    if ((that.data.state == 0 && that.data.time != '' && that.data.subject != '') || (that.data.state == 1 && that.data.time != '' && that.data.times != '' && that.data.subject != '')) {
      that.setData({
        disable: false,
        opacity: 1,
      })
    }
    else {
      that.setData({
        disabled: true,
        opacity: 0.4
      })
    }
  },
  get_generate: function () {
    var time = util.formatTime(new Date())
    console.log(time)
    this.setData({ generate: time })
  },
  gettime(e){
    var that=this
    this.setData({
      time:e.detail.value
    })
    if ((that.data.state == 0 && that.data.time != '' && that.data.subject != '') || (that.data.state == 1 && that.data.time != '' && that.data.times != '' && that.data.subject != '')) {
      that.setData({
        disable: false,
        opacity: 1,
      })
    }
    else {
      that.setData({
        disabled: true,
        opacity: 0.4
      })
    }
  },
  gettimes(e) {
    var that=this
    this.setData({
      times: e.detail.value
    })
    if ((that.data.state == 0 && that.data.time != '' && that.data.subject != '') || (that.data.state == 1 && that.data.time != '' && that.data.times != '' && that.data.subject != '')) {
      that.setData({
        disable: false,
        opacity: 1,
      })
    }
    else {
      that.setData({
        disabled: true,
        opacity: 0.4
      })
    }
  },
  submit(e){
    var that=this
    that.get_generate()
    that.setData({
      price: that.data.$wux.xnumber.num4.value
    })
    var url=null
    if(that.data.state==0){
    url="teacheraddrelease/"
    wx.request({
      url: App.globalData.url+url, //仅为示例，并非真实的接口地址
      method: 'POST',
      data:{
        subject:that.data.subject[0],
        price:that.data.price,
        state:0,
        time:that.data.time,
        tphone_id:that.data.detail[0].tphone,
        generate:that.data.generate
      },
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        that.setData({
          csname: data
        })
      },
    })
    }
    if (that.data.state == 1){
      url = "studentaddrelease/"
      wx.request({
        url: App.globalData.url + url, //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          subject: that.data.subject[0],
          price: that.data.price,
          state: 0,
          time: that.data.time,
          sphone_id: that.data.detail[0].sphone,
          times:that.data.times,
          generate: that.data.generate

        },
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          that.setData({
            csname: data
          })
        },
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
 
})
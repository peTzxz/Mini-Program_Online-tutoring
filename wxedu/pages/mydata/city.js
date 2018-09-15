// pages/mydata/city.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    disable: true,
    opacity: 0.4,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({ state: app.globalData.state })
    that.$wuxPickerCity = app.Wux().$wuxPickerCity
  },
  onTapCity() {
    const that = this
    that.$wuxPickerCity.init('city', {
      title: '请选择所在地区',
      value: [8, 0, 11],
      onChange(value, values, displayValues) {
        console.log(value, values, displayValues)
        that.setData({
          city: displayValues,
        })
      },
    })
    if (that.data.city != '') {
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
  submit() {
    var that = this
    wx.request({
      url: app.globalData.url + 'updatecity/',
      data: {
        phone: app.globalData.current_phone,
        city: that.data.city[0] + "," + that.data.city[1] + "," + that.data.city[2],
        state: that.data.state,
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack({ delta: 1 })
        }, 1000)
      },
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
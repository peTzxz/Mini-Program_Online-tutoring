var app = getApp()
var sliderWidth = 96;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["未处理", "已处理",],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    news: [0, 0, 0,],
    readed: [1, 1, 1],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.setData({ state:app.globalData.state })
    wx.request({
      url: app.globalData.url + 'getnewmsg/',
      method: 'POST',
      data: { 
        receive: app.globalData.current_phone,
        state:that.data.state
       },
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        that.setData({ newmsg: res.data })
      }
    })
    wx.request({
      url: app.globalData.url + 'getoldmsg/',
      method: 'POST',
      data: {
        receive: app.globalData.current_phone,
        state: that.data.state
      },
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        that.setData({ oldmsg: res.data })
      }
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
    var that=this
    that.onLoad()
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
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  news_detail: function (e) {
    var that=this
    console.log(e)
    wx.request({
      url: app.globalData.url + 'readmsg/' + e.currentTarget.dataset.id,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
    })
    wx.navigateTo({
      url: './decide?id=' + e.currentTarget.dataset.id + '&generate=' + e.currentTarget.dataset.generate + '&name=' + e.currentTarget.dataset.name + '&phone=' + e.currentTarget.dataset.phone + '&message=' + e.currentTarget.dataset.message
    })
  },
  readed_detail: function (e) {
    wx.navigateTo({
      url: './decide?id=' + e.currentTarget.dataset.id + '&generate=' + e.currentTarget.dataset.generate + '&name=' + e.currentTarget.dataset.name + '&phone=' + e.currentTarget.dataset.phone + '&message=' + e.currentTarget.dataset.message
    })
  }
})
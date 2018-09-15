var app = getApp()
Page({
  data: {
    userInfo: { nickName: '登录/注册', },
    islogin: app.globalData.islogin,
    avatarUrl: '../../images/head.png',
    lv: 0,
    sc: '?',
    lvMax: '?',
    toNextLevel: '?',
    percent: 0,
    lvPic: '../../images/questionmark.png'
  },
  onLoad: function () {
    var that=this
    console.log('onLoad')
    var that = this
    if (this.data.islogin) {
      var url = null
      this.setData({ state: app.globalData.state })
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
        })
      })
      if (that.data.state == 0)
        url = app.globalData.url + 'getteacherinf/'
      else
        url = app.globalData.url + 'getstudentinf/'
      this.setData({ url: url })
      wx.request({
        url: url + app.globalData.current_phone, //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          app.globalData.logininf = data
          that.setData({
            avatarUrl: res.data[0].headImg,
            islogin: app.globalData.islogin,
            lv: res.data[0].level,
            sc: res.data[0].sc,
            lvMax: res.data[0].lvMax,
            toNextLevel: (res.data[0].lvMax - res.data[0].sc) / 100,
            percent: res.data[0].sc * 100 / res.data[0].lvMax,
            money: res.data[0].package,
            lvPic: '../../images/' + res.data[0].level + '.png'
          })
        },
      })
    }
    else {
      that.setData({
        userInfo: { nickName: '登录/注册',},
        avatarUrl: '../../images/head.png' ,
        islogin: app.globalData.islogin,
        lv: 0,
        sc: '?',
        lvMax: '?',
        toNextLevel: '?',
        percent: 0,
        lvPic: '../../images/questionmark.png'
      })
    }

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
    this.onLoad()
  },
  quit() {
    this.setData({
      islogin: false
    })
    app.globalData.islogin = false
    try {
      wx.clearStorageSync()
    } catch (e) {
      console.log('缓存清理失败')
    }
    wx.reLaunch({
      url: '../one/index',
    })
  },
  tip() {
    if (!this.data.islogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        cancelText: '返回',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击去登录')
            wx: wx.navigateTo({
              url: '../login/login',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (res.cancel) {
            console.log('用户点击返回')
          }
        }
      })
    }
  },
  login() {
    wx: wx.navigateTo({
      url: '../login/login',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onPullDownRefresh: function () {
    this.onLoad()
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
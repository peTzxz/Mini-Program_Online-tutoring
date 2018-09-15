var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0,
    userInfo: {},
    hasUserInfo: false,
    flag: true,
    disable: true,
    opacity: 0.4,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    this.setData({ money: app.globalData.logininf[0].package })
    if (that.data.money != 0) {
      this.setData({
        disable: false,
        opacity: 1,
      })
    }
    console.log(app.globalData.logininf[0].package)
    wx.login({
      success: function (loginCode) {
        var appid = 'wxa8025380403083c5'; //填写微信小程序appid
        var secret = '31fdcef72c0a34e6f66807c1453d9325'; //填写微信小程序secret
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code
        console.log(url)
        //调用request请求api转换登录凭证
        wx.request({
          url: app.globalData.url+'openid/',
          data: {
            url:url
          },
          header: { 'content-type': 'application/json' },
          method: 'POST',
          success: function (res) {
            console.log(res.data.openid)
            that.setData({
              openid: res.data.openid
            })
          }
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  enterprise_pay() {
    var that = this
    wx.showLoading({
      title: '提现中>﹏<',
      mask: true,
    })
    console.log('enterprise pay')
    console.log(that.data.openid)
    if (that.data.flag == true) {
      that.setData({ flag: false })
      wx.request({
        url: app.globalData.url + 'enterprisepay/',
        method: 'POST',
        data: {
          total_fee: that.data.money,   /*订单金额*/
          openid: that.data.openid,
          phone: app.globalData.current_phone
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.data.return_code == "SUCCESS" && res.data.result_code == "SUCCESS") {
            that.setData({ money: 0 })
            app.globalData.logininf[0].package = 0
            console.log("提现成功")
            that.setData({
              disable:true,
              opacity: 0.4,
            })
            wx.showToast({
              title: '提现成功',
              icon: '',
              image: '',
              duration: 1000,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        },
        fail: function (err) {
          console.log(err)
        }
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
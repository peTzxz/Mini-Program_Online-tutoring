function IsTel(s) {
  if (s != null) {
    var length = s.length;
    if (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(s)) {
      return true;
    } else {
      return false;
    }
  }
}
var app = getApp()
Page({
  data: {
    userInfo: {
      avatarUrl: '../../images/head.png'
    },
    state: 0,
    islogin: null,
    time: null,
    disable: true,
    phone: '',
    psw: '',
    opacity: 0.4,
    userInfo: { avatarUrl: '../../images/head.png' }
  },
  onLoad: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
      })
    })
  },

  gettime: function () {
    var time = util.formatTime(new Date())
    console.log(time)


  },
  getphone(e) {
    var that = this
    var isTel = IsTel(e.detail.value)
    that.setData({
      phone: e.detail.value
    })
    if (isTel && that.data.psw != '') {
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
  password(e) {
    var that = this
    var isTel = IsTel(that.data.phone)
    that.setData({
      psw: e.detail.value
    })
    if (isTel && that.data.psw != '') {
      that.setData({
        disable: false,
        opacity: 1,
      })
    } else {
      that.setData({
        disabled: true,
        opacity: 0.4
      })
    }
  },
  userlogin: function () {
    var that = this
    console.log(app.globalData.islogin)
    console.log(that.data.islogin)
    if (that.data.islogin == 'True') {
      wx.hideLoading()
      app.globalData.islogin = true
      app.globalData.state = that.data.state
      app.globalData.current_phone = that.data.phone
      app.globalData.base = that.data.state == 0 ? 1 : 0
      that.openToast()
      setTimeout(function () {
        wx.reLaunch({
          url: '../one/index',
        })
      }, 2000)
      try {
        wx.setStorageSync('current_phone', that.data.phone)
        wx.setStorageSync('state', that.data.state)
        wx.setStorageSync('base', that.data.state == 0 ? 1 : 0)
        console.log('缓存成功')
        console.log(wx.getStorageSync('current_phone'))
      } catch (e) {
        console.log('缓存失败')
      }
      
    }
    else
      this.openAlert()
  },
  login: function (event) {
    var that = this
    wx.showLoading({
      title: '登录中>﹏<',
      mask: true,
    })
    wx.request({
      url: app.globalData.url + 'login/',
      data: {
        phone: that.data.phone,
        password: that.data.psw,
        state: that.data.state,
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        that.setData({
          islogin: res.data,
        })
        that.userlogin()

      },

      fail: function (res) { },
      complete: function (res) { },
    })


  },
  openAlert: function () {
    wx.showToast({
      title: '用户名密码错误',
      image: '../../images/no.png',
      duration: 3000
    })
  },
  openToast: function () {
    wx.showToast({
      title: '登录成功！',
      icon: 'success',
      duration: 2000
    });
  },
  register() {
    wx.navigateTo({
      url: '../../register/register',
    })
  },
  opengender: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['教员', '学生'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0)
            that.setData({ state: '0' })
          if (res.tapIndex == 1)
            that.setData({ state: '1' })
        }
      }
    });
  },
})
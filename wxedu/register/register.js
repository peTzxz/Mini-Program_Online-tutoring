var Bmob = require('../utils/bmob.js');
var common = require('../utils/common.js');
const app = getApp()
//手机号正则表达式
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
Page({
  data: {
    state: 0,
    code: '',//验证码
    phone: '',//手机号
    p1: '',//密码1
    p2: '',//密码2
    send: 0,
    disable: true,
    loading: false,
    opacity: 0.4,
    userInfo: { avatarUrl: '../images/head.png' }
  },
  onLoad(options) {
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
      })
    })
    console.log(options)
    this.setData({
      login: options.login,
    })
    that.$wuxCountDown = app.Wux().$wuxCountDown
    that.c3 = that.$wuxCountDown({
      date: +(new Date) + 60000 * 20,
      render(date) {
        const min = this.leadingZeros(date.min, 2) + ' 分 '
        const sec = this.leadingZeros(date.sec, 2) + ' 秒 '

        that.setData({
          c3: min + sec,
        })
      },
    })
  },
  vcode() {
    var that = this
    console.log(that.data.phone)
    if (this.data.send == 0)
      that.sendSms()
    this.setData({ send: 1 })

    if (that.c2 && that.c2.interval) return !1
    that.c2 = that.$wuxCountDown({
      date: +(new Date) + 60000,
      onEnd() {
        that.setData({
          c2: '重新获取',
          send: 0,
        })
      },
      render(date) {
        const sec = this.leadingZeros(date.sec, 2) + 's'
        date.sec !== 0 && that.setData({
          c2: sec,
        })
      },
    })
  },
  sendSms: function () {
    var that = this
    var phone = that.data.phone;
    console.log(phone)
    Bmob.Sms.requestSmsCode({ "mobilePhoneNumber": phone }).then(function (obj) {
      that.setData({
        phone: phone
      })
      common.showTip('发送成功');

    },
      function (err) {
        common.showTip('发送失败');
      });

  },
  verifySmsCode: function () {
    var that = this
    var phone = this.data.phone;
    var verifyCode = that.data.code;
    if (phone == '') {
      common.showTip('请发送短信后再验证');
      return false;
    } else if (verifyCode == '') {
      common.showTip('请输入验证码');
      return false;
    }
    console.log(verifyCode)
    Bmob.Sms.verifySmsCode(phone, verifyCode).then(function (obj) {
      //common.showTip('验证成功' + "smsId:" + obj.msg);
      that.setData({
        verifySmsCode: true
      })
      console.log("发起请求" + app.globalData.url + 'register/')
      wx: wx.request({
        url: app.globalData.url + 'register/',
        data: {
          phone: that.data.phone,
          state: that.data.state,
          password: that.data.p1,
          headImg: that.data.userInfo.avatarUrl == '' ? 'noHead' : that.data.userInfo.avatarUrl
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data == 'True') {
            wx.hideLoading()
            app.globalData.islogin = true
            app.globalData.state = that.data.state
            app.globalData.current_phone = that.data.phone
            app.globalData.base = that.data.state == 0 ? 1 : 0
            try {
              wx.setStorageSync('current_phone', that.data.phone)
              wx.setStorageSync('state', that.data.state)
              wx.setStorageSync('base', that.data.state == 0 ? 1 : 0)
              console.log('缓存成功')
              console.log(wx.getStorageSync('current_phone'))
            } catch (e) {
              console.log('缓存失败')
            }
            wx.showModal({
              title: '注册成功！',
              content: '快去填写你的基本资料吧',
              showCancel: true,
              cancelText: '残忍拒绝',
              cancelColor: 'black',
              confirmText: '好的',
              confirmColor: 'black',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../one/index',
                    })
                    wx.navigateTo({
                      url: '../pages/mydata/mydata',
                    })
                  }, 1000)
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../one/index',
                    })
                  }, 1000)
                }
              },
            })

          }
          else {
            wx.showToast({
              title: '注册失败！',
              icon: 'fail',
              duration: 1000
            });
          }
        }
      })
    }, function (err) {
      common.showTip('验证失败' + err);
      that.setData({
        verifySmsCode: false
      })
    });
  },



  getphone(e) {
    var that = this
    var isTel = IsTel(e.detail.value)
    that.setData({
      phone: e.detail.value
    })
    if (isTel && that.data.p1 != '' && that.data.p2 != '' && that.data.code != '') {
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
  getcode(e) {
    var that = this
    var isTel = IsTel(that.data.phone)
    this.setData({
      code: e.detail.value
    })
    if (isTel && that.data.p1 != '' && that.data.p2 != '' && that.data.code != '') {
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
  p1(e) {
    var that = this
    var isTel = IsTel(that.data.phone)
    that.setData({
      p1: e.detail.value
    })
    if (isTel && that.data.p1 != '' && that.data.p2 != '' && that.data.code != '') {
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
  p2(e) {
    var that = this
    var isTel = IsTel(that.data.phone)
    this.setData({
      p2: e.detail.value
    })
    if (isTel && that.data.p1 != '' && that.data.p2 != '' && that.data.code != '') {
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
  back: function () {
    wx.navigateBack({ delta: 1 })
  },
  submit() {
    var that = this
    that.setData({
      loading: true,
      disabled: true,
      opacity: 0.4
    })
    wx.showLoading({
      title: '注册中>﹏<',
      mask: true,
    })
    if (that.data.p1 == that.data.p2) {
      console.log("======post======")
      that.verifySmsCode()
    }
    else {
      console.log("======wrong======")
      wx.showToast({
        title: '密码不一致',
        image: '../images/no.png',
        duration: 2000
      })
    }
    that.setData({
      loading: false,
      disable: false,
      opacity: 1,
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
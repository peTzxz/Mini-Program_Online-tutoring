var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
const app = getApp()
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

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    state: 0,
    code: '',//验证码
    phone: '',//手机号
    p1: '',//密码1
    p2: '',//密码2
    send: 0,
    disable: true,
    opacity: 0.4,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      login: options.login
    })
    const that = this
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
  verifySmsCode: function () {
    var that = this
    var phone = this.data.phone;
    var verifyCode = that.data.code;
    if (!phone) {
      common.showTip('请发送短信后再验证');
      return false;
    } else if (!verifyCode) {
      common.showTip('请输入验证码');
      return false;
    }
    console.log(verifyCode)
    Bmob.Sms.verifySmsCode(phone, verifyCode).then(function (obj) {
      //common.showTip('验证成功' + "smsId:" + obj.msg);
      that.setData({
        verifySmsCode: true
      })
      wx: wx.request({
        url: app.globalData.url + 'forgetpsd/',
        data: {
          phone: that.data.phone,
          //state: that.data.state,
          password: that.data.p1
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success: function (res) {
          console.log(res)
          that.setData({ returnmsg: res.data })
          if (!that.data.returnmsg) {
            wx.showToast({
              title: '修改失败！用户名不存在!',
              icon: '../../images/no.png',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: '修改成功！',
              icon: 'success',
              duration: 1000
            });
            setTimeout(function () {
              wx.reLaunch({
                url: '../one/index',
              })
            }, 1000)
          }
        }
      })
    }, function (err) {
      //common.showTip('验证失败' + err);
      that.setData({
        verifySmsCode: false
      })
      wx.showToast({
        title: '验证码错误',
        image: '../../images/no.png',
        duration: 2000
      })
    });
  },
  submit() {
    var that = this
    //that.setData({ verifySmsCode: true })
      if (that.data.p1 == that.data.p2) {
        console.log("======success======")
        that.verifySmsCode()
      } else {
        console.log("======wrong======")
        wx.showToast({
          title: '密码不一致！',
          icon: '../../images/no.png',
          duration: 2000
        })
      }

    
  },
  userlogin: function () {
    var that = this
    console.log(app.globalData.islogin)
    //that.setData({islogin:app.globalData.islogin})
    console.log(that.data.islogin)
    if (that.data.islogin == 'True') {
      app.globalData.islogin = true
      app.globalData.state = that.data.state
      that.openToast()
      setTimeout(function () {
        wx.reLaunch({
          url: '../one/index',
        })
      }, 1000)
    }
    else
      this.openAlert()
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
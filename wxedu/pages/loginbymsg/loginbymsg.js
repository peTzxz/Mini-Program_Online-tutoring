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
    code:'',
    disable:true,
    opacity: 0.4,
    send:0,
    state:0,
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
        common.showTip('发送失败'+err);
        console.log('发送失败' + err);
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
    if (phone=='') {
      common.showTip('请发送短信后再验证');
      return false;
    } else if (verifyCode=='') {
      common.showTip('请输入验证码');
      return false;
    }
    console.log(verifyCode)
    Bmob.Sms.verifySmsCode(phone, verifyCode).then(function (obj) {
      that.setData({
        verifySmsCode: true
      })
      wx: wx.request({
        url: app.globalData.url + 'loginbymsg/',
        data: {
          phone: that.data.phone,
          state: that.data.state,
          //password: that.data.p1
        },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success: function (res) {
          console.log(res)
          that.setData({ returnmsg: res.data })
          if (that.data.returnmsg) {
            wx.showToast({
              title: '登录成功！',
              icon: 'success',
              duration: 1000
            });
            app.globalData.current_phone = that.data.phone
            app.globalData.islogin = true
            app.globalData.state = that.data.state
            setTimeout(function () {
              wx.reLaunch({
                url: '../one/index',
              })
            }, 1000)
          } else {
            that.setData({ state: res.data })
            wx.showToast({
              title: '登录失败！',
              icon: '../../images/no.png',
              duration: 1000
            });
            
          }
        }
      })
    }, function (err) {
      console.log('验证失败' + err);
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
  login() {
    var that = this
    //that.setData({ verifySmsCode:true})
    that.verifySmsCode()
  },
  opengender: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['教员', '学生'],
      success: function (res) {

        //  that.setData({gender:'女'});
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
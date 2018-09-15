//app.js
var Bmob = require('utils/bmob.js')
var amapFile = require('libs/amap-wx.js');
Bmob.initialize("584b6047c4a9295e8c4e313560355e79", "d77bb60ef10470066e39fa42e16d4535");
Object.assign = Object.assign && typeof Object.assign === 'function' ? Object.assign : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key] } } } return target }
Array.from = Array.from && typeof Array.from === 'function' ? Array.from : obj => [].slice.call(obj)

import Wux from 'components/wux'
import WxValidate from 'assets/plugins/WxValidate'


App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    try {
      var current_phone = wx.getStorageSync('current_phone')
      var state = wx.getStorageSync('state')
      var base = wx.getStorageSync('base')
      if (current_phone) {
        this.globalData.current_phone = current_phone
        this.globalData.state=state
        this.globalData.base = base
        this.globalData.islogin=true
      }
    } catch (e) {
      console.log('获取失败')
    }
   
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  }, postInfo: function () {
    var that = this;
    var role;
    wx.request({
      url: that.globalData.posturl[1], //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

      }
    })
  }, 
  globalData: {
    city: "未知",
    district: "未知",
    provincecode: null,
    citycode: null,
    userInfo: null,
    logininf: null,
    state: 1,//判断教员和学员的标记  0:教员 1:学生
    current_phone: null,//用户登录手机号
    islogin: false,//是否登录判断
    url: "https://www.weixinjiajiao.cn/",
    posturl: ['https://www.weixinjiajiao.cn/registeredstudents/',
      'https://www.weixinjiajiao.cn/grade/', 'https://www.weixinjiajiao.cn/registeredteachers/'],
    // url: "http://115.159.214.117/",
    // posturl: ['http://115.159.214.117//registeredstudents/',
    //   'http://115.159.214.117/grade/', 'http://115.159.214.117/registeredteachers/'],
    base: 0,//0:教员库,1:学员库  
    hotSubjectCid: 0,
    hotSubjectCsid: 0,
    hotSubjectCsindex: 0,
    hotSubjectCsname: '全部'
  },
  Wux: Wux,
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
})
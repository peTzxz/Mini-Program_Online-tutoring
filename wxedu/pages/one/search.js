var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp()
Page({
  data: {
    open: false,
    open: false,
    hidden: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: '',
  },


  onLoad: function () {
    var that = this

    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['初中语文', '高中数学', '高中英语', '小学英语', '初中数学', '小学数学']);
    WxSearch.initMindKeys(['艺术', '高中英语', '高中数学', '高中语文', '初中英语', '初中语文', '初中数学', '小学英语', '小学语文', '小学数学', '学前文学', '学前数学']);

  },

  wxSearchFn: function (e) {
    var that = this
    if (that.data.wxSearchData.value) {
      wx.request({
        url: app.globalData.url + 'searchsubject/', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          csname: that.data.wxSearchData.value
        },
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(res.data)
          that.setData({
            searchSubject: data
          })
          if (res.data[0] != null) {

            app.globalData.hotSubjectCid = that.data.searchSubject[0].cid.cid
            app.globalData.hotSubjectCsid = that.data.searchSubject[0].csid
            app.globalData.hotSubjectCsname = that.data.searchSubject[0].csname
            wx.switchTab({
              url: '../service/service'
            })
            wx.showToast({
              title: '正在努力加载=~=',
              image: '../../images/has.png',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '无匹配数据',
              image: '../../images/no.png',
              duration: 2000
            })
          }
        }
      })
    }
    WxSearch.wxSearchAddHisKey(that);

  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
    that.setData({ value: e.detail.value })
    console.log(this.data.value)
  },
  wxSerchFocus: function (e) {
    var that = this
    that.setData({
      hidden: true
    })
    WxSearch.wxSearchFocus(e, that);

  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
    that.setData({
      hidden: false
    })
  },
})
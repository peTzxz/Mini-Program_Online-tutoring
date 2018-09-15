var city = require('../utils/city.js');
import data from 'data'
const raw = data
var app = getApp()
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "未知",
    onChooseArea: 0,
    hotcityList: [{ cityCode: 110000, city: '北京市', provincecode: 110000 }, { cityCode: 310000, city: '上海市', provincecode: 310000 }, { cityCode: 440100, city: '广州市', provincecode: 440000 }, { cityCode: 440300, city: '深圳市', provincecode: 440000 }, { cityCode: 330100, city: '杭州市', provincecode: 330000 }, { cityCode: 320100, city: '南京市', provincecode: 320000 }, { cityCode: 420100, city: '武汉市', provincecode: 420000 }, { cityCode: 320500, city: '苏州市', provincecode: 320000 }, { cityCode: 120000, city: '天津市', provincecode: 120000 }, { cityCode: 610100, city: '西安市', provincecode: 610000 }, { cityCode: 510100, city: '成都市', provincecode: 510000 }, { cityCode: 500000, city: '重庆市', provincecode: 500000 }]
  },
  onLoad: function (e) {
    // 生命周期函数--监听页面加载
    this.setData({
      city: app.globalData.city,
      cityCode: app.globalData.citycode,
      provincecode: app.globalData.provincecode,
    })
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })
    var subArea = this.getArea(this.data.provincecode, this.data.cityCode)
    this.setData({
      subArea: subArea,
      onChooseArea: 1
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function (e) {
    console.log("bindCity")
    this.setData({
      city: e.currentTarget.dataset.city,
      provincecode: e.currentTarget.dataset.provincecode,
      cityCode: e.currentTarget.dataset.citycode,
      scrollTop: 0,
    })

    app.globalData.city = this.data.city
    app.globalData.provincecode = this.data.provincecode
    app.globalData.citycode = this.data.cityCode
    var subArea = this.getArea(this.data.provincecode, this.data.cityCode)
    this.setData({
      district: subArea[0].name,
    })
    app.globalData.district = subArea[0].name
    this.setData({
      subArea: subArea,
      onChooseArea: 1
    })
  },
  //选择热门城市
  bindHotCity: function (e) {
    console.log("bindHotCity")
    this.setData({
      city: e.currentTarget.dataset.city,
      provincecode: e.currentTarget.dataset.provincecode,
      cityCode: e.currentTarget.dataset.citycode,
    })
    app.globalData.city = this.data.city
    app.globalData.provincecode = this.data.provincecode
    app.globalData.citycode = this.data.cityCode
    var subArea = this.getArea(this.data.provincecode, this.data.cityCode)
    this.setData({
      district: subArea[0].name,
    })
    app.globalData.district = subArea[0].name
    this.setData({
      subArea: subArea,
      onChooseArea: 1
    })
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },
  chooseArea() {
    this.setData({
      onChooseArea: 1
    })
  },
  chooseAreaHidden() {
    this.setData({
      onChooseArea: 0,
    })
  },
  getArea: function (provincecode, currentCityCode) {
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].code == provincecode) {
        console.log('matchprovincecode')
        for (var j = 0; j < raw[i].sub.length; j++) {
          if (raw[i].sub[j].code == currentCityCode) {
            console.log(raw[i].sub[j].sub)
            return raw[i].sub[j].sub
          }
        }
      }
    }
  },
  setArea: function (e) {
    this.setData({
      district: e.currentTarget.dataset.district,
    })
    app.globalData.district = e.currentTarget.dataset.district
    wx.navigateBack({
      delta: 1
    })
  }
})
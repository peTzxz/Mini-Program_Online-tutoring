// pages/mydata/grade.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { grade: '本科', value: '0', checked: false },
      { grade: '硕士', value: '1', checked: false },
      { grade: '博士', value: '2', checked: false },
    ],
    disable: true,
    opacity: 0.4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      disable: false,
      opacity: 1
    });
  },
  submit() {
    var that = this
    var radioItems = that.data.radioItems
    var grade=''
    for (var i = 0; i < radioItems.length;i++){
      if (radioItems[i].checked){
        grade = radioItems[i].grade
        console.log('grade='+grade)
        break
      }
    }
    wx.request({
      url: app.globalData.url + 'updatetgrade/',
      data: {
        phone: app.globalData.current_phone,
        grade:grade,
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack({ delta: 1 })
        }, 1000)
      },
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
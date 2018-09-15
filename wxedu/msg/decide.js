var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options)
    this.setData({
      id:options.id,
      generate:options.generate,
      name:options.name,
      phone: options.phone,
      message: options.message
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
    
  },
  confirm:function(){
    var that=this
    if(app.globalData.state==0){
    wx.request({
      url: app.globalData.url + 'confirmmsg/',
      method: 'POST',
      data: {
        receive: app.globalData.current_phone,
        generate: that.data.generate,

      },
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) { }
    })
    wx.navigateBack({
      delta:1
    })
    wx.redirectTo({
    
      url: './msg',
    })



    }
     if (app.globalData.state == 1){

       wx.request({
         url: app.globalData.url + 'confirmmsg1/',
         method: 'POST',
         data: {
           send: app.globalData.current_phone,
           generate: that.data.generate,

         },
         header: {
           "Content-Type": "application/json"
         },
         dataType: 'json',
         success: function (res) { }
       })
       wx.reLaunch({

         url: '../pages/one/index',
       })
     }
  
  
  }
  
  
  
  ,
  cancel:function(){

  }
})
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newlist:null,
    cindex: 0,  //一级城市索引
    cid: null,  //一级城市id
    csindex: 0,  //二级城市索引
    csid: 4, //二级城市id
    csname: null,
  },

  onLoad: function (e) {
    this.$wuxDialog = App.Wux().$wuxDialog
    var that=this
    this.$wuxPrompt = App.Wux().$wuxPrompt
    this.$wuxPrompt.init('msg1', {
      title: '空空如也',
      text: '暂时没有相关数据',
    }).show()
    var url=null
    this.setData({state:App.globalData.state})
    console.log(that.data.state)
    if(that.data.state==0)
      url ='getteacherrelease/'
    if(that.data.state==1)
      url ='getstudentrelease/'
    wx.request({
      url: App.globalData.url+url+App.globalData.current_phone , //仅为示例，并非真实的接口地址
      method: 'GET',

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({ newlist: res.data})
        console.log(that.data.newlist)
      }
    })  
  },

  confirm(event) {
    var that=this
    console.log(event)
    var id=event.currentTarget.dataset.id
    this.$wuxDialog.confirm({
      title: '删除',
      content: '你确定要删除这条发布吗？',
      onConfirm(e) {
        wx.request({
          url: App.globalData.url +'deletereleasebyid/' , //仅为示例，并非真实的接口地址
          method: 'POST',
          data:{id:id},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
          }
        })  
        wx.showToast({
          title: '删除成功！',
          icon: 'success',
          duration: 3000
        });
      that.onLoad()
      
      
      },
      onCancel(e) {
        
      },
    })
  },
  add:function(e){
    console.log (App.globalData.logininf[0])
    if(App.globalData.logininf[0].name=="未填写"||App.globalData.logininf[0].grade=="未填写"||App.globalData.logininf[0].address=="未填写"){
      wx.showModal({
        title: '提示',
        content: '请先填写个人信息（务必认真填写）',
        confirmText: '去填写',
        cancelText: '返回',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击去登录')
            wx: wx.navigateTo({
              url: '../pages/mydata/mydata',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (res.cancel) {
            console.log('用户点击返回')
          }
        }
      })
      }else{
      wx.navigateTo({
        url: '../add_release/add_release',
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
    this.onLoad()
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
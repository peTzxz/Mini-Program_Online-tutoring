var app = getApp()
Page({
  data: {
    userInfo: [],
    logo: '../../images/head.png',
  },
  onLoad: function () {
    var that = this
    that.$wuxPickerCity = app.Wux().$wuxPickerCity
    var url = null
    this.setData({ state: app.globalData.state })
    console.log(this.data.state)
    if (that.data.state == 0)
      url = app.globalData.url + 'getteacherinf/'
    else
      url = app.globalData.url + 'getstudentinf/'
    this.setData({ url: url })
    wx.request({
      url: url + app.globalData.current_phone, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data)
        app.globalData.logininf = data
        that.setData({
          userInfo: data,
          logo: res.data[0].headImg
        })
      },
    })
  },
  opengrade_s: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['学前', '小学', '初中', '高中'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0)
            that.setData({ grade: '学前' })
          if (res.tapIndex == 1)
            that.setData({ grade: '小学' })
          if (res.tapIndex == 2)
            that.setData({ grade: '初中' })
          if (res.tapIndex == 3)
            that.setData({ grade: '高中' })
        }
      }
    });
  },
  opengrade_t: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['大专', '本科', '硕士', '博士'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0)
            that.setData({ grade: '大专' })
          if (res.tapIndex == 1)
            that.setData({ grade: '本科' })
          if (res.tapIndex == 2)
            that.setData({ grade: '硕士' })
          if (res.tapIndex == 3)
            that.setData({ grade: '博士' })
        }
      }
    });
  },
  changePhone(){
   wx.showToast({
     title: '不可修改',
     image:'../../images/cry.png'
   })
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          }
          else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        wx.uploadFile({
          url: app.globalData.url + 'timage/',
          filePath: res.tempFilePaths[0],
          name: 'avatar',
          // header: {}, // 设置请求的 header
          formData: { tphone: app.globalData.current_phone }, // HTTP 请求中其他额外的 form data
          success: function (info) {
            _this.setData({
              logo: res.tempFilePaths[0]
            })
          }
        })

      }
    })
  },
  prompt_character() {
    var that = this
    if (that.data.userInfo[0].character == '未进行') {
      wx.navigateTo({
        url: '../../question/question',
      })
    }
    else {
      wx.navigateTo({
        url: '../../question/result?character=' + that.data.userInfo[0].character,
      })
    }
  },
  onShow: function () {
    this.onLoad()
  },

});
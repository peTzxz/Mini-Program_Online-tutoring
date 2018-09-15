var WxSearch = require('../../wxSearch/wxSearch.js')
var amapFile = require('../../libs/amap-wx.js');
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    open: false,
    islogin: false,
    open: false,
    hidden: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: '',
    newmsg: [],
    imgUrls: [
      './jiajiao1.jpg',
      './jiajiao2.jpg',
      './jiajiao3.jpg'
    ],
    subjectIcon: [],
    teacherIcon: [],
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../mypage/mypage'
    })
  },
 
  onLoad: function () {
    var that = this
    console.log('onLoad')
    wx.request({
      url: app.globalData.url + 'gethotsubject/', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        that.setData({ subjectIcon:res.data })
      }
    })
    wx.request({
      url: app.globalData.url + 'gethotteacher/', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        that.setData({ teacherIcon: res.data })
      }
    })
    app.postInfo(function () {
    })

    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['初中语文', '高中数学', '高中英语', '小学英语', '初中数学', '小学数学']);
    WxSearch.initMindKeys(['艺术', '高中英语', '高中数学', '高中语文', '初中英语', '初中语文', '初中数学', '小学英语', '小学语文', '小学数学', '学前文学', '学前数学']);
    var islogin = app.globalData.islogin
    console.log(app.globalData.islogin)
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo, islogin: islogin
      })
    })
    if (app.globalData.islogin == true) {
      var that = this;
      var url = null
      this.setData({ state: app.globalData.state })
      console.log(this.data.state)
      if (that.data.state == 0)
        url = app.globalData.url + 'getteacherinf/'
      else
        url = app.globalData.url + 'getstudentinf/'
      this.setData({ url: url })
      if (that.data.state == 1) {
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
              name: app.globalData.logininf[0].name,
              sphone: app.globalData.current_phone,
              grade: app.globalData.logininf[0].grade,
              gender: app.globalData.logininf[0].gender,
              introduction: app.globalData.logininf[0].introduction,
              address: app.globalData.logininf[0].address,
              city: app.globalData.logininf[0].city,
              logo: app.globalData.logininf[0].headImg
            })
          },
        })
      }
      if (app.globalData.state == 0) {
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
              name: app.globalData.logininf[0].name,
              tphone: app.globalData.current_phone,
              grade: app.globalData.logininf[0].grade,
              education: app.globalData.logininf[0].education,
              gender: app.globalData.logininf[0].gender,
              introduction: app.globalData.logininf[0].introduction,
              major: app.globalData.logininf[0].major,
              city: app.globalData.logininf[0].city,
              logo: app.globalData.logininf[0].headImg,
              package:app.globalData.logininf[0].package,
            })
          },
        })

      }
      wx.request({
        url: app.globalData.url + 'getnewmsg/',
        method: 'POST',
        data: {
          receive: app.globalData.current_phone,
          state: app.globalData.state
        },
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          console.log(res.data)
          that.setData({ newmsg: res.data })
        }
      })
    }
    //定位
    if (app.globalData.city == "未知") {
      var myAmapFun = new amapFile.AMapWX({ key: '1f24733b3fa9e94d06bd1af26899f8ec' });
      myAmapFun.getRegeo({
        success: function (data) {
          console.log(data)
          that.setData({
            city: data[0].regeocodeData.addressComponent.city
          })
          app.globalData.city = data[0].regeocodeData.addressComponent.city
          app.globalData.district = data[0].regeocodeData.addressComponent.district
          app.globalData.provincecode = data[0].regeocodeData.addressComponent.adcode.slice(0,2)+'0000'
          app.globalData.citycode = data[0].regeocodeData.addressComponent.adcode.slice(0, 4) + '00'
          //成功回调
        },
        fail: function (info) {
          //失败回调
          console.log(info)
        }
      })
    }
  },
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      this.data.open = false;
    } else {
      this.setData({
        translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
      })
      this.data.open = true;
    }
  },
  tap_start: function (e) {
    this.setData({ flag: 0 })

    this.data.mark = this.data.newmark = e.touches[0].pageX;
    if (this.data.staus == 1) {
      // staus = 1指默认状态
      this.data.startmark = e.touches[0].pageX;
    } else {
      // staus = 2指屏幕滑动到右边的状态
      this.data.startmark = e.touches[0].pageX;
    }
  },
  tap_drag: function (e) {
    this.setData({ flag: 1 })
    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;
    if (this.data.mark < this.data.newmark) {
      if (this.data.staus == 1) {
        if (this.data.windowWidth * 0.75 > Math.abs(this.data.newmark - this.data.startmark)) {
          this.setData({
            translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
          })
        }
      }

    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      if (this.data.staus == 1 && (this.data.newmark - this.data.startmark) > 0) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
        })
      } else if (this.data.staus == 2 && this.data.startmark - this.data.newmark < this.data.windowWidth * 0.75) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark + this.data.windowWidth * 0.75 - this.data.startmark) + 'px)'
        })
      }

    }

    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {
    if (this.data.flag == 1) {
      if (this.data.staus == 1 && this.data.startmark < this.data.newmark) {
        if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
          this.setData({
            translate: 'transform: translateX(0px)'
          })
          this.data.staus = 1;
        } else {
          this.setData({
            translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
          })
          this.data.staus = 2;
        }
      } else {
        if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
          this.setData({
            translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
          })
          this.data.staus = 2;
        } else {
          this.setData({
            translate: 'transform: translateX(0px)'
          })
          this.data.staus = 1;
        }
      }

      this.data.mark = 0;
      this.data.newmark = 0;
    }
  },
  wxSearchFn: function (e) {
    var that = this
    if (that.data.wxSearchData.value){
    wx.request({
      url: app.globalData.url + 'searchsubject/', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        csname:that.data.wxSearchData.value
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
        if(res.data[0]!=null){
          
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
        }else{
          wx.showToast({
            title: '无匹配数据',
            image:'../../images/no.png',
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
    wx.navigateTo({
      url: './search',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })


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
  goToSuject(e) {

    app.globalData.hotSubjectCid = e.target.dataset.cid
    app.globalData.hotSubjectCsid = e.target.dataset.csid
    app.globalData.hotSubjectCsname = e.target.dataset.name
    app.globalData.hotSubjectCsindex = 2
    console.log(app.globalData.hotSuject)
    wx.switchTab({
      url: '../service/service'
    })

  },
  goToTeacher(e) {
    wx.navigateTo({
      url: '../../recommend_teacher/recommend_teacher?tphone=' + this.data.teacherIcon[e.target.dataset.index].tphone,
    })
  },
  quit() {
    this.setData({
      islogin: false
    })
    try {
      wx.clearStorageSync()
    } catch (e) {
      console.log('缓存清理失败')
    }
    app.globalData.islogin = false
    wx.reLaunch({
      url: './index',
    })
  },
  onPullDownRefresh: function () {
    this.onLoad()
  },
  onShow: function () {
    // this.onLoad()
  },
  gomessage() {
    wx.navigateTo({
      url: "../../msg/msg",
    })
  },
  gomydata() {
    wx.navigateTo({
      url: "../mydata/mydata",
    })
  },
  goclass() {
    wx.navigateTo({
      url: "../../main_page/main",
    })
  },
  gorelease() {
    wx.navigateTo({
      url: "../../myrealease/release",
    })
  }
})
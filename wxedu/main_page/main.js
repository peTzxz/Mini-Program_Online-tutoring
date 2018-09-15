var app = getApp()
var sliderWidth = 96// 需要设置slider的宽度，用于计算中间位置
var util = require('../utils/util.js')
Page({
  data: {
    tabs: ["预约中", "待回复", "进行中", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    getorder: [
    ],
  },

  onLoad: function (options) {
    var that = this;
    this.$wuxDialog = app.Wux().$wuxDialog
    this.$wuxPrompt = app.Wux().$wuxPrompt
    this.$wuxPrompt.init('msg1', {
      title: '空空如也',
      text: '暂时没有相关数据',
    }).show()

    this.$wuxPrompt.init('msg2', {
      icon: '../assets/images/iconfont-order.png',
      title: '您还没有相关的课程',
      text: '可以去看看有哪些想学',
      buttons: [
        {
          text: '随便逛逛'
        }
      ],
      buttonClicked(index, item) {
        wx.switchTab({
          url: '/pages/service/service',
        })
      },
    }).show()

    this.$wuxPrompt.init('msg3', {
      icon: '../assets/images/iconfont-empty.png',
      title: '暂无待评价课程',
    }).show()
    this.setData({ state: app.globalData.state })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    wx.login({
      success: function (loginCode) {
        var appid = 'wxa8025380403083c5'; //填写微信小程序appid
        var secret = '31fdcef72c0a34e6f66807c1453d9325'; //填写微信小程序secret
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code
        console.log(url)
        //调用request请求api转换登录凭证
        wx.request({
          url: app.globalData.url + 'openid/',
          data: {
            url: url
          },
          header: { 'content-type': 'application/json' },
          method: 'POST',
          success: function (res) {
            console.log(res.data.openid)
            that.setData({
              openid: res.data.openid
            })
          }
        })
      }
    })
    if (app.globalData.state == 0) {
      wx.request({
        url: app.globalData.url + 'getsappoint/' + app.globalData.current_phone + '/0', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          that.setData({
            getordering: data
          })
          console.log(that.data.getorder)
        }
      })
      wx.request({
        url: app.globalData.url + 'getsappoint/' + app.globalData.current_phone + '/1', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          that.setData({
            res: data
          })
          console.log(that.data.getordered)
        }
      })
      wx.request({
        url: app.globalData.url + 'getsappoint/' + app.globalData.current_phone + '/2', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          that.setData({
            getordered: data
          })
          console.log(that.data.getordered)
        }
      })
      wx.request({
        url: app.globalData.url + 'getsappoint/' + app.globalData.current_phone + '/3', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          that.setData({
            getorderfinished: data
          })
          console.log(that.data.getordered)
        }
      })
    }
    if (app.globalData.state == 1) {
      wx.request({
        url: app.globalData.url + 'gettappoint/' + app.globalData.current_phone + '/1', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          that.setData({
            getordering: data
          })
          console.log(that.data.getorder)
        }
      })
      wx.request({
        url: app.globalData.url + 'gettappoint/' + app.globalData.current_phone + '/0', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          that.setData({
            res: data
          })
          console.log(that.data.getordered)
        }
      })
      wx.request({
        url: app.globalData.url + 'gettappoint/' + app.globalData.current_phone + '/2', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          that.setData({
            getordered: data
          })
          console.log(that.data.getordered)
        }
      })
      wx.request({
        url: app.globalData.url + 'gettappoint/' + app.globalData.current_phone + '/3', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          var data = res.data;
          console.log(data)
          that.setData({
            getorderfinished: data
          })
          console.log(that.data.getordered)
        }
      })
    }
    console.log(that.data.getorder)
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  gettime: function () {
    var time = util.formatTime(new Date())
    console.log(time)
    this.setData({ generate: time })
  },
  accept(event) {
    var that = this
    console.log(event)
    that.gettime()
    var id = event.currentTarget.dataset.id
    var receiver = event.currentTarget.dataset.receive
    this.$wuxDialog.confirm({
      title: '确认接受',
      content: '你确定要接受课程预约吗？',
      onConfirm(e) {
        wx.request({
          url: app.globalData.url + 'appointaccept/' + id,
          method: 'GET',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
        })
        wx.request({
          url: app.globalData.url + 'message/',
          data: {
            state: 0,
            generate: that.data.generate,
            message: '课程预约已经被接受',
            send: app.globalData.current_phone,
            receive: receiver
          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
          success: function (res) {
            console.log("submit success!!")
          },
        })
        wx.showToast({
          title: '成功接受！',
          icon: 'success',
          duration: 3000
        });
        that.onLoad()
        that.setData({
          sliderOffset: 188,
          activeIndex: 2,
        })
      },
      onCancel(e) {

      },
    })
  },
  refuse(event) {
    var that = this
    that.gettime()
    console.log(event)
    var id = event.currentTarget.dataset.id
    var receiver = event.currentTarget.dataset.receive
    this.$wuxDialog.confirm({
      title: '确认拒绝',
      content: '你确定要拒绝课程预约吗？',
      onConfirm(e) {
        wx.request({
          url: app.globalData.url + 'appointrefuse/' + id,
          method: 'GET',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
        })
        wx.request({
          url: app.globalData.url + 'message/',
          data: {
            state: 0,
            generate: that.data.generate,
            message: '课程预约已经被拒绝',
            send: app.globalData.current_phone,
            receive: receiver
          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
          success: function (res) {
            console.log("submit success!!")
          },
        })
        wx.showToast({
          title: '拒绝成功！',
          icon: 'success',
          duration: 3000
        });
        that.onLoad()
        that.setData({
          sliderOffset: 94,
          activeIndex: 1,
        })
      },
      onCancel(e) {

      },
    })
  },
  cancel(event) {
    var that = this
    that.gettime()
    console.log(event)
    var id = event.currentTarget.dataset.id
    var receiver = event.currentTarget.dataset.receive
    this.$wuxDialog.confirm({
      title: '确认取消',
      content: '你确定要取消课程预约吗？',
      onConfirm(e) {
        wx.request({
          url: app.globalData.url + 'appointrefuse/' + id,
          method: 'GET',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
        })
        wx.request({
          url: app.globalData.url + 'message/',
          data: {
            state: 0,
            generate: that.data.generate,
            message: '课程预约已经被取消',
            send: app.globalData.current_phone,
            receive: receiver
          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
          success: function (res) {
            console.log("submit success!!")
          },
        })
        wx.showToast({
          title: '取消成功！',
          icon: 'success',
          duration: 3000
        });
        that.onLoad()
        that.setData({
          sliderOffset: 0,
          activeIndex: 0,
        })
      },
      onCancel(e) {

      },
    })
  },
  drop(event) {
    var that = this
    that.gettime()
    console.log(event)
    var id = event.currentTarget.dataset.id
    var receiver = event.currentTarget.dataset.receive
    wx.navigateTo({
      url: '../cancel_order/cancel?id=' + id + '&&receive=' + receiver,
    })
  },
  pay(event) {
    var that = this
    console.log(event)
    that.gettime()
    var id = event.currentTarget.dataset.id
    var index = event.currentTarget.dataset.index
    var receiver = event.currentTarget.dataset.receive
    wx.request({
      url: app.globalData.url+'pay/',
      method: 'POST',
      data: {
        total_fee: that.data.getordered[index].times * that.data.getordered[index].price ,   /*订单金额*/
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.sign,
          'success': function (res) {
            wx.request({
              url: app.globalData.url + 'appointpay/' + id,
              method: 'GET',
              header: {
                "Content-Type": "application/json"
              },
              dataType: 'json',
            })
            wx.request({
              url: app.globalData.url + 'message/',
              data: {
                state: 0,
                generate: that.data.generate,
                message: '课程已支付',
                send: app.globalData.current_phone,
                receive: receiver
              },
              method: 'POST',
              header: {
                "Content-Type": "application/json"
              },
              dataType: 'json',
              success: function (res) {
                console.log("submit success!!")
              },
            })
            wx.showToast({
              title: '支付成功！',
              icon: 'success',
              duration: 3000
            });
            that.onLoad()
            that.setData({
              sliderOffset: 188,
              activeIndex: 2,
            })
          },
          'fail': function (res) {
            console.log('fail:' + JSON.stringify(res));
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },
  finish(event) {
    var that = this
    that.gettime()
    console.log(event)
    var id = event.currentTarget.dataset.id
    var receiver = event.currentTarget.dataset.receive
    var price=event.currentTarget.dataset.price
    console.log(price)

    this.$wuxDialog.confirm({
      title: '确认结课？',
      content: '课时费将直接进入老师账户',
      onConfirm(e) {
        wx.request({
          url: app.globalData.url + 'appointfinish/' + id,
          data: event.currentTarget.dataset.price,
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
        })
        wx.request({
          url: app.globalData.url + 'message/',
          data: {
            state: 0,
            generate: that.data.generate,
            message: '已经确认结课，快去查看评价吧',
            send: app.globalData.current_phone,
            receive: receiver
          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          dataType: 'json',
          success: function (res) {
            console.log("submit success!!")
            app.globalData.logininf[0].sc + 100
          },
        })
        wx.showToast({
          title: '结课成功！您获得了100积分',
          icon: 'success',
          duration: 3000
        });
        that.onLoad()
        that.setData({
          sliderOffset: 281,
          activeIndex: 3,
        })
      },
      onCancel(e) {

      },
    })
  },
  onShow: function () {
    this.onLoad()
  },
  onPullDownRefresh: function () {
    this.onLoad()
  },
});

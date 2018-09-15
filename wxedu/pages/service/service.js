var app = getApp()

Page({
  data: {
    city: "未知",
    searchtext: '',  //搜索文字
    filterdata: {},  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    cindex: 0,
    sindex: 0,
    findex: 0,  //排序索引
    cid: 0,  //一级科目id
    csindex: 0,  //二级科目索引
    csid: 0, //二级科目id
    csname: '全部',
    servicelist: [], //服务集市列表
    scrolltop: null, //滚动位置
    page: 0, //分页
    category: [],
    cate: [],
    sort: ['综合排序', '信用等级', '价格由高到低', '价格由低到高'],
    filter1: ['学历', '价格', '性格'],
    filter1_detail: [
      ['不限', '本科', '硕士', '博士'],
      ['不限', '30~40/小时', '40~50/小时', '50~60/小时', '60~80/小时', '80~100/小时', '100以上/小时'],
      ['不限', '匹配']
    ],
    filter2: ['价格', '性格'],
    filter2_detail: [
      ['不限', '30~40/小时', '40~50/小时', '50~60/小时', '60~80/小时', '80~100/小时', '100以上/小时'],
      ['不限', '匹配']
    ],
    filterlist: [],
    teacherlist: [],
    newlist: [],
    templist: [],
    teacherlistlength: null,
    url: null,
    api: app.globalData.url,
    showTip:false,
    placeholder:'搜索老师,学生'
  },
  onLoad: function () { //加载数据渲染页面
    // this.fetchTeacherData();
    var url = null
    var that = this
    // console.log('-----------------------------csid=' + app.globalData.hotSubjectCsname + '----------------------------')
    this.setData({
      islogin: app.globalData.islogin,
      state: app.globalData.base,
      city: app.globalData.city,
      district: app.globalData.district,
      citycode: app.globalData.citycode,
      provincecode: app.globalData.provincecode,
      csid: app.globalData.hotSubjectCsid,
      cid: app.globalData.hotSubjectCid,
      cindex: app.globalData.hotSubjectCid,
      // csindex: app.globalData.hotSujectCsindex,
      csname: app.globalData.hotSubjectCsname
    })
    // //定位
    // if (that.data.city == "未知") {
    //   var myAmapFun = new amapFile.AMapWX({ key: '1f24733b3fa9e94d06bd1af26899f8ec' });
    //   myAmapFun.getRegeo({
    //     success: function (data) {
    //       console.log(data)
    //       that.setData({
    //         city: data[0].regeocodeData.addressComponent.city
    //       })
    //       app.globalData.city = data[0].regeocodeData.addressComponent.city
    //       //成功回调
    //     },
    //     fail: function (info) {
    //       //失败回调
    //       console.log(info)
    //     }
    //   })
    // }
    if (app.globalData.base == 0)
      url = app.globalData.url + 'registeredteachers/sub/'
    else
      url = app.globalData.url + 'registeredstudents/sub/'
    that.setData({ url: url })
    that.postInfo(function () { })
    console.log(app.globalData.base)
    that.setData({ islogin: app.globalData.islogin })
    wx.request({
      url: that.data.url + that.data.csid, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          teacherlist: res.data,
          oldlist: res.data,
          teacherlistlength: res.data.length
        })
        that.setData({ newlist: [], page: 0 })
        that.fetchServiceData()
      }
    })
  },
  change() {
    var that = this
    var url = app.globalData.url + 'registeredstudents/sub/'
    wx.showModal({
      title: '提示',
      content: '选择学员库或教员库',
      confirmText: '学员库',
      cancelText: '教员库',
      confirmColor: '#000000',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击学员库')
          app.globalData.base = 1
          that.setData({ state: app.globalData.base })
          url = app.globalData.url + 'registeredstudents/sub/'
          that.setData({ url: url })
          wx.request({
            url: that.data.url + that.data.csid, //仅为示例，并非真实的接口地址
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.setData({
                teacherlist: res.data,
                oldlist: res.data,
                teacherlistlength: res.data.length
              })
              that.setData({ newlist: [], page: 0 })
              that.fetchServiceData()

            }
          })
        } else if (res.cancel) {
          console.log('用户点击教员库')
          app.globalData.base = 0
          that.setData({ state: app.globalData.base })
          url = app.globalData.url + 'registeredteachers/sub/'
          that.setData({ url: url })
        }
        console.log(that.data.base)
        that.setData({ islogin: app.globalData.islogin })
        wx.request({
          url: that.data.url + that.data.csid, //仅为示例，并非真实的接口地址
          method: 'GET',

          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              teacherlist: res.data,
              oldlist: res.data,
              teacherlistlength: res.data.length
            })
            that.setData({ newlist: [], page: 0 })
            that.fetchServiceData()

          }
        })

      }
    })
  },
  onHide: function () {
    app.globalData.hotSubjectCid = 0
    app.globalData.hotSubjectCsid = 0
    app.globalData.hotSubjectCsname = '全部'
    app.globalData.hotSubjectCsindex = 0
  },

  postInfo: function () {
    var that = this;
    var role = app.globalData.posturl[1];
    console.log(role)
    wx.request({
      url: role, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var container = []
        var container1 = {}
        var container2 = []
        app.globalData.category = res.data
        that.setData({ category: res.data })
        console.log(that.data.category[0])
        for (var i = 0; i < that.data.category[0].length; i++) {
          container = []
          container1 = {}
          var cid = that.data.category[0][i].cid
          for (var j = 0; j < that.data.category[1].length; j++) {
            var cid_id = that.data.category[1][j].cid_id
            if (cid == cid_id) {
              container.push(that.data.category[1][j])
              // console.log(that.data.category[1][j])         
            }
          }
          container1.cid = cid
          container1.cname = that.data.category[0][i].cname
          container1.csname = container
          console.log(container1)
          console.log(container1.cid)
          container2.push(container1)
        }
        that.setData({ cate: container2 })
        var csid = that.data.csid
        for (var i = 0; i < that.data.cid; i++) {
          csid = csid - that.data.cate[i].csname.length
        }
        csid = csid
        console.log(csid)
        that.setData({ csindex: csid, cindex: that.data.cid })
      }
    })


  },
  fetchServiceData: function () {  //获取科目列表
    let _this = this;
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      during:1000
    })
    const perpage = 10;
    this.setData({
      page: that.data.page + 1
    })
    const page = that.data.page;
    var teacherlength = that.data.teacherlistlength
    var templist = [];
    for (var i = (page - 1) * perpage; i < page * perpage; i++) {
      if (i < teacherlength)
        templist.push(that.data.teacherlist[i])
      //console.log(newlist)
    }
    console.log(that.data.teacherlist)
    var filtered = that.filterByDistrict(that.data.newlist.concat(templist), that.data.district)
   
    setTimeout(() => {
      if (filtered.length == 0) {
        that.setData({
          showTip: true
        })
      }
      else{
        that.setData({
          showTip: false
        })
      }
      that.setData({ newlist: filtered, templist: templist })
    }, 1000)
  },
  inputFocus:function(e){
    console.log('Focus!')
    this.setData({
      placeholder:''
    })
  },
  inputSearch: function (e) {  //输入搜索文字
    this.setData({
      showsearch: e.detail.cursor > 0,
      searchtext: e.detail.value
    })
  },
  submitSearch: function () {  //提交搜索
    console.log(this.data.searchtext);
    var teacher;
    var that = this;
    var url = app.globalData.url + 'selectbyname/'
    console.log(url)
    wx.request({
      url: url,
      method: 'POST', //仅为示例，并非真实的接口地址
      data: {
        name: that.data.searchtext,
        state: that.data.state
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        teacher = res.data
        if(teacher.length==0){
          that.setData({
            showTip: true
          })
        }
        else {
          that.setData({
            showTip: false
          })
        }
        that.setData({
          newlist: teacher
        })
      }
    })
    // this.fetchServiceData();
  },
  setFilterPanel: function (e) { //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.filterindex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }
    console.log(d.showfilterindex);
  },

  setCityIndex: function (e) { //科目一级索引
    const d = this.data;
    var that = this;
    const dataset = e.currentTarget.dataset;
    this.setData({
      cindex: dataset.cindex,
      cid: dataset.cid,
      csindex: d.cindex == dataset.cindex ? d.csindex : 0
    })
    console.log(d.cindex)
    console.log('一级--' + this.data.cid);
  },
  setSubcityIndex: function (e) { //科目二级索引
    const dataset = e.currentTarget.dataset
    var that = this
    var flag = 0
    var newlist = []
    var csname = that.data.csname
    console.log(csname)
    this.setData({
      csindex: dataset.csindex,
      csid: dataset.csid,
      csname: dataset.csname,
    })
    /*
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    */
    console.log(that.data.url + that.data.csid)
    wx.request({
      url: that.data.url + that.data.csid, //仅为示例，并非真实的接口地址
      method: 'GET',

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.length)
        console.log(that.data.state)
        that.setData({
          teacherlist: res.data,
          oldlist: res.data,
          teacherlistlength: res.data.length
        })
        console.log(csname + " " + that.data.csid)
        if (csname != that.data.csname) {
          that.setData({ newlist: [], page: 0 })
          that.fetchServiceData()
        }
      }
    })
    that.hideFilter()
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
  },
  scrollLoading: function () { //滚动加载
    if (this.data.templist.length > 0 && this.data.templist.length < this.data.teacherlist.length)
      this.fetchServiceData();
  },
  onPullDownRefresh: function () { //下拉刷新
    var that = this
    wx.request({
      url: that.data.url + that.data.csid, //仅为示例，并非真实的接口地址
      method: 'GET',

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.length)
        console.log(that.data.state)
        that.setData({ teacherlist: res.data, teacherlistlength: res.data.length, page: 0, newlist: [] })
        console.log(that.data.teacherlist)
        that.fetchServiceData();
      }
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  onShow() {
    this.onLoad()
  },
  quickSort: function (arr) {
    //如果数组<=1,则直接返回
    if (arr.length <= 1) { return arr; }
    var pivotIndex = Math.floor(arr.length / 2);
    //找基准，并把基准从原数组删除
    var pivot = arr.splice(pivotIndex, 1)[0];
    //定义左右数组
    var left = [];
    var right = [];

    //比基准小的放在left，比基准大的放在right
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].price <= pivot.price) {
        left.push(arr[i]);
      }
      else {
        right.push(arr[i]);
      }
    }
    //递归
    return quickSort(left).concat([pivot], quickSort(right));
  },

  bubbleSortByPriceAsc: function (array) {
    var i = 0,
      len = array.length,
      j, d;
    for (; i < len; i++) {
      for (j = 0; j < len; j++) {
        if (array[i].price > array[j].price) {
          d = array[j];
          array[j] = array[i];
          array[i] = d;
        }
      }
    }
    console.log(array)
    return array;
  },
  bubbleSortByPriceDesc: function (array) {
    var i = 0,
      len = array.length,
      j, d;
    for (; i < len; i++) {
      for (j = 0; j < len; j++) {
        if (array[i].price < array[j].price) {
          d = array[j];
          array[j] = array[i];
          array[i] = d;
        }
      }
    }
    console.log(array)
    return array;
  },
  bubbleSortByLevelDesc: function (array) {
    var i = 0,
      len = array.length,
      j, d;
    for (; i < len; i++) {
      for (j = 0; j < len; j++) {
        if (array[i].level > array[j].level) {
          d = array[j];
          array[j] = array[i];
          array[i] = d;
        }
      }
    }
    console.log(array)
    return array;
  },

  sort: function (e) {
    var that = this
    var sorted = that.data.newlist
    that.setData({
      sindex: e.currentTarget.dataset.sindex
    })
    switch (that.data.sindex) {
      case 0:
      case 1:
        sorted = that.bubbleSortByLevelDesc(that.data.teacherlist)
        break;
      case 2:
        sorted = that.bubbleSortByPriceAsc(that.data.teacherlist)
        break;
      case 3:
        sorted = that.bubbleSortByPriceDesc(that.data.teacherlist)
        break;
    }
    that.setData({
      teacherlist: sorted,
      oldlist: sorted,
      newlist: [],
      page: 0
    })
    that.fetchServiceData()
    that.hideFilter()
  },
  filterByGrade: function (arr, key) {
    var newlist = []
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].grade == key) {
        newlist.push(arr[i])
      }
    }
    return newlist
  },
  filterByPrice: function (arr, p1, p2) {
    var newlist = []
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].price >= p1 && arr[i].price <= p2) {
        newlist.push(arr[i])
      }
    }
    return newlist
  },
  filterByDistrict: function (arr, district) {
    var newlist = []
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].city == district) {
        newlist.push(arr[i])
      }
    }
    return newlist
  },
  filterByChacater: function (arr, character) {
    if (this.data.islogin) {
      var newlist = []
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].character == character) {
          newlist.push(arr[i])
        }
      }
      return newlist
    }
  },
  filterIndex: function (e) {
    var that = this
    that.setData({
      findex: e.currentTarget.dataset.findex
    })
  },
  filter0: function (e) {
    var that = this
    var filtered = that.data.newlist
    var fsindex = e.currentTarget.dataset.fsindex
    var arr = that.data.teacherlist
    that.setData({
      fsindex: e.currentTarget.dataset.fsindex
    })
    switch (that.data.findex) {
      case 0:
        if (that.data.filtereddByGrade == true)
          arr = that.data.oldlist
        switch (fsindex) {
          case 0:
            filtered = that.data.oldlist
            break;
          case 1:
            var filtered = that.filterByGrade(arr, '本科')
            break;
          case 2:
            var filtered = that.filterByGrade(arr, '硕士')
            break;
          case 3:
            var filtered = that.filterByGrade(arr, '博士')
            break
        }
        that.setData({
          filtereddByGrade: true
        })
        break;
      case 1:
        if (that.data.filtereddByPrice == true)
          arr = that.data.oldlist
        switch (fsindex) {
          case 0:
            filtered = that.data.oldlist
            break;
          case 1:
            var filtered = that.filterByPrice(arr, 30, 40)
            break;
          case 2:
            var filtered = that.filterByPrice(arr, 40, 50)
            break;
          case 3:
            var filtered = that.filterByPrice(arr, 50, 60)
            break;
          case 4:
            var filtered = that.filterByPrice(arr, 60, 80)
            break;
          case 5:
            var filtered = that.filterByPrice(arr, 80, 100)
            break;
          case 6:
            var filtered = that.filterByPrice(arr, 100, 10000)
            break;
        }
        that.setData({
          filtereddByPrice: true
        })
        break;
      case 2:
        if (that.data.filtereddByCharacter == true)
          arr = that.data.oldlist
        switch (fsindex) {
          case 0:
            filtered = that.data.oldlist
            break;
          case 1:
            console.log(app.globalData.logininf[0].character)
            var filtered = that.filterByChacater(arr, app.globalData.logininf[0].character)
            break;
        }
        that.setData({
          filtereddByCharacter: true
        })
    }
    that.setData({
      teacherlist: filtered,
      newlist: [],
      teacherlistlength: filtered.length,
      page: 0
    })
    that.fetchServiceData()
    that.hideFilter()
  },
  filter1: function (e) {
    var that = this
    var filtered = that.data.newlist
    var fsindex = e.currentTarget.dataset.fsindex
    var arr = that.data.teacherlist
    that.setData({
      fsindex: e.currentTarget.dataset.fsindex
    })
    switch (that.data.findex) {
      case 0:
        if (that.data.filtereddByPrice == true)
          arr = that.data.oldlist
        switch (fsindex) {
          case 0:
            filtered = that.data.oldlist
            break;
          case 1:
            var filtered = that.filterByPrice(arr, 30, 40)
            break;
          case 2:
            var filtered = that.filterByPrice(arr, 40, 50)
            break;
          case 3:
            var filtered = that.filterByPrice(arr, 50, 60)
            break;
          case 4:
            var filtered = that.filterByPrice(arr, 60, 80)
            break;
          case 5:
            var filtered = that.filterByPrice(arr, 80, 100)
            break;
          case 6:
            var filtered = that.filterByPrice(arr, 100, 10000)
            break;
        }
        that.setData({
          filtereddByPrice: true
        })
        break;
      case 1:
        if (that.data.filtereddByCharacter == true)
          arr = that.data.oldlist
        switch (fsindex) {
          case 0:
            filtered = that.data.oldlist
            break;
          case 1:
            console.log(app.globalData.logininf[0].character)
            var filtered = that.filterByChacater(arr, app.globalData.logininf[0].character)
            break;
        }
        that.setData({
          filtereddByCharacter: true
        })
    }
    that.setData({
      teacherlist: filtered,
      newlist: [],
      teacherlistlength: filtered.length,
      page: 0
    })
    that.fetchServiceData()
    that.hideFilter()
  }
})

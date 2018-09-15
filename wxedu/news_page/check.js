Page({
  /**
   * 初始化数据
   */
  data: {
 items: [
    { name: 'JAVA', value: 'A、完全不符合' },
    { name: 'Object-C', value: 'B、比较不符合' },
    { name: 'JSX', value: 'C、比较符合' },
    { name: 'JS', value: 'D、完全符合' },
    ],
  status: true
  },
  /**
   * 监听checkbox事件
   */
  listenCheckboxChange: function (e) {
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
    //打印对象包含的详细信息
    console.log(e);

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  jumpToNext: function () {
    wx.navigateTo({
      url: '../news_page/result',
    })
  },
  toastShow: function (event) {
    console.log("触发了点击事件，弹出toast")
    this.setData({ status: false })　　　　//setData方法可以建立新的data属性，从而起到跟视图实时同步的效果
  },
  toastHide: function (event) {
    console.log("触发了hide事件，弹出toast")
    this.setData({ status: true })　　　　//setData方法可以建立新的data属性，从而起到跟视图实时同步的效果
    this.jumpToNext()
  },
})


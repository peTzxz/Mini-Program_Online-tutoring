// question/result.js
var app = getApp()
Page({
  data: {
    result_options: {
      tiger: {
        cate: '老虎型',
        special: '有自信，够权威，决断力高，竞争性强，胸怀大志，喜欢评估。 企图心强烈，喜欢冒险，个性积极，竞争力强，有对抗性。',
        advantage: '善于控制局面并能断地作出决定的能力；用这一类型工作方式的人成就非凡。',
        disadvantage: '当感到压力时，这类人就会太重视迅速的完成工作，就容易忽视细节，他们可能不顾自己和别人的情感。由于他们要求过高，加之好胜的天性，有时会成为工作狂。'
      },
      peacock: {
        cate: '孔雀型',
        special: '很热心，够乐观，口才流畅，好交朋友，风度翩翩，诚恳热心。热情洋溢、好交朋友、口才流畅、个性乐观、表现欲强。',
        advantage: '此类型的人生性活泼。能够使人兴奋，他们高效地工作，善于建立同盟或搞好关系来实现目标。他们很适合需要当众表现、引人注目、态度公开的工作。',
        disadvantage: '因其跳跃性的思考模式，常无法顾及细节以及对事情的完成执着度。'
      },
      koala: {
        cate: '考拉型',
        special: '很稳定，够敦厚，温和规律，不好冲突。行事稳健、强调平实，有过人的耐力，温和善良。',
        advantage: '他们对其他人的感情很敏感，这使他们在集体环境中左右逢源。',
        disadvantage: '很难坚持自己的观点和迅速做出决定。一般说来，他们不喜欢面对与同事意见不和的局面，他们不愿处理争执。'
      },
      owl: {
        cate: '猫头鹰型',
        special: '很传统，注重细节，条理分明，责任感强，重视纪律。保守、分析力强，精准度高，喜欢把细节条例化，个性拘谨含蓄。',
        advantage: '天生就有爱找出事情真相的习性，因为他们有耐心仔细考察所有的细节并想出合乎逻辑的解决办法。',
        disadvantage: '把事实和精确度置于感情之前，这会被认为是感情冷漠。在压力下，有时为了避免做出结论，他们会分析过度。'
      },
      chameleon: {
        cate: '变色龙型',
        special: '性格善变，处事极具弹性，能为了适应环境的要求而调整其决定甚至信念。',
        advantage: '善于在工作中调整自己的角色去适应环境，具有很好的沟通能力。',
        disadvantage: '从别人眼中看变色龙族群，会觉得他们较无个性及原则。'
      },
    },
    x: 0,
    y: 0,
    hidden: true,
    //测试结果的数据最低值为50
    x1: 80,
    x2: 90,
    x3: 80,
    x4: 72,
    x5: 81,
    x6: 1.05,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var character = options.character
    var that = this
    this.setData({
      state: app.globalData.state
    })
    switch (character) {
      case 'tiger': this.setData({
        result: this.data.result_options.tiger
      })
        break;
      case 'peacock': this.setData({
        result: this.data.result_options.peacock
      })
        break;
      case 'koala': this.setData({
        result: this.data.result_options.koala
      })
        break;
      case 'owl': this.setData({
        result: this.data.result_options.owl
      })
        break;
      case 'chameleon': this.setData({
        result: this.data.result_options.chameleon
      })
        break;
    }
    wx.request({
      url: app.globalData.url + 'getfivecharacter/',
      data: {
        phone: app.globalData.current_phone,
        state: that.data.state
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        var five = res.data
        that.setData({
          x1: Number(five[0]) + 50,
          x2: Number(five[1]) + 50,
          x3: Number(five[2]) + 50,
          x4: Number(five[3]) + 50,
          x5: Number(five[4]) + 50,
          
        })
        that.setData({
          x6: that.data.x1 > 75 ? 1.05 : 1.15
        })
        const ctx = wx.createCanvasContext('myCanvas')
        that.draw(ctx)
      },
    })
   
  },
  start: function (e) {
    this.setData({
      hidden: false,
      x: e.touches[0].x,
      y: e.touches[0].y
    })
  },
  move: function (e) {
    this.setData({
      x: e.touches[0].x,
      y: e.touches[0].y
    })
  },
  end: function (e) {
    this.setData({
      hidden: true
    })
  },
  draw: function (ctx) {
    ctx.setLineWidth(0.1)
    ctx.setFontSize(15)
    ctx.fillText('自信', 155, 38)
    ctx.setFontSize(15)
    ctx.fillText('乐观', 260, 105)
    ctx.setFontSize(15)
    ctx.fillText('温和', 220, 235)
    ctx.setFontSize(15)
    ctx.fillText('责任感', 90, 235)
    ctx.setFontSize(15)
    ctx.fillText('适应性', 10, 105)
    ctx.scale(2, 2)
    ctx.moveTo(80, 20)
    ctx.lineTo(130, 50)
    ctx.lineTo(110, 110)
    ctx.lineTo(50, 110)
    ctx.lineTo(30, 50)
    ctx.lineTo(80, 20)
    // ctx.stroke()
    //ctx.draw()              0072E3
    ctx.setStrokeStyle('#3A4552')
    ctx.moveTo(80, 120 - 1.1 * 62.5)
    ctx.lineTo(35 + 0.951 * 62.5, 80 - 0.309 * 62.5)
    ctx.lineTo(52 + 0.587 * 62.5, 29 + 0.801 * 62.5)
    ctx.lineTo(108 - 0.587 * 62.5, 29 + 0.801 * 62.5)
    ctx.lineTo(125 - 0.951 * 62.5, 80 - 0.309 * 62.5)
    ctx.lineTo(80, 120 - 1.1 * 62.5)
    ctx.moveTo(80, 120 - 1.06 * 75)
    ctx.lineTo(35 + 0.951 * 75, 80 - 0.309 * 75)
    ctx.lineTo(52 + 0.587 * 75, 29 + 0.801 * 75)
    ctx.lineTo(108 - 0.587 * 75, 29 + 0.801 * 75)
    ctx.lineTo(125 - 0.951 * 75, 80 - 0.309 * 75)
    ctx.lineTo(80, 120 - 1.06 * 75)
    ctx.moveTo(80, 120 - 1.05 * 87.5)
    ctx.lineTo(35 + 0.951 * 87.5, 80 - 0.309 * 87.5)
    ctx.lineTo(52 + 0.587 * 87.5, 29 + 0.801 * 87.5)
    ctx.lineTo(108 - 0.587 * 87.5, 29 + 0.801 * 87.5)
    ctx.lineTo(125 - 0.951 * 87.5, 80 - 0.309 * 87.5)
    ctx.lineTo(80, 120 - 1.05 * 87.5)
    ctx.moveTo(80, 20)
    ctx.lineTo(80, 65)
    ctx.moveTo(130, 50)
    ctx.lineTo(80, 65)
    ctx.lineTo(110, 110)
    ctx.moveTo(50, 110)
    ctx.lineTo(80, 65)
    ctx.moveTo(30, 50)
    ctx.lineTo(80, 65)
    ctx.stroke()
    ctx.beginPath()
    ctx.setStrokeStyle('#87a7d6')
    ctx.moveTo(80, 120 - this.data.x6 * this.data.x1)
    ctx.lineTo(35 + 0.951 * this.data.x2, 80 - 0.309 * this.data.x2)
    ctx.lineTo(52 + 0.587 * this.data.x3, 29 + 0.801 * this.data.x3)
    ctx.lineTo(108 - 0.587 * this.data.x4, 29 + 0.801 * this.data.x4)
    ctx.lineTo(125 - 0.951 * this.data.x5, 80 - 0.309 * this.data.x5)
    ctx.lineTo(80, 120 - this.data.x6 * this.data.x1)
    ctx.setFillStyle('#87a7d6')
    ctx.fill()
    ctx.stroke()
    ctx.draw()
  },
  submit(){
    var that=this
    wx.request({
      url: app.globalData.url + 'retest/',
      data: {
        phone: app.globalData.current_phone,
        state: that.data.state
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      dataType: 'json',
      success: function (res) {
        wx.redirectTo({
          url: './question',
        })
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
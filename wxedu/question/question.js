import qdata from 'qdata'
const raw = qdata
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: ' 非常同意 ', value: '0', checked: false },
      { name: ' 比较同意 ', value: '1', checked: false },
      { name: ' 差不多 ', value: '2', checked: false },
      { name: ' 一点同意 ', value: '3', checked: false },
      { name: ' 不同意 ', value: '4', checked: false }
    ],
    current_question: 0,
    result_options: [
      {
        cate: 'tiger',
        special: '有自信，够权威，决断力高，竞争性强，胸怀大志，喜欢评估。 企图心强烈，喜欢冒险，个性积极，竞争力强，有对抗性。',
        advantage: '善于控制局面并能断地作出决定的能力；用这一类型工作方式的人成就非凡。',
        disadvantage: '当感到压力时，这类人就会太重视迅速的完成工作，就容易忽视细节，他们可能不顾自己和别人的情感。由于他们要求过高，加之好胜的天性，有时会成为工作狂。'
      },
      {
        cate: 'peacock',
        special: '很热心，够乐观，口才流畅，好交朋友，风度翩翩，诚恳热心。热情洋溢、好交朋友、口才流畅、个性乐观、表现欲强。',
        advantage: '此类型的人生性活泼。能够使人兴奋，他们高效地工作，善于建立同盟或搞好关系来实现目标。他们很适合需要当众表现、引人注目、态度公开的工作。',
        disadvantage: '因其跳跃性的思考模式，常无法顾及细节以及对事情的完成执着度。'
      },
      {
        cate: 'koala',
        special: '很稳定，够敦厚，温和规律，不好冲突。行事稳健、强调平实，有过人的耐力，温和善良。',
        advantage: '他们对其他人的感情很敏感，这使他们在集体环境中左右逢源。',
        disadvantage: '很难坚持自己的观点和迅速做出决定。一般说来，他们不喜欢面对与同事意见不和的局面，他们不愿处理争执。'
      },
      {
        cate: 'owl',
        special: '很传统，注重细节，条理分明，责任感强，重视纪律。保守、分析力强，精准度高，喜欢把细节条例化，个性拘谨含蓄。',
        advantage: '天生就有爱找出事情真相的习性，因为他们有耐心仔细考察所有的细节并想出合乎逻辑的解决办法。',
        disadvantage: '把事实和精确度置于感情之前，这会被认为是感情冷漠。在压力下，有时为了避免做出结论，他们会分析过度。'
      },
      {
        cate: 'chameleon',
        special: '性格善变，处事极具弹性，能为了适应环境的要求而调整其决定甚至信念。',
        advantage: '善于在工作中调整自己的角色去适应环境，具有很好的沟通能力。',
        disadvantage: '从别人眼中看变色龙族群，会觉得他们较无个性及原则。'
      },
    ]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      raw: raw,
      state: app.globalData.state
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var value = e.detail.value
    var current_question = this.data.current_question
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      // current_question: current_question + 1,
    });
    console.log(parseInt(value))
    switch (parseInt(value)) {
      case 0: this.data.raw[current_question].grade += 5
        break;
      case 1: this.data.raw[current_question].grade += 4
        break;
      case 2: this.data.raw[current_question].grade += 3
        break;
      case 3: this.data.raw[current_question].grade += 2
        break;
      case 4: this.data.raw[current_question].grade += 1
        break;
    }
    if (this.data.current_question < 29) {
      setTimeout(() => {
        this.setData({
          current_question: current_question + 1,
          radioItems: [
            { name: ' 非常同意 ', value: '0', checked: false },
            { name: ' 比较同意 ', value: '1', checked: false },
            { name: ' 差不多 ', value: '2', checked: false },
            { name: ' 一点同意 ', value: '3', checked: false },
            { name: ' 不同意 ', value: '4', checked: false }
          ],
        })
      }, 500)
    }
  },
  go2pre() {
    var current_question = this.data.current_question
    this.data.raw[current_question - 1].grade = 0
    setTimeout(() => {
      this.setData({ current_question: current_question - 1, })
    }, 500)
  },
  submit() {
    var that=this
    var tiger = [4, 9, 13, 17, 23, 29]
    var peacock = [2, 5, 12, 19, 21, 28]
    var koala = [1, 7, 14, 16, 24, 27]
    var owl = [0, 6, 10, 15, 20, 25]
    var chameleon = [3, 8, 11, 18, 22, 26]
    var tiger_add = 0
    var peacock_add = 0
    var koala_add = 0
    var owl_add = 0
    var chameleon_add = 0
    for (var i = 0; i < 6; i++) {
      tiger_add +=this.data.raw[tiger[i]].grade
      peacock_add += this.data.raw[peacock[i]].grade
      koala_add += this.data.raw[koala[i]].grade
      owl_add += this.data.raw[owl[i]].grade
      chameleon_add += this.data.raw[chameleon[i]].grade
    }
    var array = [tiger_add, peacock_add, koala_add, owl_add, chameleon_add]
    var max = 0
    var max_index = 0
    for (var i = 0; i < 5; i++) {
      if (array[i] > max) {
        max = array[i]
        max_index = i
      }
    }
    var result = that.data.result_options[max_index]
    var fiveCharacter=[ tiger_add,peacock_add ,koala_add , owl_add ,chameleon_add]
    this.setData({
      result: result
    })
      wx.request({
        url: app.globalData.url + 'updatecharacter/',
        data: {
          character: that.data.result_options[max_index].cate,
          fivecharacter: fiveCharacter,
          phone: app.globalData.current_phone,
          state:that.data.state
        },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (res) {
          wx.redirectTo({
            url: './result?character=' + result.cate,
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
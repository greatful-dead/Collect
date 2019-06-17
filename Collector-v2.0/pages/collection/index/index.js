// pages/coupon/index.js
const app = getApp();
var openid;
openid = app.globalData.openid; 
console.log('123123'+openid);
let starNewsList;
let starType;//收藏的类型
let article;
let indexIsHidden;
let newsTitle;
let newsAuthor;
starType = 1;
var resultData = null;
var save = {
  title: null,
  content: null,
  time: null,
  src: null,
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    
    headerTitleName: [
      { name: '一天内', nameID: '01', starType: 1  },
      { name: '一周内', nameID: '02', starType: 2 },
      { name: '一个月内', nameID: '03', starType: 3 },
    ],
    tapID: '01', //判断是否选中
    starNewsList: starNewsList,
    indexIsHidden: indexIsHidden,
    article: article,
    
    tabIndex: 1, //一开始停留的时间段的设置。设定为1是1天内，2是一礼拜，3是一个月
  },

  onLoad: function (options) {
    var _this = this;
    var data;
    setTimeout(function () {
      console.log('typ is ' + starType)
      wx.request({
        //url: 'https://api.jisuapi.com/news/get?channel=' + newsType + '&start=0&num=40' + '&appkey=' + appKey,
        //url: 'https://problem-kid.top/api/v1/user/TimeMachine?openid=' + app.globalData.openid+'&time='+starType+'&typ=1',
        url: 'http://problem-kid.top/api/v1/user/TimeMachine?openid=' + app.globalData.openid + '&time=' + starType + '&typ=0',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: res => {
          resultData = res.data.content;
          console.log(res.data.content)
          _this.setData({
            starNewsList: resultData,
            indexIsHidden: true,
          })

        },
        fail: error => {

        },
        complete: () => {

        }
      })

    }.bind(_this), 1350);

  },
  /**
   * headerBar 点击
   */
  headerTitleClick: function (e) {
    let _this = this;
    starType = e.currentTarget.dataset.startype;
    console.log('typ is ' + starType);
    console.log(e.target.dataset.id);
    _this.setData({
      tapID: e.target.dataset.id,
      indexIsHidden: false
    }),
    //获取新闻
    setTimeout(function (){
      wx.request({
        url: 'https://problem-kid.top/api/v1/user/TimeMachine?openid=' + app.globalData.openid+'&time='+starType+'&typ=0',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: res => {                                                                       
          resultData = res.data.content;
          console.log(res.data.content)
          _this.setData({
            starNewsList: resultData,
            indexIsHidden: true,
          })

        },
        fail: error => {

        },
        complete: () => {

        }
      })

    }.bind(_this), 1350);
  },
  /**
   * 跳转详情页面
   */
  viewDetail: function (e) {
    article = e.currentTarget.dataset.news;
    console.log(e.currentTarget.dataset.news);
    save.content = e.currentTarget.dataset.news;
    app.globalData.page = JSON.stringify(save);
    console.log(JSON.parse(JSON.stringify(save)))

    newsTitle = e.currentTarget.dataset.newstitle;
    console.log(e.currentTarget.dataset.newstitle)
    newsAuthor = e.currentTarget.dataset.newsauthor;
    console.log(e.currentTarget.dataset.newsauthor)
    wx.navigateTo({
      url: '../detail2/detail2?newsTitle=' + newsTitle + '&newsAuthor=' + newsAuthor,
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
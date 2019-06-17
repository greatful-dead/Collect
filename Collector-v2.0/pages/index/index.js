//index.js
//获取应用实例
//var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
const appKey = 'ff5c61c75de843af'; //用于访问新闻接口的appKey

let contentNewsList;
let newsType;
let article;
let indexIsHidden;
newsType = '头条';
var save = {
  title: null,
  content: null,
  time: null,
  src: null,
}
//let newsUrl;
let newsTitle;
let newsAuthor;

Page({
  data: {
    headerTitleName: [
      { name: '头条', nameID: '01', newsType: '头条' },
      { name: '科技', nameID: '02', newsType: '科技' },
      { name: '财经', nameID: '03', newsType: '财经' },
      { name: '教育', nameID: '04', newsType: '教育' },
      { name: '军事', nameID: '05', newsType: '军事' },
      { name: '娱乐', nameID: '06', newsType: '娱乐' },
      { name: '篮球', nameID: '07', newsType: 'NBA' },
    ],
    tapID: '01', //判断是否选中
    contentNewsList: contentNewsList,
    indexIsHidden: indexIsHidden,
    article: article
  },
  //事件处理函数
  onLoad: function () {
    var _this = this;
    //请求头条数据
    wx.request({
      url: 'https://api.jisuapi.com/news/get?channel=' + newsType + '&start=0&num=40' + '&appkey=' + appKey,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        let resultData = res.data.result.list;
        console.log(res.data.result.list)
        _this.setData({
          contentNewsList: resultData,
          indexIsHidden: true,
        })
      },
      fail: error => {

      },
      complete: () => {

      }
    })
  },
  //headerBar 点击
  headerTitleClick: function (e) {
    let _this = this;
    newsType = e.currentTarget.dataset.newstype;
    _this.setData({
      tapID: e.target.dataset.id,
      indexIsHidden: false
    })
    //获取新闻
    wx.request({
      url: 'https://api.jisuapi.com/news/get?channel=' + newsType + '&start=0&num=40' + '&appkey=' + appKey,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        let resultData = res.data.result.list;
        console.log(res.data.result.list)
        _this.setData({
          contentNewsList: resultData,
          indexIsHidden: true,
        })

      },
      fail: error => {

      },
      complete: () => {

      }
    })
  },

  //跳转到新闻详情页

  viewDetail: function(e) {
    article = e.currentTarget.dataset.news;
    save.content = e.currentTarget.dataset.news;
    app.globalData.page = JSON.stringify(save);
    console.log(JSON.parse(JSON.stringify(save)))

    newsTitle = e.currentTarget.dataset.newstitle;
    newsAuthor = e.currentTarget.dataset.newsauthor;
    wx.navigateTo({
      url: '../detail/detail?newsTitle=' + newsTitle + '&newsAuthor=' + newsAuthor ,
    })
  },

})

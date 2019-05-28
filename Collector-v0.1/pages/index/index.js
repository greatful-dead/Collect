//index.js
//获取应用实例
const app = getApp()
var save = {
  title: null,
  content: null,
  time: null,
  src: null,
}
var arr = new Array();
var pages = 0;
Page({
  data: {
    currentTab: 0,
    list_data: null
  },
  onLoad: function (e) {
    var that = this//不要漏了这句，很重要
    wx.request({
      url: 'https://api.jisuapi.com/news/get?channel=科技&start=0&num=40&appkey=ff5c61c75de843af',
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data.result.list)
        arr = res.data.result.list
        console.log(arr)
        that.setData({
          list_data: arr.slice(0, 10)
        })
        //console.log(list_data)
        save.content = arr.slice(0, 10);
        app.globalData.page = JSON.stringify(save);
        //console.log(JSON.parse(JSON.stringify(save)))
      },
    })
  },
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: 'https://api.jisuapi.com/news/get?channel=科技&start=0&num=40&appkey=ff5c61c75de843af',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        pages = 0
        arr = res.data.result.list
        console.log(arr)
        that.setData({
          list_data: arr.slice(0, 10)
        });
        save.content = arr.slice(0, 10);
        app.globalData.page = JSON.stringify(save);
        //console.log(JSON.parse(JSON.stringify(save)))
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    pages += 10;
    console.log(pages);
    if (pages >= 40) {
      wx.showToast({
        title: '没有更多数据了！',
        //image: '../../src/images/noData.png',
      })
    } else {
      wx.showToast({
        title: '加载成功！',
        //image: '../../src/images/noData.png',
      })
      var arr2 = arr.slice(pages, pages + 10)
      var arr3 = arr.slice(0, pages)
      for (var i = 0; i < arr2.length; i++) {
        arr3.push(arr2[i]);
      }
      arr2 = null;
      console.log(arr3);
      that.setData({
        list_data: arr3
      })
      save.content = arr.slice(0, pages + 10);
      app.globalData.page = JSON.stringify(save);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
 /**
   * 导航标签选择1）
   */
  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  /**
   * 导航页面显示2）
   */
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })
  },
  //监听页面高度(上滑或者下滑)
  onPageScroll: function (obj) {
    if (obj.scrollTop > 363) {
      this.setData({
        goTopStatus: true
      })
    }
  },
  goToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
    })
    this.setData({
      goTopStatus: false
    })
  }
})

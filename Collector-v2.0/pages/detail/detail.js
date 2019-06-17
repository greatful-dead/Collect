var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()

Page({
  data: {
    article: null,
    title: null,
    index: " ",
    url: null,
    src: null,
    time: null,
    pic: null,
    click: true,
    click1: true,
    openid: null,
    indexIsHidden: false
  },
  onLoad: function (e) {
    var that = this;
    var p = JSON.parse(app.globalData.page)
    console.log(p)
    console.log(app.globalData.openid + '1231312')
    that.setData({
      index: e.index,
      title: p.content.title, //原来是p.content[e.index].title,
      article: p.content.content,
      url: p.content.url,
      src: p.content.src,
      time: p.content.time,
      pic: p.content.pic,
      openid: app.globalData.openid,
      indexIsHidden: true
    })
    this.detect();
    this.check();
    var pp = p.content.content;
    console.log(this.data.url)
    WxParse.wxParse('pp', 'html', pp, that, 5)
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
  },
  check: function () {
    app.http('v1/index/CheckNews', {
      openid: this.data.openid,
      newsid: app.globalData.nowNewsId,
    }, "GET")
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          console.log('设置为已喜欢！！！');
          this.setData({
            click: false, //已经喜欢
            //openid: app.globalData.openid
          });
        }
        else if (res.code == 300) {
          console.log('设置为未喜欢！！！');
          this.setData({
            click: true,
          });
        }
      })


    app.http('v1/index/CheckNewsSave', {
      openid: this.data.openid,
      newsid: app.globalData.nowNewsId,
    }, "GET")
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          this.setData({
            click1: false, //已经喜欢
            //openid: app.globalData.openid
          });
        }
        else if (res.code == 300) {
          this.setData({
            click1: true,
          });
        }
      })
  },


  change: function () {
    var click = this.data.click;
    console.log(app.globalData.openid + '123456');
    if (click == true) {
      this.setData({
        click: false, //喜欢资讯
        //openid: app.globalData.openid
      });
      app.http('v1/index/LikeNews', {
        openid: this.data.openid,
        newsid: app.globalData.nowNewsId,
        status: 1, //后端判断是喜欢资讯的标志
      }, "GET")
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            wx.showToast({
              title: '已喜欢该资讯',
              icon: 'success',
              duration: 1500
            })
          }
          else {
            wx.showToast({
              title: '喜欢功能出错！',
              icon: 'warn',
              duration: 2000
            })
            this.setData({
              click: true, //相当于rollback
            });
          }
        })
    }
    else {
      this.setData({
        click: true, //取消喜欢
        //openid: app.globalData.openid
      })
      app.http('v1/index/LikeNews', {
        openid: this.data.openid,
        newsid: app.globalData.nowNewsId,
        status: 0, //后端判断是喜欢资讯的标志
      }, "GET")
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            wx.showToast({
              title: '取消喜欢成功！',
              icon: 'success',
              duration: 1500
            })
          }
          else {
            wx.showToast({
              title: '取消操作失败！',
              icon: 'warn',
              duration: 2000
            })
            this.setData({
              click: false, //相当于rollback
            });
          }
        })
    }


  },
  favor: function () {

    var click1 = this.data.click1;
    if (click1 == true) {
      this.setData({
        click1: false, //收藏资讯
        //openid: app.globalData.openid
      });
      app.http('v1/index/SaveNews', {
        openid: this.data.openid,
        newsid: app.globalData.nowNewsId,
        status: 1, //后端判断是收藏资讯的标志
      }, "GET")
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            wx.showToast({
              title: '已收藏该资讯',
              icon: 'success',
              duration: 1500
            })
          }
          else {
            wx.showToast({
              title: '收藏功能出错！',
              icon: 'warn',
              duration: 2000
            })
            this.setData({
              click1: true, //相当于rollback
            });
          }
        })
    }
    else {
      this.setData({
        click1: true, //取消收藏
        //openid: app.globalData.openid
      })
      app.http('v1/index/SaveNews', {
        openid: this.data.openid,
        newsid: app.globalData.nowNewsId,
        status: 0, //后端判断是收藏资讯的标志
      }, "GET")
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            wx.showToast({
              title: '取消收藏成功！',
              icon: 'success',
              duration: 1500
            })
          }
          else {
            wx.showToast({
              title: '取消收藏失败！',
              icon: 'warn',
              duration: 2000
            })
            this.setData({
              click1: false, //相当于rollback
            });
          }
        })
    }
  },

  detect: function () {
    console.log(this.data.title)
    //console.log(newscontent)
    //console.log(time)
    console.log(this.data.time)
    console.log(this.data.pic)
    console.log(this.data.src)
    app.http('v1/index/GetNews', {
      src: this.data.src,
      url: this.data.url,
      time: this.data.time,
      title: this.data.title,
      article: this.data.article,
      pic: this.data.pic
    }, "POST")
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          app.globalData.nowNewsId = res.data.newsid;
          // wx.showToast({
          //   title: res.data.newsid,
          //   // icon: 'success',
          //   duration: 2000
          // })
        }
        else {
          wx.showToast({
            title: '读取出错！',
            icon: 'warn',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/index/index',
            })
          }, 50)

        }
      })
  },
})
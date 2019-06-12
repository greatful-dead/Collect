//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //   // 登录
    //   wx.login({
    //     success: res => {
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       this.http('v1/user/getWxUser', { code: res.code }).then(res => {
    //         const app = getApp()
    //         console.log(res.data.openid + '123456yyyyy')
    //         app.globalData.openid = res.data.openid
    //         app.globalData.userInfo = res.data
    //       })
    //     }
    //   })
    //   // 获取用户信息，应该只要一次就可以！！！
    //   wx.getSetting({
    //     success: res => {
    //       if (res.authSetting['scope.userInfo']) {
    //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //         wx.getUserInfo({
    //           success: res => {
    //             // 可以将 res 发送给后台解码出 unionId
    //             this.globalData.userInfo = res.userInfo

    //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //             // 所以此处加入 callback 以防止这种情况
    //             if (this.userInfoReadyCallback) {
    //               this.userInfoReadyCallback(res)
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    // },

    // 登录

    // 获取用户信息，应该只要一次就可以！！！





    wx.getSetting({
      success: res => {
        console.log('console false')
        console.log(res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo'] === false) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false
          })
        }
        else {
          // wx.getUserInfo({
          //   success: res => {
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo

          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })

          wx.login({
            success: res => {
              console.log('进入！')
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              this.http('v1/user/getWxUser', { code: res.code }).then(res => {
                const app = getApp()
                console.log(res.data.openid + '123456yyyyy')
                app.globalData.openid = res.data.openid
                app.globalData.userInfo = res.data
                app.globalData.key = res.data.key
              })
            }
          })

        }
      }
    })
  },



  // wx.getUserInfo({
  //   withCredentials: true,
  //   success: function(res) {
  //     //此处为获取微信信息后的业务方法
  //     wx.login({
  //       success: res => {
  //         console.log('进入！')
  //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //         this.http('v1/user/getWxUser', {
  //           code: res.code
  //         }).then(res => {
  //           const app = getApp()
  //           console.log(res.data.openid + '123456yyyyy')
  //           app.globalData.openid = res.data.openid
  //           app.globalData.userInfo = res.data
  //         })
  //       }
  //     })
  //   },
  //   fail: function() {
  //     //获取用户信息失败后。请跳转授权页面
  //     wx.showModal({
  //       title: '警告',
  //       content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
  //       success: function(res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           wx.navigateTo({
  //             url: './tologin/tologin',
  //           })
  //         }
  //       }
  //     })
  //   }
  // })






  http: function (url, data = '', method = "GET") { //封装http请求
    const apiUrl = 'https://problem-kid.top/api/' //请求域名
    //const apiUrl = 'http://localhost:6969/api/'
    console.log(this.globalData)
    const currency = {
      openid: this.globalData.openid
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: apiUrl + url,
        data: Object.assign(currency, data),
        method: method,
        success: function (res) {
          console.log(res.data.code);
          if (res.data.code != 200 && res.data.code != 300) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          resolve(res.data)
        },
        fail: function (res) {
          reject(res);
        },
        complete: function () {
          console.log('complete');
        }
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  globalData: {
    userInfo: null,
    openid: null,
    nowNewsId: null,
    key:null
  }
})
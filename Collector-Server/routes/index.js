const express = require('express')
const router = express.Router()
const intercept = require('./intercept')



const homeApi = require('../api/home-api.js') //主页内容的接口调用
const adminApi = require('../api/admin-api.js') //管理员接口调用
const indexApi = require('../api/index-api.js') //资讯详情页的接口调用
const userApi = require('../api/user-api.js') //用户资料的API调用


// ------- 管理(管理员权限) ------- /**删除的实现通过图形化界面实现 */
router.post('/v1/admin/addNews',intercept.admin,adminApi.addNews) //添加资讯 
router.post('/v1/admin/addClass',intercept.admin,adminApi.addClass) //添加分类



// ------- 首页 -------
router.get('/v1/home/RecommandnewsList',homeApi.RecommandnewsList) //获取新闻推荐列表
router.get('/v1/home/selectednewsList',homeApi.selectednewsList) //获取其他对应分类列表
router.get('/v1/home/getClassList',homeApi.getClassList) //获取分类列表
router.get('/v1/home/getOne',homeApi.getOne) //获取单个资讯详情，让前端在首页就拿到这么多会影响性能吗？询问！


// ------- 资讯详情页 -------
router.get('/v1/index/LikeNews',indexApi.LikeNews) //喜爱该资讯
router.get('/v1/index/SaveNews',indexApi.SaveNews) //收藏该资讯
router.post('/v1/index/GetNews',indexApi.getNews) //存储资讯


// ------- 用户 -------
router.get('/v1/user/TimeMachine',intercept.user,userApi.TimeMachine) //时光机功能
router.get('/v1/user/getWxUser',userApi.getWxUser) //登录/注册功能

router.get('*', (req, res) => {
    res.json({
        code: -200,
        message: '没有找到该接口'
    })
})

module.exports = router
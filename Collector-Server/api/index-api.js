const moment = require('moment')
const mongoose = require('../mongoose')
const Label = mongoose.model('Label')
const News = mongoose.model('News')
const User = mongoose.model('User')
const marked = require('marked')

/**
 * 喜爱该资讯
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.LikeNews = (req,res) => { // **需测试
    const {
        openid, //微信个人的身份识别
        newsid, //该资讯的url作为识别
        status,
    } = req.query
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log('openid '+openid)
    console.log('newsid '+newsid)
    console.log(status)
    User.find({openid},{'favorusernews':{$elemMatch:{newsid:newsid}}})
    .then(result=>{
        console.log(result[0])
        console.log(status)
        if(result[0].favorusernews.length > 0 && status == 0){ //已经是喜爱状态
            console.log("已找到喜爱记录！");
            User.updateAsync({openid:openid},{'$pull':{"favorusernews":{newsid:newsid}}})
            .then(result=>{
                res.json({
                    code: 200,
                    message: '不再喜爱该资讯喽！',
                    data: result
                })
            })
            .catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                })
            })
        }else{
            console.log("未找到喜爱记录！");
            User.updateAsync({openid},{'$push':{"favorusernews":{newsid, date}}})
            .then(result=>{
                res.json({
                    code: 200,
                    message: '该资讯已成功加入你的喜爱中！',
                    data: result
                })
            })
            .catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                })
            })
        }
    })
    
}


/**
 * 收藏该资讯
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.SaveNews = (req,res) => { // **需测试
    const {
        openid, //微信个人的身份识别
        newsid, //该资讯的url作为识别
        status,
    } = req.query
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    User.find({openid},{'saveusernews':{$elemMatch:{newsid:newsid}}})
    .then(result=>{
        console.log(result)
        console.log(status)
        if(result[0].saveusernews.length > 0 && status == 0){ //已经是喜爱状态
            console.log("已找到喜爱记录！");
            User.updateAsync({openid:openid},{'$pull':{"saveusernews":{newsid:newsid}}})
            .then(result=>{
                res.json({
                    code: 200,
                    message: '不再喜爱该资讯喽！',
                    data: result
                })
            })
            .catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                })
            })
        }else{
            console.log("未找到喜爱记录！");
            User.updateAsync({openid},{'$push':{"saveusernews":{newsid, date}}})
            .then(result=>{
                res.json({
                    code: 200,
                    message: '该资讯已成功加入你的喜爱中！',
                    data: result
                })
            })
            .catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                })
            })
        }
    })
    
}


/**
 * 存储                                                                                                                                                                                                                                                                                                                                                    资讯
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getNews = (req, res) => {
    const { url, article, title, time, src, pic } = req.body
    console.log("YES---!")
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(title)
    //console.log(article)
    console.log(url)
    console.log(time)
    console.log(pic)
    console.log(src)
    News.findOneAsync({ //查询数据库是否有
        newsurl: url,
    })
    .then(result => {
        //console.log(result)
        if (result) {
            console.log('新闻已在库中')                    
            res.json({
                code: 200,
                message: '获取成功',
                data: {
                    newsid:result._id,                    
                }
            })
        } else {
            
            News.createAsync({
                newsname: title,
                newscontent: article,
                newsdate: time,
                adddate: date,
                newsphoto: pic,
                newsresource: src,
                newsurl: url
            }).then(result=>{
                console.log('创建新闻成功');
                res.json({
                    code: 200,
                    message: '创建新闻成功',
                    data: {
                        newsid:result._id,
                    }
                })
            })                        
        }
    })
    .catch(err => {
        console.log('出错！ '+err)
        res.json({
            code: -200,
            message: err.toString(),
            data
        })
    })
        
}

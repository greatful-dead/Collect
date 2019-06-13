const moment = require('moment')
const mongoose = require('../mongoose')
const Label = mongoose.model('Label')
const News = mongoose.model('News')
const User = mongoose.model('User')
const marked = require('marked')




/**
 * 获取新闻推荐列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.RecommandnewsList = (req,res) => {
    const {openid} = req.query //openid用来到数据库中查找对应用户
    let data = {
        openid
    }
    User.find(data)
        .then(user => {
            // let newsId = []
            // user[0].favorusernews.map((v,k)=>{ 
            //     newsId.push(v.id)//将其._id插入
            // })
            let labelId = []

            let sort = '-' //外循环根据喜爱程度来分类,***该功能暂时不做

            user[0].favoruserlabel.map((v,k)=>{ /**需要控制一次获取的量吗？ */
                labelId.push(v.labelid, v.like)//将其._id插入, like是喜爱程度
            })
            Label.find({_id:{'$in':labelId}})
            .then(result => {/**需要控制一次获取的量吗？ */
                // res.json({
                //     code: 200,
                //     data: result
                // })
                News.find({_id:{'$in':result.favoruserlabel.newsid}, sort: [['_id', -1]]})
                .then(result2 => {
                    res.json({
                        code: 200,
                        data: result2
                    })    
                })
                .catch(err => {
                    res.json({
                        code: -200,
                        message: err.toString()
                    })
                })

            })
            .catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                })
            })
        })
        .catch(err => {
            res.json({
                code: -200,
                message: "无用户 + "+err.toString()
            })
        })
}

/**
 * 获取其他对应分类列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.selectednewsList = (req,res) => {
    const {openid, labelid} = req.query //openid用来到数据库中查找对应用户(这里可能不需要),lableid为对应标签的.id
    let data = {
        labelid
    }
    Label.find(data)
    .then(result => {
        let newsId = [] //用来存放返回新闻列表的id值的数组          
        newsId = result[0].favornews;
        News.find({_id:{'$in':newsId}, sort: [['_id', -1]]})
        .then(result2 => {
            res.json({
                code: 200,
                data: result2 //取得是不是太多了
            })    
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })        
        
    })
    .catch(err => {
        res.json({
            code: -200,
            message: "无用户 + "+err.toString()
        })
    })
}

/**
 * 获取分类列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getClassList = (req, res) => {
    Label.find()
        .then(result => {
            const json = {
                code: 200,
                data: {
                    list: result
                }
            }
            res.json(json) /**重点关注！！！！！！！！！！！！！！！！！ */
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
}


/**
 * 获取单个资讯详情
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getOne = (req, res) => {
    const _id = req.query.newsid //req传过来的资讯的newsid字段就是对应咨询的._id
    const user_id = req.cookies.userid || req.headers.userid //同时需要用户的id来显示收藏和喜爱的状态以及实现对应的操作
    if (!_id) {
        res.json({
            code: -200,
            message: '参数错误'
        })
    }
    Promise.all(News.findOneAsync({ _id}))
        .then(value => {
            let json
            if (!value[0]) {
                json = {
                    code: -200,
                    message: '没有找到该资讯，获取失败！请重试！！！'
                }
            } else {
                if (user_id && value[0].favoruserlabel.find({user_id})){ //**需测试，尚未明确是否可以使用 */
                    value[0].like_status = 1;
                } 
                else value[0].like_status = 0;
                json = {
                    code: 200,
                    data: value[0]
                }
            }
            res.json(json)
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
  }
  
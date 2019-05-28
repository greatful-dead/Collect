const moment = require('moment-timezone')
const mongoose = require('../mongoose')
const request = require('request');
const config = require('../config')
const User = mongoose.model('User')
const Label = mongoose.model('Label')
const News = mongoose.model('News')

/**
 * 微信根据code回去用户openId，但这个功能什么时候用呢？ ！！！！！！！！
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
// exports.getWxUser = (req, res) => {
//     const { code } = req.query
//     let urlStr = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.AppID + '&secret=' + config.Secret + '&js_code=' + code + '&grant_type=authorization_code';
//     request(urlStr, (error, response, body)=>{
//         if (!error && response.statusCode == 200) {
//                 let data = JSON.parse(body)
//                 User.findOneAsync({ //查询数据库是否有该用户，有则拿数据，无则创建新用户
//                     openid:data.openid,
//                 })
//                 .then(result => {
//                     if (result) {
//                         res.json({
//                             code: 200,
//                             message: '获取成功',
//                             data: {
//                                 openid:data.openid,
//                                 session_key:data.session_key,
//                             }
//                         })
//                     } else {
//                         User.createAsync({
//                             openid:data.openid,
//                             favoruserlabel: [],
//                             favorusernews: [],
//                             saveusernews: [],
//                         }).then(result=>{
//                             res.json({
//                                 code: 200,
//                                 message: '获取成功',
//                                 data: {
//                                     openid:data.openid,
//                                     session_key:data.session_key
//                                 }
//                             })
//                         })                        
//                     }
//                 })
//                 .catch(err => {
//                     res.json({
//                         code: -200,
//                         message: err.toString(),
//                         data
//                     })
//                 })

//         }else{
//             res.json({
//                 code: -200,
//                 data: error
//             })
//         }
//     })
// }


exports.getWxUser = (req, res) => {
    const { code } = req.query
    console.log("YES!")
    let urlStr = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.AppID + '&secret=' + config.Secret + '&js_code=' + code + '&grant_type=authorization_code';
    request(urlStr, (error, response, body)=>{
        if (!error && response.statusCode == 200) {
            let data = JSON.parse(body)
            console.log(data.openid)
            User.findOneAsync({ //查询数据库是否有该用户，有则拿数据，无则创建新用户
                openid: data.openid,
            })
            .then(result => {
                console.log(result)
                if (result) {
                    console.log('匹配到了')                    
                    res.json({
                        code: 200,
                        message: '获取成功',
                        data: {
                            openid:result.openid,
                            session_key:data.session_key,
                        }
                    })
                } else {
                    console.log(data.openid)
                    User.createAsync({
                        openid:data.openid,
                        //favoruserlabel: [],
                        favorusernews: [],
                        saveusernews: [],
                    }).then(result=>{
                        res.json({
                            code: 200,
                            message: '获取成功',
                            data: {
                                openid:data.openid,
                                session_key:data.session_key
                            }
                        })
                    })                        
                }
            })
            .catch(err => {
                console.log('进入！'+err)
                res.json({
                    code: -200,
                    message: err.toString(),
                    data
                })
            })
                
        }
        else{
            console.log('进入2！')
            res.json({
                code: -200,
                data: error
            })
        }
    })
}





/**
 * 时光机功能
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.TimeMachine = (req,res) => { // **需测试
    const {
        openid, //微信个人的身份识别
        time, //暂且规定1是1天内，2是7天内，3是1个月内
        typ, //看选择的是显示收藏记录-1还是喜爱记录-0
    } = req.body
    const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
    const datecal = moment(datenow);
    if(typ == 0){
        User.find({openid})
        .then(result => {
            if(time == 1){
                const TimeArray = [];
                const newsArray = [];
                TimeArray = result[0].favorusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - TimeArray[j].date, "Africa/Abidjan").format('DD'))<=1){
                        newsArray.push(TimeArray[j].newsid);
                    } 
                }                
                res.json({
                    code: 200,
                    data: newsArray
                })

            }
            if(time == 2){
                const TimeArray = [];
                const newsArray = [];
                TimeArray = result[0].favorusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - TimeArray[j].date, "Africa/Abidjan").format('DD'))<=7){
                        newsArray.push(TimeArray[j].newsid);
                    } 
                }                
                res.json({
                    code: 200,
                    data: newsArray
                })

            }
            if(time == 3){
                const TimeArray = [];
                const newsArray = [];
                TimeArray = result[0].favorusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - TimeArray[j].date, "Africa/Abidjan").format('DD'))<=30){
                        newsArray.push(TimeArray[j].newsid);
                    } 
                }                
                res.json({
                    code: 200,
                    data: newsArray
                })

            }            
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
    }
    if(typ == 1){
        User.find({openid})
        .then(result => {
            if(time == 1){
                const TimeArray = [];
                const newsArray = [];
                TimeArray = result[0].saveusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - TimeArray[j].date, "Africa/Abidjan").format('DD'))<=1){
                        newsArray.push(TimeArray[j].newsid);
                    } 
                }                
                res.json({
                    code: 200,
                    data: newsArray
                })

            }
            if(time == 2){
                const TimeArray = [];
                const newsArray = [];
                TimeArray = result[0].saveusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - TimeArray[j].date, "Africa/Abidjan").format('DD'))<=7){
                        newsArray.push(TimeArray[j].newsid);
                    } 
                }                
                res.json({
                    code: 200,
                    data: newsArray
                })

            }
            if(time == 3){
                const TimeArray = [];
                const newsArray = [];
                TimeArray = result[0].saveusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - TimeArray[j].date, "Africa/Abidjan").format('DD'))<=30){
                        newsArray.push(TimeArray[j].newsid);
                    } 
                }                
                res.json({
                    code: 200,
                    data: newsArray
                })

            }            
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
    }
    else{
        return res.json({
            code: -200,
            message: "错误的输入，不属于时光机的标签！"
        })
    }
}

/**
 * 添加/修改用户喜爱分类 重点在如何返回这个list!!!!
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.editLikeLabel = (req,res) => {
    const {openid,list} = req.body
    User.updateAsync({openid},{"favoruserlabel":list})
    .then(result=>{
        res.json({
            code: 200,
            message: '修改完成',
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
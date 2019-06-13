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
                //console.log(result)
                if (result) {
                    console.log('匹配到了')                    
                    res.json({
                        code: 200,
                        message: '获取成功',
                        data: {
                            openid:result.openid,
                            session_key:data.session_key,
                            key:null, //'ff5c61c75de843af'
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
                                session_key:data.session_key,
                                key:'ff5c61c75de843af'
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
    } = req.query
    console.log("Timemachine");
    console.log(req.query);
    console.log(time)
    console.log(typ)
    console.log(openid)
    const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
    const datecal = moment(datenow);
    if(typ == 0){
        console.log('是喜爱')
        console.log((time == '1'))
        User.find({openid})
        .then(result => {            
            if(time == '1'){
                var TimeArray = [];
                var newsArray = [];
                TimeArray = result[0].favorusernews;
                console.log(TimeArray.length + "lllllll");
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    console.log(parseInt(moment.tz(datecal - TimeArray[j].date, "Africa/Abidjan").format('DD')));
                    if(parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD'))<=1){
                        News.find({_id:TimeArray[j].newsid}).then(res => {
                            // newsArray.push({  
                            //     newsid: TimeArray[j].newsid,
                            //     newsname: res[0].newsname,     //新闻标题
                            //     newscontent: res[0].newscontent, //新闻正文
                            //     newsresource: res[0].newsresource, //新闻来源  
                            //     newsphoto: res[0].newsphoto, //新闻封面 
                            //     newsdate: res[0].newsdate, //新闻日期
                            // });
                            var jsarray = {};  
                            jsarray.newsID = res[0]._id,//TimeArray[j].newsid
                            jsarray.title = res[0].newsname,     //新闻标题newsname
                            jsarray.content = res[0].newscontent, //新闻正文newscontent
                            jsarray.src = res[0].newsresource, //新闻来源newsresource  
                            jsarray.pic = res[0].newsphoto, //新闻封面 newsphoto
                            jsarray.time = res[0].newsdate, //新闻日期                            
                            newsArray.push(jsarray)
                        })
                        
                    } 
                }
                console.log("一日内")
                console.log(res)                 
               

            }
            else if(time == '2'){
                var TimeArray = [];
                var newsArray = [];
                TimeArray = result[0].favorusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD'))<=7){
                        News.find({_id:TimeArray[j].newsid}).then(res => {
                            // newsArray.push({  
                            //     newsid: TimeArray[j].newsid,
                            //     newsname: res[0].newsname,     //新闻标题
                            //     newscontent: res[0].newscontent, //新闻正文
                            //     newsresource: res[0].newsresource, //新闻来源  
                            //     newsphoto: res[0].newsphoto, //新闻封面 
                            //     newsdate: res[0].newsdate, //新闻日期
                            // });
                            var jsarray = {};  
                            jsarray.newsID = res[0]._id,//TimeArray[j].newsid
                            jsarray.title = res[0].newsname,     //新闻标题newsname
                            jsarray.content = res[0].newscontent, //新闻正文newscontent
                            jsarray.src = res[0].newsresource, //新闻来源newsresource  
                            jsarray.pic = res[0].newsphoto, //新闻封面 newsphoto
                            jsarray.time = res[0].newsdate, //新闻日期                            
                            newsArray.push(jsarray)
                        })
                        
                    } 
                }    
                console.log("七日内")
                console.log(newsArray)             
               

            }
            else if(time == '3'){
                var TimeArray = [];
                var newsArray = [];
                TimeArray = result[0].favorusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD'))<=30){
                        News.find({_id:TimeArray[j].newsid}).then(res => {
                            // newsArray.push({  
                            //     newsid: TimeArray[j].newsid,
                            //     newsname: res[0].newsname,     //新闻标题
                            //     newscontent: res[0].newscontent, //新闻正文
                            //     newsresource: res[0].newsresource, //新闻来源  
                            //     newsphoto: res[0].newsphoto, //新闻封面 
                            //     newsdate: res[0].newsdate, //新闻日期
                            // });
                            var jsarray = {};  
                            jsarray.newsID = res[0]._id,//TimeArray[j].newsid
                            jsarray.title = res[0].newsname,     //新闻标题newsname
                            jsarray.content = res[0].newscontent, //新闻正文newscontent
                            jsarray.src = res[0].newsresource, //新闻来源newsresource  
                            jsarray.pic = res[0].newsphoto, //新闻封面 newsphoto
                            jsarray.time = res[0].newsdate, //新闻日期                            
                            newsArray.push(jsarray)
                        })
                        
                    } 
                }
                console.log("七日外")
                console.log(newsArray)                
               

            }          
            setTimeout(function () {
                console.log("七日外") 
                console.log(newsArray)
                res.json({
                    code: 200,
                    content: newsArray
                }) 
                   //JSON.stringify
            }, 1200);   
        })
        .catch(err => {
            return res.json({
                code: -200,
                message: err.toString()
            })
        })
    }
    else if(typ == 1){
        console.log('是收藏')
        console.log(typeof(time))
        var TimeArray = [];
        var newsArray = [];
        console.log(openid + '123123213132132321');
        User.find({openid})        
        .then(result => {
            console.log(result);
            console.log('time is' + time);
            if(time == '1'){
                
                TimeArray = result[0].saveusernews;
                console.log(TimeArray.length + "lllllll");
                //console.log(parseInt(moment.tz(datecal - '2019-05-29 21:30:30', "Africa/Abidjan").format('DD')))
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    //console.log(parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD')) + '       12321312');
                    if(parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD'))<=1){
                        console.log(TimeArray[j].newsid+'123123121111')
                        News.find({_id:TimeArray[j].newsid}).then(res => {
                            console.log('找到新闻库中对应字段');
                            console.log(res[0]._id + '测试');
                            var jsarray = {};  
                            jsarray.newsID = res[0]._id,//TimeArray[j].newsid
                            jsarray.title = res[0].newsname,     //新闻标题newsname
                            jsarray.content = res[0].newscontent, //新闻正文newscontent
                            jsarray.src = res[0].newsresource, //新闻来源newsresource  
                            jsarray.pic = res[0].newsphoto, //新闻封面 newsphoto
                            jsarray.time = res[0].newsdate, //新闻日期                            
                            newsArray.push(jsarray)
                            //console.log(JSON.stringify(newsArray) + '测试1')    
                            //console.log(newsArray) 
                        })
                        console.log("一日内") 
                                          
                        
                        // .catch(err => {
                        //     return res.json({
                        //         code: -200,
                        //         message: err.toString()
                        //     })
                        // })
                    } 
                }
                console.log('666666')
                console.log(newsArray)

            }
            else if(time == '2'){
                // const TimeArray = [];
                // const newsArray = [];
                TimeArray = result[0].saveusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD'))<=7){ // && parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD'))>1
                        News.find({_id:TimeArray[j].newsid}).then(res => {
                            // newsArray.push({  
                            //     newsid: TimeArray[j].newsid,
                            //     newsname: res[0].newsname,     //新闻标题
                            //     newscontent: res[0].newscontent, //新闻正文
                            //     newsresource: res[0].newsresource, //新闻来源  
                            //     newsphoto: res[0].newsphoto, //新闻封面 
                            //     newsdate: res[0].newsdate, //新闻日期
                            // });

                            var jsarray = {};  
                            jsarray.newsID = res[0]._id,//TimeArray[j].newsid
                            jsarray.title = res[0].newsname,     //新闻标题newsname
                            jsarray.content = res[0].newscontent, //新闻正文newscontent
                            jsarray.src = res[0].newsresource, //新闻来源newsresource  
                            jsarray.pic = res[0].newsphoto, //新闻封面 newsphoto
                            jsarray.time = res[0].newsdate, //新闻日期                            
                            newsArray.push(jsarray)
                        })
                        // .catch(err => {
                        //     return res.json({
                        //         code: -200,
                        //         message: err.toString()
                        //     })
                        // })
                    } 
                } 
                console.log("七日内") 
                // console.log(newsArray)                  
                // return res.json({
                //     code: 200,
                //     data: newsArray
                // })

            }
            else if(time == '3'){
                // const TimeArray = [];
                // const newsArray = [];
                TimeArray = result[0].saveusernews;
                for(j = 0,len=TimeArray.length; j < len; j++) {
                    if(parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD'))<=30){ // && parseInt(moment.tz(datecal - moment(TimeArray[j].date), "Africa/Abidjan").format('DD'))>7
                        News.find({_id:TimeArray[j].newsid}).then(res => {
                            // newsArray.push({  
                            //     newsid: TimeArray[j].newsid,
                            //     newsname: res[0].newsname,     //新闻标题
                            //     newscontent: res[0].newscontent, //新闻正文
                            //     newsresource: res[0].newsresource, //新闻来源  
                            //     newsphoto: res[0].newsphoto, //新闻封面 
                            //     newsdate: res[0].newsdate, //新闻日期
                            // });


                            var jsarray = {};  
                            jsarray.newsID = res[0]._id,//TimeArray[j].newsid
                            jsarray.title = res[0].newsname,     //新闻标题newsname
                            jsarray.content = res[0].newscontent, //新闻正文newscontent
                            jsarray.src = res[0].newsresource, //新闻来源newsresource  
                            jsarray.pic = res[0].newsphoto, //新闻封面 newsphoto
                            jsarray.time = res[0].newsdate, //新闻日期                            
                            newsArray.push(jsarray)
                        })
                    } 
                }
                console.log("七日外") 
                console.log(newsArray)
                              
                

            }
            
            setTimeout(function () {
                console.log("七日外") 
                console.log(newsArray)
                res.json({
                    code: 200,
                    content: newsArray //原data
                }) 
                   //JSON.stringify
            }, 1200); 
             
            //console.log(newsArray)
                      
        })
        .catch(err => {
            return res.json({
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
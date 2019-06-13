var mongoose = require('../mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')

var NewsSchema = new Schema({//怎么去设置当一个用户不感兴趣一条新闻，之后的处理
    newsname: String,     //新闻标题
    newscontent: Object, //新闻正文
    newsresource: String, //新闻来源  //暂时觉得不需要！！！
    newsphoto: String, //新闻封面 
    newsurl: String, //新闻网页来源
    newsdate: String, //新闻日期
    adddate: String, //新闻添加日期    
})

var News = mongoose.model('News', NewsSchema)
Promise.promisifyAll(News)
Promise.promisifyAll(News.prototype)

module.exports = News //NewsSchema

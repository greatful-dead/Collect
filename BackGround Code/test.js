const moment = require('moment-timezone')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { scheduleCoupon } = require('./utils')
const mongoose = require('./mongoose')


// body 解析中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// cookie 解析中间件
app.use(cookieParser())

// 引入 mongoose 相关模型
Admin = require('./api/admin-api.js')
// News = require('./models/news')
// Label = require('./models/label')



// 1:测试时间函数的使用
const date = moment().format('YYYY-MM-DD HH:mm:ss');
const date1 = moment(date)
console.log(date);
console.log(date1);
const date2 = moment("2019-05-14 23:00:00") 
console.log(date2);
console.log(parseInt(moment.tz(date1 - date2, "Africa/Abidjan").format('DD'))) //计算时间差，HH时mm分ss秒

// 2:大测试

// var req = {
//     newsname: '111',
//     newscontent: 'dasjhnkfdsajklsa',
//     newsresource: '腾讯',
//     newsphoto: 'https://123.jpg',
//     labelarray: [{}]

// }


var req = {
    label_name: '科技',
}
var res;
Admin.addClass(req, res);

console.log(res);

// var NewsSchema = new Schema({//怎么去设置当一个用户不感兴趣一条新闻，之后的处理
//     //newsid: String,     //唯一标识
//     newsname: String,     //新闻标题
//     newscontent: Object, //新闻正文
//     newsresource: String, //新闻来源
//     newsphoto: String, //新闻封面 
//     newsfavortime: {type:　Number, default: 0},//被喜爱次数
//     newssavetime: {type:　Number, default: 0}, //被收藏次数
//     newsdate: String, //新闻日期
//     adddate: String, //新闻添加日期
//     //is_hot: Boolean, //是否推荐
//     add_user: Number, //添加这条信息的人是谁，1为爬虫程序，2为管理员手动添加
//     favornewslabel: [{
//         labelid: {type:Schema.Types.ObjectId, require: true},
//     }], //新闻附着标签
    
// })
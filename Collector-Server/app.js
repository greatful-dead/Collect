const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { scheduleCoupon } = require('./utils')

// body 解析中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// cookie 解析中间件
app.use(cookieParser())

// 引入 mongoose 相关模型
require('./models/user')
require('./models/news')
require('./models/label')

// 引入 api 路由
const routes = require('./routes/index')
// api 路由
app.use('/api', routes)


//配置服务端口
const server = app.listen(6969, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(host, port);
})

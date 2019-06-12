var mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true },  function(err){
//     if(err){
//         console.log('连接失败');
//     }else{
//         console.log('连接成功');
//     }
// }) //服务器
mongoose.connect('mongodb://controller:cccon@problem-kid.top:20006/app', { useNewUrlParser: true },  function(err){
//mongoose.connect('mongodb://controller:cccon@localhost:20006/app', { useNewUrlParser: true },  function(err){
    if(err){
        console.log('连接失败');
    }else{
        console.log('与服务器的数据库连接成功');
    }
}) //服务器
mongoose.Promise = global.Promise
module.exports = mongoose

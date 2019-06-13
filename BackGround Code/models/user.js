var mongoose = require('../mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')

var UserSchema = new Schema({
    openid: String,     //微信唯一用户标识
    nickname: String,     //昵称
    //userimage: String, //用户头像链接，*这里问一下有必要吗
    // favoruserlabel: [{
    //     labelid: {type: Schema.Types.ObjectId, ref: 'Label'},//标签ID
    //     points: {type: Number, default: 0} //喜爱的程度，当用户喜爱某个新闻，会在对应用户对应喜爱类型的标签里让该字段加1，若该新闻不在喜爱标签里，则会将这个新闻所带的标签加入用户喜爱标签里【询问是否合理】。
    // }], //用户喜爱标签
    //favoruserlabel: Array, //用不到了！！！
    // favorusernews: [{
    //     newsid:{type: Schema.Types.ObjectId, ref: 'News'}, //新闻ID
    //     adddate: {type: String}, //添加日期，便于实现时光机功能 , require:true
    // }],
    favorusernews: Array,
    saveusernews: Array,
    //[{
    //     newsid:{type: Schema.Types.ObjectId, ref: 'News'}, //新闻ID
    //     adddate: {type: String}, //添加日期，便于实现时光机功能 , require:true
    // }]
});

var User = mongoose.model('User', UserSchema)
Promise.promisifyAll(User)
Promise.promisifyAll(User.prototype)

module.exports = User

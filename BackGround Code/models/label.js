var mongoose = require('../mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')

var LabelSchema = new Schema({ //当原来有一些字段和新闻的时候，这个时候新增一个分类，应该要手动添加其相近的标签，再专门写一个程序去把相近标签的新闻放入这个标签中
    //id: {type:　String, require : true},     //唯一标识
    label_name: String,     //标签名称
    //seq: { type: Number, default: 0 }, //用户设置自增ID
    // favoruser:　[
    //     {type:　Schema.Types.ObjectId, ref: 'User', require : true} //用户表的ID关联
    // ], 
    favornews: Array,
    //[{
    //     news:{type: Schema.Types.ObjectId}, //新闻ID , require : true
    //     date:{type: String, ref: 'News'} //添加时间, require : true
    // }],
    relatedlabels: Array,
    //[{
    //     relatedid : {type: Schema.Types.ObjectId} //相近标签ID , require : true
    // }]
})

var Label = mongoose.model('Label', LabelSchema)
Promise.promisifyAll(Label)
Promise.promisifyAll(Label.prototype)

module.exports = Label //LabelSchema

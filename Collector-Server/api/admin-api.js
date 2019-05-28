var multiparty = require('multiparty');/*实现文件上传功能 */
const moment = require('moment') /*处理日期的类库 */
const mongoose = require('../mongoose')/*下方导入一系列模型*/
const User = mongoose.model('User')
// var newsSchema = require('../models/news.js');
// const News = mongoose.model('News', newsSchema)
// var LabelSchema = require('../models/label.js');
// const Label = mongoose.model('Label', LabelSchema)

const Label = mongoose.model('Label')
const News = mongoose.model('News')


/**
 * 添加分类
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.addClass = (req, res) => {
   // const { label_name } = req.body //接受请求中的添加标签的名字
   const {label_name} = req.body
    console.log(label_name);
    console.log("11111111111");
    Label.findOne({label_name})
    .then(result =>{
        let json
        if(result!== null){
            res.json({
                code: -200,
                message: '已有此标签，请重新输入'
            })
        }
        else{
            console.log("22222222222");
            return Label.createAsync({
                label_name
            }).then(result => {
                res.json({
                    code: 200,
                    message: '添加分类成功',
                    data: result._id
                })
                console.log(result._id)
            }).catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                })
            })
        }
    })

    
    // if (!cate_name || !cate_order) {
    //     res.json({
    //         code: -200,
    //         message: '请填写分类名称和排序'
    //     })
    // } else {
    //     return Label.createAsync({
    //         label_name
    //     }).then(result => {
    //         res.json({
    //             code: 200,
    //             message: '添加分类成功',
    //             data: result._id
    //         })
    //         console.log(result._id)
    //     }).catch(err => {
    //         res.json({
    //             code: -200,
    //             message: err.toString()
    //         })
    //     })
    // }
}

// exports.addClass = (req, res) => {
//     const { label_name } = req.body //接受请求中的添加标签的名字
//     console.log("22222222222");
//     return Label.createAsync({
//         label_name
//     }).then(result => {
//         res.json({
//             code: 200,
//             message: '添加分类成功',
//             data: result._id
//         })
//         console.log(result._id)
//     }).catch(err => {
//         res.json({
//             code: -200,
//             message: err.toString()
//         })
//     })
// }   

    

/**
 * 添加新闻
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.addNews = (req, res) => {
    const {
      newsname,
      newscontent, 
      newsresource,
      newsphoto,
      newsdate,
      add_user,
      labelarray //标签的队列
    } = req.body
    
    // const html = marked(content)
   // let arr_label = [];
    const arr_label = labelarray.split('|');
    console.log(arr_label);
    let array_id = [];
    for(i = 0, len = arr_label.length;i<len;i++){
        var labelname = arr_label[i];
        console.log(labelname)
        Label.findOne({label_name:labelname})
       // Label.find({'label_name':{$elemMatch:labelname}})
        .then(result=>{
            console.log(result._id);
            array_id.push(result._id);
            // res.json({
            //     code: 200,
            //     message: "成功找到标签！"
            // })
            console.log("成功找到标签！")
           // console.log(array_id)            
        })
        .catch(err => {
            console.log("dsadsa");
            res.json({
                code: -200,
                message: err.toString()
            })
        })
    }    
    const data = {
        newsname,
        newscontent,
        newsresource,
        newsfavortime: 0,
        newssavetime: 0,
        newsdate,
        newsphoto,
        adddate: moment().format('YYYY-MM-DD HH:mm:ss'),
        add_user,
        // favornewslabel: [{
        favornewslabel:{array_id},
        // }],
        //creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),   
    }
    console.log(array_id)
    console.log("ppppp")
    News.createAsync(data)
    .then(result => {
        //return Category.updateAsync({ _id: arr_category[0] }, { $inc: { cate_num: 1 } }).then(() => {
           // console.log(array_id + "hhhhhhhhh")    
            return res.json({
                code: 200,
                message: '新闻发布成功',
                data: result
            })
        //})
    })
    .catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        })
    })
}
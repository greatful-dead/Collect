const mongoose = require('../mongoose')
const User = mongoose.model('User')

exports.admin = (req, res, next)=>{ //验证管理员权限
    // console.log(req.body)
    return next()
}

exports.user = (req, res, next)=>{ //验证用户是否登录

    const openid = req.query.openid||req.body.openid
    console.log('openid is '+openid)
    console.log('rquey')
    console.log(req.query)
    User.find((err,data)=>{
        console.log(data)
    })
    
    if(!openid){
        return res.json({
            code: -400,
            message: '请登录',
        })
    }

    User.find({ //查询数据库是否有该用户
        openid
    })
    .then(result => {
        console.log('123')
        console.log(result&&openid)
        if (result&&openid) {
            next()
        } else {
            return res.json({
                code: -400,
                message: '不存在该用户',
            })
        }
    })
    .catch(err => {
        res.json({
            code: -200,
            message: err.toString(),
        })
    })
}
/**
 * 管理员相关路由
 */
const express=require('express');
const pool=require('../../pool');
var router=express.Router();
/**
 * API：管理员登录
 * GET /admin/login
 * 请求数据：{aname:'xxx',apwd:'xxx'}
 * 完成用户登录验证（提示：有些项目中此处选择POST请求）
 * 返回数据：{code:200,msg:'login succ'}
 * {code:400,msg:'aname or apwd err'}
 */
router.get('/login/:aname/:apwd',(req,res)=>{
    var aname=req.params.aname;
    var apwd=req.params.apwd;
    pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[aname,apwd],(err,result)=>{
        if(err) throw err;
        console.log(result.length>0)
        if(result.length>0){ //查询到一行数据，登陆成功
            res.send({code:200,msg:'login succ'})
        }else{//没有查询到数据
            res.send({code:400,msg:'aname or apwd err'})
        }
    })    
})
 /**
 * API：管理员登录
 *PATCH /admin
 * 根据管理员名和密码修改管理员密码
 * 请求数据：{aname:'xxx',oldPwd:'xxx',newPwd:'xxx'}
 * 返回数据：{code:200,msg:'modified succ'}
 * {code:400,msg:'aname or apwd err'}
 * {code:401,msg:'apwd not modified'}
 */
router.patch('/',(req,res)=>{
    var data=req.body;
    //首先根据aname oldPwd 查询该用户是否存在
    pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[data.aname,data.oldPwd],(err,result)=>{
        if(err) throw err;
        if(result.length==0){
            res.send({code:400,msg:'aname or apwd err'});
            return;
        }
        //如果查询到用户，再修改密码
        pool.query('UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?',[data.newPwd,data.aname],(err,result)=>{
            if(err) throw err;
            if(result.changedRows>0){
                res.send({code:200,msg:'password succ'})
            }else{
                res.send({code:401,mag:'pwd not modidfied'})
            }
        })
    })   
})
module.exports=router;
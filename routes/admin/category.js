/**
 * 菜品类别相关的路由
 */
//创建路由器
const express=require('express');
const pool=require('../../pool');
var router=express.Router();
/**
 * GET admin/category
 * 含义：客户端获取的所有菜品的类别，按编号升序排列
 * 返回值形式：
 * [{cid:1,cname:'},{}...]
 */
router.get('/',(req,res)=>{
    pool.query('SELECT * FROM xfn_category ORDER BY cid',(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
 /**
 * DELETE admin/category:cid
 * 含义：根据表示菜品编号的路由参数，删除该菜品
 * 返回值形式：
 * {code:200,msg:'1 category deleted'}
 * {code:400,msg:'0 category deleted'}
 */
router.delete('/:cid',(req,res)=>{
    //注意：删除菜品类别前必须把属于改类别的菜品的类别编号设置位NULL
    var cid=req.params.cid;
    pool.query('UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?',cid,(err,result)=>{
        if(err) throw err;
        //至此制定类别的菜品已经修改完毕
        pool.query('DELETE FROM xfn_category WHERE cid=?',cid,(err,result)=>{
            if(err) throw err;
            //获取delete语句在数据库中影响的行数
            if(result.affectRows>0){
                res.send({code:200,msg:'1 category deleted'})
            }else{
                res.send({code:400,msg:'0 category deleted'})
            }        
        } )
    })    
    
})
 /**
 * PUT admin/category
 * 请求参数{cid:xx,cname:'xxx'}
 * 含义：根据菜品类别编号修改该类别
 * 返回值形式：
 * {code:200,msg:'1 category modified'}
 * {code:400,msg:'0 category modified,not exists'}类别不存在
 * {code:401,msg:'0 category modified,not modified'}类别存在
 */
router.put('/',(req,res)=>{
    var data=req.body;//请求数据{cid:xx,cname:'xx'}    
    //todo:此处可以对数据进行验证
    pool.query('UPDATE xfn_category SET ? WHERE cid=?',[data,data.cid],(err,result)=>{
        if(err) throw err;        
        if(result.changedRows>0){
            res.send({code:200,msg:'1 category modified'})
        }else if(result.affectRows==0){
            res.send({code:400,msg:'category not exits'})
        }else if(result.affectRows==1 && result.changedRows==0){
            res.send({code:401,msg:'no categary modified'})
        }        
    })
})
 /* 
*API: POST /admin/category/
*请求参数：{cname:'xxx'}
*含义：添加新的菜品类别
*返回值形如：
*{code:200,msg:'1 category added',cid:x}
*/
router.post('/',(req,res)=>{   
    var data=req.body;
    pool.query('INSERT INTO xfn_category SET ?',data,(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
module.exports=router;
















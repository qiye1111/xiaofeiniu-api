/**
 * 桌台相关路由
 */
const express=require('express');
const pool=require('../../pool');
var router=express.Router();
/**
 * GET /admin/table
 * 获取所有的全局桌台信息
 *
 */
router.get('/',(req,res)=>{
    pool.query('SELECT * FROM xfn_table ORDER BY tid',(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


module.exports=router;
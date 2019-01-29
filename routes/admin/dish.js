/**
 * 菜品相关路由
 */
const express=require('express');
const pool=require('../../pool');
//引入multer中间件
const multer=require('multer');
var upload=multer({dest:'tmp/'})//指定客户端上传文件的临时储存路径
const fs=require('fs');
var router=express.Router();
/**
 * API：GET /admin/dish
 * 获取所有菜品分类（按类别分类）
 * 返回数据：
 * [
 * {cid:1,cname:'肉类'，dishList:[{},{},{},....]}
 * {cid:2,cname:'蔬菜'，dishList:[{},{},{},....]}
 * ...
 * ] 
 */
router.get('/',(req,res)=>{
    //查询所有菜品的类别
    pool.query('SELECT cid,cname FROM xfn_category ORDER BY cid',(err,result)=>{
        if(err) throw err;
        var count=0;
        var categoryList=result; //类别列表
        console.log(categoryList)
        for(let c of categoryList){
            var categoryId=c.cid;            
            pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC',categoryId,(err,result)=>{
                if(err) throw err;                                             
                c.dishList=result;                 
                //必须保证所有的类别下的菜品都查询完成才能发送响应消息--这些查询都是异步执行              
                count++;
                if(count==categoryList.length){
                    res.send(categoryList)
                }
            })
        }
    })
})
/**
 * POST /admin/dish/image
 * 请求参数：
 * 接收客户端上传的菜品图片，保存在服务器上，返回该图片在服务器上的随机文件名
 * 响应数据：{code:200,msg:'upload sicc' ,fileName:'13512873612-2324.jpg'}
 */
//定义路由，使用上传文件
router.post('/image',upload.single('dishImg'),(req,res)=>{
    //console.log(req.file) //客户端上传的文件
    //console.log(req.body)//客户端随同图片提交的字符数据
    //把客户端上传的问价从临时目录下转移到永久的图片路径下
    var tmpFile=req.file.path;
    var suffix=req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
    var newFile=randFileName(suffix);
    fs.rename(tmpFile,'img/dish/'+newFile,()=>{
        res.send({code:200,msg:'upload succ',fileName:newFile})
    })//把文件重命名，把临时问价转
})

//生成一个随机文件名
//参数：suffix表示要生成的文件名中的后缀
function randFileName(suffix){
    var time=new Date().getTime();
    var num=Math.random()*(9000)+1000;
    return time+'-'+num+suffix
}
 /**
 * POST /admin/dish
 * 请求参数：{title:'xx',imgUrl:'..jpg',price:xx,detail:'xx..',categoryId:xx}
 * 添加新的菜品
 * 输出消息：{code:200,msg:'dish added succ',dishId:46}
 */
router.post('/',(req,res)=>{
    var data=req.body;
    pool.query('INSERT INTO xfn_dish SET ?',data,(err,result)=>{
        if(err) throw err;
        res.send({code:200,msg:'dish added succ',dishId:result.insertId})//将insert语句的自增编号传给客户端
    })
})

/**
 * DELETE /admin/dish/:did
 * 根据菜品编号删除该菜品
 * 输出数据{code：200，msg：'dish deleted succ'}
 * {code:400,msg:'dish not exists'}
 * 获取数据后进行数据检查
 */
router.delete('/',(req,res)=>{

})

 /**
  * put /admin/dish
  * 请求参数：{dish:xx,title:'xx',imgUrl:'..jpg',price:'xx',detail:'xxx',categoryId:xx}
  * 根据指定的菜品编号修改菜品
  * 输出数据：{code:200,msg:'dish updated succ'}
  * {code:400,msg:'dish not exists'}
  */
module.exports=router;
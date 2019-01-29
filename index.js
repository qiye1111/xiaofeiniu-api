/**
 * 小肥牛扫码点餐项目API子系统
 */
const PORT=8090;
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');

const categoryRouter=require('./routes/admin/category')
const adminRouter=require('./routes/admin/admin')
const dishRouter=require('./routes/admin/dish')

//启动主服务器
var app=express();
app.listen(PORT,()=>{
    console.log('Sever Listening '+PORT+'...')
});

//使用中间件
app.use(cors());
//app.use(bodyParser.urlencoded({}))//把application/x-www-form-urlencoded
app.use(bodyParser.json());
//挂载路由器
app.use('/admin/category',categoryRouter)
app.use('/admin',adminRouter)
app.use('/admin/dish',dishRouter)

const app=require('./app')
const port = process.env.PORT
//-----------------------------------------
app.listen(port,()=>{
    console.log('server up on port '+port)
})




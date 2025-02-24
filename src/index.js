//EXPRESS SERVER START
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter= require('./routers/task')
//const maintenance = require('./middleware/maintenance')

const app=express()
const port = process.env.PORT

//maintenance()

//automatically parse json objects
app.use(express.json())

//router links
app.use(userRouter)
app.use(taskRouter)
 
//-----------------------------------------
app.listen(port,()=>{
    console.log('server up on port '+port)
})




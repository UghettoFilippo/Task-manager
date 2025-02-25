//EXPRESS SERVER START
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter= require('./routers/task')

//const maintenance = require('./middleware/maintenance')

const app=express()

//maintenance()

//automatically parse json objects
app.use(express.json())

//router links
app.use(userRouter)
app.use(taskRouter)
 
module.exports=app




//EXPRESS SERVER START

const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app=express()
const port = process.env.port || 3001

//automatically parse json objects
app.use(express.json())

//POST to <localhost:3001/users> User creation endpoint
app.post('/users',(req,res)=>{
    const user = new User(req.body)

    user.save().then(()=>{
        res.send(user)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

app.post('/tasks',(req,res)=>{
    const task = new Task(req.body)

    task.save().then(()=>{
        res.send(task)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})


//-----------------------------------------
app.listen(port,()=>{
    console.log('server up on port '+port)
})
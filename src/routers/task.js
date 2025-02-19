const express=require('express')
const router= new express.Router()
const Task = require('../models/task')

//POST to <localhost:3001/tasks> Task creation endpoint
router.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)

    try{
         await task.save()
         res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})


//GET to <localhost:3001/tasks> Tasks read 
router.get('/tasks',async (req,res)=>{

    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


//GET to <localhost:3001/tasks/:id> Task read by Id endpoint
router.get('/tasks/:id',async (req,res)=>{
    const _id = req.params.id

    try {
        const task = await Task.findById(_id) 
        if(!task){
            return res.status(404).send('Not Found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


//PATCH to <localhost:3001/tasks/:id> update task endpoint
router.patch('/tasks/:id',async (req,res)=>{
    const _id = req.params.id

    const allowedUpdates=['description','completed']
    const updates=Object.keys(req.body)
    const isValid=updates.every((update)=>{return allowedUpdates.includes(update)})

    if(!isValid){
        return res.status(400).send('invalid updates')
    }
    try {
        const task= await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//DELETE to <localhost:3001/tasks/:id> delete task endpoint
router.delete('/tasks/:id',async (req,res)=>{
    const _id = req.params.id

    try {
        const task = await Task.findByIdAndDelete(_id)
        if(!task){
            return res.status(404).send('Not Found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports=router
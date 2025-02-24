const express=require('express')
const router= new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//POST to <localhost:3001/tasks> Task creation endpoint
router.post('/tasks',auth,async (req,res)=>{ 
    
    const task = new Task({
        ...req.body,
        owner: req.user.id
    })

    try{
         await task.save()
         res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})


//GET /tasks?completed=true (o false)
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async (req,res)=>{
   const match = {}
   const sort = {}

   if(req.query.completed){
    match.completed = req.query.completed === 'true'
   }
   
   if(req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1]==='desc'? -1:1
   }

    try {
       await req.user.populate({
        path:'tasks',
        match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
       })
       res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


//GET to <localhost:3001/tasks/:id> Task read by Id endpoint
router.get('/tasks/:id',auth,async (req,res)=>{
const _id = req.params.id
    try {
        const task = await Task.findOne({_id,owner:req.user._id}) 
        if(!task){
            return res.status(404).send('Not Found')
        }
        res.send(task)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


//PATCH to <localhost:3001/tasks/:id> update task endpoint
router.patch('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id

    const allowedUpdates=['description','completed']
    const updates=Object.keys(req.body)
    const isValid=updates.every((update)=>{return allowedUpdates.includes(update)})

    if(!isValid){
        return res.status(400).send('invalid updates')
    }
    try {

        const task = await Task.findOne({_id,owner:req.user._id})
        
        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update)=>task[update]=req.body[update])
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//DELETE to <localhost:3001/tasks/:id> delete task endpoint
router.delete('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send('Not Found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports=router
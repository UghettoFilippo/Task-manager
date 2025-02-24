const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const {sendGBemail,sendWelcomeEmail} = require('../emails/account')


//POST to <localhost:3001/users> User creation endpoint
router.post('/users',async (req,res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token= await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e.message)
    }
})


//LOGIN
router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

//LOGOUT
router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        console.log('Logged out')

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//GLOBAL LOGOUT
router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        console.log('all tokens removed')
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//GET to <localhost:3001/users> Users read endpoint
router.get('/users/me',auth,async (req,res)=>{

    res.send(req.user)
})


//PATCH to <localhost:3001/users/:id> update user endpoint
router.patch('/users/me',auth, async (req,res)=>{

    const allowedUpdates=['name','email','password','age']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=>{return allowedUpdates.includes(update)})

     if(!isValid){
        return res.status(400).send('invalid updates ')
     }

    try {
       
        const user =req.user

        updates.forEach((update)=>user[update] = req.body[update])

        await user.save()

             res.send(user)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


//DELETE to <localhost:3001/users/:id> delete user endpoint
router.delete('/users/me',auth,async (req,res)=>{
    
    try {
        await req.user.deleteOne()
        sendGBemail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

//upload di un file
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            return callback(new Error('Please upload an image'))
        }

        callback(undefined,true)
}
})

// POST x aggiungere avatar all'utente
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
 
    const buffer = await sharp(req.file.buffer).resize(250,250).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//DELETE x eliminare avatar dall'utente
router.delete('/users/me/avatar',auth,async (req,res)=>{
   
        req.user.avatar=undefined
        await req.user.save()
        res.send()
})

//GET x restituire l'avatar di un utente by id
router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user= await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports=router
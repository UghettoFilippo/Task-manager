const mongoose=require('mongoose')
const jwt = require('jsonwebtoken')
const User =require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne={
    _id:userOneId,
    name:'shrek',
    email:'shrek@sh.it',
    password:'Abcd1234',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo={
    _id:userTwoId,
    name:'fiona',
    email:'fiona@fi.it',
    password:'Abcd1234',
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id:new mongoose.Types.ObjectId(),
    description:'taskone test',
    completed:false,
    owner:userOne._id
}

const taskTwo = {
    _id:new mongoose.Types.ObjectId(),
    description:'tasktwo test',
    completed:true,
    owner:userOne._id
}

const taskThree = {
    _id:new mongoose.Types.ObjectId(),
    description:'taskthree test',
    completed:true,
    owner:userTwo._id
}

const setupDb = async ()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports={
    userOneId,
    userOne,
    setupDb,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
}
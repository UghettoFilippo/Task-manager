const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    autoIndex:true
})

/* const User = mongoose.model('User',{
    name:{
        type:String,
        required:true,
        trim:true //no spazi bianchi
    },
    email:{
        type:String,
        required:true,

        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('-- INVALID E-MAIL --')
            }
        },

        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('-- PASSWORD CANT BE PASSWORD --')
            }
        }
    },
    age:{
        type:Number,
        min:[0,'-- AGE CANT BE NEGATIVE --'],
        max:[100,'-- YOU SHOULD BE DEAD --']
    }
})

const me=new User({
    name:'Il Bellissimo',
    email:'wappappa@gmail.com',
    password:'password',
    age:13
})

me.save().then(()=>{
    console.log(me)
}).catch((error)=>{
    console.log('error',error)
}) */

const Task = mongoose.model('Task',{
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    
})

const t= new Task({
    description:"calarla  ",
    completed:true
})

t.save().then(()=>{
    console.log('success',t)
}).catch((error)=>{
    console.log(error)
})


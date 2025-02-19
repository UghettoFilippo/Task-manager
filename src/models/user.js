const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',{
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

module.exports= User
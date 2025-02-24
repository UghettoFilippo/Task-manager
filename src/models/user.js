const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true //no spazi bianchi
    },
    email:{
        type:String,
        required:true,
        unique:true,
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
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
}
)

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to log in - not in the list')
    }

    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to log in - wrong password')
    }

    return user
}

userSchema.methods.toJSON =function (){
    const user = this 
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET,{expiresIn:'24h'})

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

//hash the plain text password before saving
userSchema.pre('save',async function (next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('deleteOne',{document:true},async function (next){
    const user = this

    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports= User
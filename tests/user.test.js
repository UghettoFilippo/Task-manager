const request = require('supertest')
const app=require('../src/app')
const User =require('../src/models/user')
const jwt=require('jsonwebtoken')
const mongoose = require('mongoose')
const {userOne,userOneId,setupDb} = require('./fixtures/db')


beforeEach(setupDb)

//TEST FOR CREATE USER
test('Should sign up a new user',async ()=>{
   const response= await request(app)
    .post('/users')
    .send({
        name:'paolo',
        email:'paolo@paoli.it',
        password:'mypass123'
    })
    .expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name:'paolo',
            email:'paolo@paoli.it'
        },
        token:user.tokens[0].token
    }) 
    expect(user.password).not.toBe('mypass123')
})

//TEST FOR LOGIN
test('should login an user',async ()=>{
    const response =await request(app)
    .post('/users/login')
    .send({
        email:userOne.email,
        password:userOne.password
    })
    .expect(200)

    const user= await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

//TEST FOR WRONG LOGIN
test('Shouldnt login a not exixtent user',async ()=>{
    await request(app)
    .post('/users/login')
    .send({
        name:'abcd@efg.it',
        password:'abcdefg'
    })
    .expect(400)
})

//TEST FOR GET USER
test('should get profile for user',async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization','Bearer '+userOne.tokens[0].token)
    .send()
    .expect(200)
})

//TEST FOR GET USER WITHOUT AUTH
test('Should not get profile for unhautenticated users',async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

//TEST FOR DELETE USER
test('should delete account for user', async ()=>{
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization','Bearer '+userOne.tokens[0].token)
    .send()
    .expect(200)

    const user = await User.findById(userOne.id)
    expect(user).toBeNull()
})

//TEST FOR DELETE USER WITHOUT AUTH
test('Should not delete an account without auth', async ()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

//TEST FOR UPLOADING AVATAR IMAGE
test('should upload avatar images', async ()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', 'Bearer '+userOne.tokens[0].token)
    .attach('avatar','tests/fixtures/carabiniere.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

//TEST FOR UPDATE VALID FIELDS
test('should update valid user fields', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', 'Bearer '+userOne.tokens[0].token)
    .send({
        name:'userTest'
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('userTest')
})

//TEST FOR NOT  UPDATE INVALID FIELDS
test('should not update invalid user fields', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', 'Bearer '+userOne.tokens[0].token)
    .send({
        location:'Napule'
    })
    .expect(400)
})
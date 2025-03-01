const request=require('supertest')
const Task = require('../src/models/task')
const app=require('../src/app')
const {userOne,
    userOneId,
    setupDb,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
} = require('./fixtures/db')

beforeEach(setupDb)

test('should create task for user', async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization','Bearer '+userOne.tokens[0].token)
    .send({
        description:'test task'
    })
    .expect(201)
    const task  = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    //expect(task.completed).toEqual(false)
})

test('should not delete other users task', async ()=>{
    const  response=await request(app)
    .delete('/tasks/'+taskOne._id)
    .set('Authorization','Bearer '+userTwo.tokens[0].token)
    .send()
    .expect(404)
})

test('should elete user task', async ()=>{
    await request(app)
    .delete('/tasks/'+taskTwo._id)
    .set('Authorization','Bearer '+userOne.tokens[0].token)
    .send()
    .expect(200)
})
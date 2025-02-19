const {MongoClient,ObjectId} = require('mongodb')


const uri = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(uri)

        //crea DB task manager
        const database=client.db('task-manager')

        //crea collection USERS e TASKS
        const users = database.collection('users')
        const tasks = database.collection('tasks')


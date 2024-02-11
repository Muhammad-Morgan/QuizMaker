const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

const Members = require('./models/membersModel')
const Quizez = require('./models/quizez')
const Result = require('./models/results')

const app = express()

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.URI)
mongoose.connection.once('open', () => console.log('Connected to MongoDB'))

app.get('/', (req, res) => {
    res.send("Hello Again!")
})
app.get('/getuserresult/:id', (req, res) => {
    const { id } = req.params
    Result.findOne({ myID: id }).then((result) => {
        res.json(result)
    }).catch(err => console.log(err))
})
app.get('/checkuser', (req, res) => {
    LoggedUsers.find().then((result) => {
        if (result.length === 0) {
            res.json('No one is logged in')
        }
        if (result.length > 0) {
            res.json(result)
        }
    }).catch(err => console.log(err))
})
app.get('/getsinglequiz', (req, res) => {
    Quizez.findById(req.query.id).then((result) => res.json(result)).catch(err => console.log(err))
})
app.get('/getallquizez', (req, res) => {
    Quizez.find().then((result) => res.json(result)).catch(err => console.log(err))
})
app.get('/getaquiz', (req,res)=>{
    const {id} = req.query
    Quizez.findById(id).then((result)=>{
        res.json(result)
    }).catch(err=>console.log(err))
})
app.get('/filterquizname',(req,res)=>{
    const {quizname}=req.query
    Quizez.find().then((result)=>{
        var newQuizes = result.filter((quiz)=>{
            if(quiz?.name?.includes(quizname)){
                return quiz
            }
        })
        res.json(newQuizes)
    }).catch(err=>console.log(err))
})
app.get('/filterauthorname',(req,res)=>{
    const {authorname}=req.query
    Quizez.find().then((result)=>{
        var newQuizes = result.filter((quiz)=>{
            if(quiz?.creatorName?.includes(authorname)){
                return quiz
            }
        })
        res.json(newQuizes)
    }).catch(err=>console.log(err))
})
app.post('/register', (req, res) => {
    const { newInfo } = req.body
    Members.create(newInfo).then(() => res.json('Registered Successfully')).catch((err) => res.json(err))
})
app.post('/submitquiz', (req, res) => {
    const { id, userID } = req.query
    Quizez.findById(id).then((result) => {
        var finalRes = []
        var mistakes = []
        var results = result.quiz.map((items, index) => {
            if (items.answer === req.body[index].answer) {
                finalRes.push(items)
            } else { mistakes.push(items) }

            return items
        })
        var finalResult = finalRes.length * 10
        LoggedUsers.findOne({ myID: userID }).then((user) => {
            const { name } = user
            Result.create({ finalResult, mistakes, name, quizName: result.name, myID: userID })
            res.json('done!')
        })
    }).catch(err => console.log(err))
})
app.post('/login', (req, res) => {
    const { userInfo } = req.body
    Members.find().then((resultMany) => {
        var emailStep = resultMany.filter((user) => user.email === userInfo.email)
        var passwordStep = emailStep.find((user) => user.password === userInfo.password)
        console.log(passwordStep)
        const { myID, name } = passwordStep
        LoggedUsers.create({ myID, name }).then(() => {
            LoggedUsers.findOne({ myID: myID }).then((result) => res.json(result)).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch((err) => res.json(err))
})
app.post('/quizcreated/:id', (req, res) => {
    const { name, quiz } = req.body
    const { id } = req.params
    LoggedUsers.findOne({ myID: id }).then((result) => {
        var newR = result.name.toLowerCase()
        Quizez.create({ name, quiz, userID: id, creatorName: newR }).then(() => {
            res.json('quiz created')
        }).catch(err => console.log(err))
    })
})
app.post('/createquiz', (req, res) => {
    Quizez.create(req.body).then(() => res.json('success')).catch(err => console.log(err))
})
app.put('/addquestion', (req, res) => {
})
app.delete('/forcelogout', (req, res) => {
    LoggedUsers.deleteMany().then(() => res.json('session expired!')).catch(err => console.log(err))
})
app.delete('/logout/:id', (req, res) => {
    const { id } = req.params;
    LoggedUsers.find().then((result) => {
        var newResult = result.find((user) => user.myID === id)
        if (newResult) {
            LoggedUsers.findOneAndDelete({ myID: id }).then(() => res.json('logged out')).catch(err => console.log(err))
        } else {
            res.json('already logged out')
        }
    }).catch(err => console.log(err))
})
app.listen(5000, () => console.log('Listen on 5000'))

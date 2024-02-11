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

app.use(cors({
    origin: ['https://quiz-maker-client.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

mongoose.connect('mongodb+srv://muhammad:helloworld123@jobster.r7jsbjp.mongodb.net/quiz?retryWrites=true&w=majority')
mongoose.connection.once('open', () => console.log('Connected to MongoDB'))

app.get('/', (req, res) => {
    res.send("Hello Again!")
})
app.delete('/logout', (req, res) => {
    res.json({ msg: 'Logged Out', type: 'success' })
})
app.get('/auth', (req, res) => {
    const { token } = req.query
    if (!token) {
        res.json({ msg: 'log in again', type: 'failed' })
    } else {
        jwt.verify(token, 'SECRET%msg%', (err, decode) => {
            if (err) return res.json({ msg: 'log in again', type: 'failed' })
            return res.json({ myToken: token, type: 'success' })
        })
    }
})
app.get('/getallquizez', (req, res) => {
    Quizez.find().then((result) => res.json(result)).catch(err => console.log(err))
})
app.get('/filterquizname', (req, res) => {
    const { quizname } = req.query
    Quizez.find().then((result) => {
        var newResult = result.filter((item) => item.name.includes(quizname))
        res.json(newResult)
    }).catch(err => console.log(err))
})
app.get('/filterauthorname', (req, res) => {
    const { authorname } = req.query
    Quizez.find().then((result) => {
        var newResult = result.filter((item) => item.creatorName.includes(authorname))
        res.json(newResult)
    }).catch(err => console.log(err))
})
app.get('/getsinglequiz', (req, res) => {
    const { id } = req.query
    Quizez.findById(id).then((result) => res.json(result)).catch(err => console.log(err))
})
app.get('/getuserresult', (req, res) => {
    const { myID } = req.query
    Result.findOne({ myID }).then((result) => res.json(result)).catch(err => console.log(err))
})
app.post('/submitquiz', (req, res) => {
    const { id, userID, username } = req.query
    const answerArray = req.body
    Quizez.findById(id).then((result) => {
        var newResult = result.quiz.map((item, index) => {
            if (item.answer === answerArray[index].answer) {
                return item
            }
        })
        var mistake = result.quiz.map((item, index) => {
            if (item.answer !== answerArray[index].answer) {
                return item.question
            }
        })
        var mistakes = mistake.filter((item) => item !== undefined)
        var finalResult = newResult.filter((item) => item !== undefined)
        Result.create({ finalResult: finalResult.length, quizName: result.name, myID: userID, name: username, mistakes }).then(() => res.json({ msg: 'quiz was submitted', type: 'success' })).catch(err => console.log(err))
    }).catch(err => console.log(err))
})
app.post('/register', (req, res) => {
    const { newInfo } = req.body
    const { myID, name, email, password, type } = newInfo
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            Members.create({
                myID,
                name,
                email,
                password: hash,
                type
            }).then(() => {
                const token = jwt.sign({ myID, name, type }, 'SECRET%msg%', { expiresIn: '1h' })
                res.json({
                    token,
                    msg: 'registered successfully',
                    type: 'success'
                })
            }).catch(error => console.log(error))
        });
    });
})
app.post('/login', (req, res) => {
    const { userInfo } = req.body
    const { email, password } = userInfo
    Members.findOne({ email }).then((result) => {
        if (result === null) return res.json({ msg: 'no users...', type: 'danger' })
        bcrypt.compare(password, result.password).then((resultCondition) => {
            if (resultCondition === true) {
                const token = jwt.sign({ myID: result.myID, name: result.name, type: result.type }, 'SECRET%msg%', { expiresIn: '1h' })
                res.json({
                    token,
                    msg: 'Logged In Successfully',
                    type: 'success'
                })
            } else {
                res.json({
                    msg: 'Wrong password',
                    type: 'danger'
                })
            }
        })
    }).catch(err => console.log(err))
})
app.post('/quizcreated/:myID', (req, res) => {
    const { myID } = req.params
    Members.findOne({ myID }).then((re) => {
        const creatorName = re.name
        const { name, quiz } = req.body
        Quizez.create({ userID: myID, name, quiz, creatorName }).then(() => res.json({ msg: 'quiz created !', type: 'success' })).catch(err => console.log(err))
    })
})
app.listen(5000, () => console.log('Listen on 5000'))

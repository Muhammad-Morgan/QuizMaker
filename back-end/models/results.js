const mongoose = require('mongoose')

const ResultSchema = new mongoose.Schema(
    {
        finalResult: Number,
        mistakes: [],
        name: String,
        myID: String,
        quizName: String
    }
)

Result = mongoose.model('Result',ResultSchema)

module.exports = Result
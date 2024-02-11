const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema(
    {
        name: String,
        userID: String,
        creatorName: String,
        quiz: [
            {
                question: String,
                answer: Boolean
            }
        ]
    }
)

Quizez = mongoose.model('Quizez', QuizSchema)

module.exports = Quizez
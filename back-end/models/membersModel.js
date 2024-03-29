const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
    myID: String,
    name: String,
    email: String,
    password: String,
    type: String
})

const Members = mongoose.model('Members',MemberSchema)

module.exports = Members;
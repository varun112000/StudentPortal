const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Name : { type: String, required: true },
    Number : { type: Number, required: true },
    Email : { type: String, required: true },
    Password : { type: String, required: true }
})
const model = mongoose.model("User",UserSchema)

module.exports = model
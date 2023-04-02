// import mongoose from 'mongoose';
mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique: true,
    },
    password: {
        type:String,
        required:true,
    },
    // date: {
    //     type:Date,
    //     default:date.now(),
    // }
  },{ collection: 'User' });

User = mongoose.model('user', UserSchema);
// User.createIndexes();
module.exports = User
var env = require('dotenv').config();

//connection to mongoo
const mongoose = require('mongoose');

//URI to get and pass data to
const mongoURI = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@flipkart.qa0xu4z.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`

const connectToMongo = async () => {
    await mongoose.connect(mongoURI)
    console.log("Connected to Mongo successfully");
}

//exporting the 'connectToMongo'
module.exports = connectToMongo;

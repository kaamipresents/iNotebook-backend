const serverless = require('serverless-http');
var env = require('dotenv').config();
// const serverless = require('serverless-http')

//Connecting to Database
    //importing function from 'db.js' file
    const connectToMongo = require('./db');
    //running the imported function
    connectToMongo();

//Importing and Setting up ExpressJsApp
    //importing    
    var express = require('express');
    var cors = require('cors');

    //Setting up
    const app = express();
    app.use(express.json());
    app.use(cors());

//Available Routes
//this is done to avoid defining all the routes here and instead link to the routes defined in different files separately

//importing the routes middleware
const home = require('./functions/home')
const auth = require('./functions/auth')
const notes = require('./functions/notes')

//endpoints
app.use('/',home)
app.use('/api/auth',auth)
app.use('/api/notes',notes)

//port declaring
const port = process.env.PORT || 9000

app.listen(port,() => {
  console.log(`iNotebook backend on port ${port}`)
})

module.exports.handler = serverless(app) ;
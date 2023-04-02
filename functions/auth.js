const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

router.post(
  "/createuser",
  [
    // email must be an email
    body("name","Name length must be minimum 3").isLength({ min: 3 }),
    // email must be an email
    body("email","Not a Valid Email").isEmail(),
    // password must be at least 5 chars long
    body("password","Password length must be minimum 5").isLength({ min: 5 }),
  ],
  async (req, res) => {

    //success variable
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //before sending request check if user already exists or not
      let user = await User.findOne({email: req.body.email});
    if(user){
      success = false;
      return res.status(400).json({error:"User with this email already exists"})
    }

    //securing the password before passing to the database
    const salt = await bcrypt.genSalt(10); //it returns promise
    const secPass = await bcrypt.hash(req.body.password,salt); //it returns promise

    //now create a user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })

    //for better communication between client and server, JSON WEB TOKEN will be created based on the user ID
    const JSNWEBTOKEN_SEC = "secure#$%" //this key is protection layer
    const JWT_data = {
      user:{
        id: user.id
      }
    }
    var token = jwt.sign(JWT_data, JSNWEBTOKEN_SEC);
    success = true;
    res.json({token: token, success: success})

    console.log(req.body);
    } catch (error) {
      success = false;
      return res.status(500).json({error:error.message})
    }
    
    // });
  }
);

//ROUTE TO LOGIN AN EXISTING USER
router.post(
  "/loginuser",
  [
    // email must be an email
    body("email","Enter correct Email").isEmail(),
    // password must be at least 5 chars long
    body("password","Password cannot be blank").exists(), //this means some password is entered
  ],
  async (req, res) => {

    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //before sending request to the database check if user already exists or not
      let user = await User.findOne({email: req.body.email});
    if(!user){
      return res.status(400).json({error:"Please enter correct credentials"})
    }

    const passComp = await bcrypt.compare(req.body.password,user.password)
    if (!passComp) {
      return res.status(400).json({error:"Please enter correct credentials"})
    }

    //for better communication between client and server, JSON WEB TOKEN will be created based on the user ID
    const JSNWEBTOKEN_SEC = "secure#$%" //this key is protection layer
    const JWT_data = {
      user:{
        id: user.id
      }
    }
    var token = jwt.sign(JWT_data, JSNWEBTOKEN_SEC);
      success = true;
      res.json({success:success, token: token})
      console.log("User Logged In Successfully");

    } catch (error) {
      return res.status(500).json({error:error.message})
    }
    // });
  }
);


//ROUTE TO GET DETAILS OF USER
router.get(
  "/userdetails", fetchuser, 
  async (req, res) => {

    try {
    userID = req.user.id;
    user = await User.findById(userID).select("-password");
    } catch (error) {
      return res.status(500).json("Internal Server Error")
    }
      res.json(user)
      console.log("User details has been retrieved successfully");
    // });
  }
);

module.exports = router;


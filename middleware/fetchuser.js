const jwt = require('jsonwebtoken');
const JSNWEBTOKEN_SEC = "secure#$%" //this key is protection layer

const fetchuser = (req,res,next) =>{
    //getting logged in user token from his/her request header 
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ errors: "Please authenticate a valid token" });
    }
    try {
      const data =  jwt.verify(token, JSNWEBTOKEN_SEC);
      req.user = data.user;
      //now time to go back to next function to auth
      next();
    } catch (error) {
        return res.status(401).json({ errors: "Please authenticate a valid token" });
    }

}

module.exports = fetchuser
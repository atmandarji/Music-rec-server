const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.headers.uid = decode.userid;
    next();
  }
  catch(error){
    return res.status(401).json({
      message: 'Authantication failed',
    });
  }
};

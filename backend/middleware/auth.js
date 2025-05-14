const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }


  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
     
      return res.status(401).json({ message: `Invalid Token :${token} -- ${JWT_SECRET}` });

    }
    req.user = decoded;
    next();
  });
};
module.exports = verifyToken;

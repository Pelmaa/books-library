const jwt = require("jsonwebtoken");

const JWT_SECRET = "very Secret";

const createJWTToken = (data) => {
  return jwt.sign(data, JWT_SECRET);
};

const verifyJWTToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.log(err);
    return { error: err, message: err.message };
  }
};

module.exports = { createJWTToken, verifyJWTToken };

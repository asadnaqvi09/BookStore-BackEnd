const jwt = require('jsonwebtoken')

const generateRefreshToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = generateRefreshToken;
const { notAuth } = require("./handleError");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return notAuth("Require login", res);
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return notAuth("Token may be expire or invalid", res);
    req.user = user;
    next();
  });
};

module.exports = { verifyToken };

const authRouter = require("./auth");
const score = require("./scores");
const user = require("./users");
const verifyToken = require("../middlewares/auth");

const routes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/score", score);
  app.use("/api/v1/user", verifyToken.verifyToken, user);
  app.use("*", (req, res) => {
    res.status(404).json({
      error: 404,
      message: "Not found"
    });
  });
};
module.exports = routes;

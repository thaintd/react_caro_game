const createError = require("http-errors");
const badRequest = (err, res) => {
  const error = createError.BadRequest(err);
  return res.status(error.status).json({
    err: 1,
    mes: error.message
  });
};
const internalServerError = (res) => {
  const error = createError.InternalServerError();
  return res.status(error.status).json({
    err: 1,
    mes: error.message
  });
};
const notFound = (err, res) => {
  const error = createError.NotFound("This routes is not define");
  return res.status(error.status).json({
    err: 1,
    mes: error.message
  });
};

const notAuth = (err, res) => {
  const error = createError.Unauthorized(err);
  return res.status(error.status).json({
    err: 1,
    mes: error.message
  });
};
module.exports = {
  badRequest,
  notAuth,
  notFound,
  internalServerError
};

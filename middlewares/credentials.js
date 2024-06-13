const allowedOrigins = require("../config/allowedOrigins");

//this middleware basically prevent CORS to trigger on Frontend app because of "Access-Control-Allow-Credentials" is rather set to ""/blank instead of "true" on response(res) header
//"Access-Control-Allow-Credentials": true, basically allows to interact with the "http cookie" we have created. in our case it is the refreshToken cookie.

//use this middleware before CORS middle ware to avoid CORS error
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.headers("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;

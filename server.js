const express = require("express");
const app = express();
const port = 3500;
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middlewares/logEvents");
const credentials = require("./middlewares/credentials");
const errorHandler = require("./middlewares/errorHandler");
const verifyJWT = require("./middlewares/verifyJWT");
const cookieParser = require("cookie-parser");
//middlewares--STARTS

// custom middleware logger
app.use(logger);

//credentials
app.use(credentials);
//cors
app.use(cors(corsOptions));

//for form-data
app.use(express.urlencoded({ extended: false }));
//for json
app.use(express.json());
//for cookies
app.use(cookieParser());

//Routes

//public routes
app.use("/register", require("./routes/api/registerUser"));
app.use("/auth", require("./routes/api/auth"));
app.use("/refreshToken", require("./routes/api/refresh"));
app.use("/logout", require("./routes/api/logout"));

//protected routes (JWT req*)
app.use("/employees", verifyJWT, require("./routes/api/employees"));

//middlewares--ENDS

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.all("*", (req, res) => {
  res.status(404);
  res.json({ error: "404 Not Found" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

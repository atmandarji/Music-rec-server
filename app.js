const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
//process.env.MONGO_ATLAS_PW
mongoose.connect(
  "mongodb+srv://atman-darji:atman123@cluster0-dq7xd.mongodb.net/test?retryWrites=true",
  {
    useNewUrlParser: true
  },
  () => {
    console.log("Successfully Connected");
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, Accept, X-Requested-With, Content-Type, x-access-token, Authorization"
  );
  res.set("Cache-Control", "no-cache");
  if ("OPTIONS" === req.method) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Authentication, Overwrite, Destination, Content-Type, Depth, User-Agent, Translate, Range, Content-Range, Timeout, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Location, Lock-Token, If"
    );

    return res.sendStatus(200).end();
  } else {
    //move on
    next();
  }
});
const userRouts = require("./api/routs/user");
const searchRouts = require("./api/routs/search");
const verifyRouts = require("./api/routs/verify");

app.get("/", (req, res) => {
  res.send("Welcome to the musicrec-server!");
});

app.use("/search", searchRouts);
app.use("/user", userRouts);
app.use("/verify", verifyRouts);

app.use((req, res, next) => {
  const error = new Error("Not fund");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

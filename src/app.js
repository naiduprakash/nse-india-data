const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

const sampleData = require("./sample.json");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", (req, res, next) => {
  res.send(sampleData.data);
});

// 404
app.use((req, res, next) => {
  return res.status(404).send({
    error: `Not found: ${req.url}`,
  });
});

// 500
app.use((err, req, res, next) => {
  console.log("err", err); // write to pm2 logs
  const statusCode = err.status || 500;
  const { message, ...rest } = err;
  let error =
    Object.keys(rest).length && err.status ? rest : { error: message };
  return res.status(statusCode).send(error);
});

module.exports = app;

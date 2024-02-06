require("dotenv").config();
const express = require("express");
const connection = require("./connection/config");
const app = express();
const port = process.env.PORT;
const morgan = require("morgan");
const cors = require("cors");

connection();

app.use(cors());
app.use(express.json());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      "-",
      tokens.url(req, res),
      "-",
      tokens.status(req, res),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

app.use("/api", require("./routes/router"));

app.listen(port, () => console.log("Server is running on port", port));

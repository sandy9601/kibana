const dotenv=require("dotenv").config()
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const route = require("./routes/route.js");


app.use(bodyparser.json());
app.use("/", route);
app.listen(process.env.port, () => console.log(`api running on ${process.env.port} and pid ${process.pid}`));
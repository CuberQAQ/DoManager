import fs from "fs-extra";
import express from "express";
import bodyParser from "body-parser";
import jsonfile from "jsonfile";

const port = 32386;
const app = express();
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const file_now_pes = "./data/member.json";

const moduleName = "CuberEngine FileServer";
const moduleVersion = "0.1.0";
console.log(moduleName + " (" + moduleVersion + ") Start...");
console.log("Listening on Port: " + port);

app.get("/member", (req, res) => {
  let obj = jsonfile.readFileSync(file_now_pes, {
    encoding: "utf8",
    flag: "r",
  });
  console.log("GET member:" + JSON.stringify(obj));
  res.status(200).json(obj);
});

app.post("/member", (req, res) => {
  console.log("POST member:" + JSON.stringify(req.body));
  jsonfile.writeFileSync(file_now_pes, req.body);
  let obj = jsonfile.readFileSync(file_now_pes, {
    encoding: "utf8",
    flag: "r",
  });
  res.status(200).json(obj);
});

// Start Listening on Port
app.listen(port);

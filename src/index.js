import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/about", (req, res) => {
  res.send("about is working");
});

app.listen(4000, () => {
  console.log("app is listening on port number 4000");
});

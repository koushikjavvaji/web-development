const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "himynameiskoushik";
let inmemory = [];
app.use(express.json());

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  inmemory.push({
    username: username,
    password: password,
  });
  res.send({
    message: "You have signed up",
  });
});
app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let founduser = false;
  for (let i = 0; i < inmemory.length; i++) {
    if (username == inmemory[i].username && password == inmemory[i].password) {
      founduser = inmemory[i];
    }
  }
  if (founduser) {
    const token = jwt.sign(
      {
        username: username,
      },
      JWT_SECRET
    );
    res.send({
      token,
    });
  } else {
    res.status(403).send({
      message: "Invalid username or password",
    });
  }
});
app.get("/me", (req, res) => {
  const token = req.headers.authorization;
  const userdetails = jwt.verify(token, JWT_SECRET);
  const username = userdetails.username;
  const user = inmemory.find((user) => user.username === username);

  if (user) {
    res.send({
      username: user.username,
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
});
app.listen(3000);

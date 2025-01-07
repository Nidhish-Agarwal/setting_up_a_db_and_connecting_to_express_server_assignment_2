const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const userSchema = require("./schema.js");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./.env",
  });
}

const app = express();
const port = 3010;

app.use(express.static("static"));

mongoose
  .connect(process.env.DB_URL)
  .then((data) => console.log("Connected to Database", data.connection.host))
  .catch((err) => console.log("Error Connecting to Database", err.message));

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.post("/app/users", async (req, res) => {
  try {
    const newUser = new userSchema(req.body);
    newUser.save();
    res.status(201).json({ message: "User Created Sucessfully" });
  } catch (err) {
    if (err.name == "ValidationError") {
      res.status(400).json({ message: `Validation Error: ${err.message}` });
    } else {
      console.error("Error saving user:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

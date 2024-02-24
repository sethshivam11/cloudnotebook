const connectToDb = require("./db");
const express = require("express");
connectToDb();
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json());

const path = require("path");
const __dirname1 = path.resolve();

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));


app.listen(port, () => {
  console.log("Cloud Notebook Backend is running at port: " + port);
});

// --------------------------Deployment-------------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running successfully");
  });
}
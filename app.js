require("dotenv/config");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const chalk = require("chalk");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const cardRoutes = require("./routes/cardRoutes");

mongoose
  .connect(config.get("mongoDB.MONGO_URI"))
  .then(() => console.log(chalk.green.bold("Connected to MongoDB")))
  .catch((error) =>
    console.log(chalk.red.bold("Could not connect to MongoDB", error))
  );

const app = express();

app.use(
  morgan(
    chalk.yellow.bold(
      `DATE: :date[web] ; METHOD: :method ; URL: :url ; STATUS: :status ; RESPONSE TIME: :response-time ms`
    )
  )
);
app.use(express.json());

app.use("/users", userRoutes);
app.use("/cards", cardRoutes);

app.use(express.static("public"));

app.all("*", (req, res) => {
  res.status(404).send("Error: 404, Page not found");
});

app.listen(config.get("server.PORT"), () =>
  console.log(
    chalk.white.bgGray(`Listening to port ${config.get("server.PORT")}`)
  )
);

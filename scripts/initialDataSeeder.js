require("dotenv/config");
const mongoose = require("mongoose");
const config = require("config");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const express = require("express");
const { User } = require("../models/userModel");
const { Card, generateBizNumber } = require("../models/cardModel");
const { usersInitialData, cardsInitialData } = require("./initialData");

mongoose
  .connect(config.get("mongoDB.MONGO_URI"))
  .then(() => console.log(chalk.green.bold("Connected to MongoDB")))
  .then(seedInitialData)
  .then(() => mongoose.connection.close())
  .catch((error) =>
    console.log(chalk.red.bold(`Could not connect to MongoDB", ${error}`))
  );

const app = express();

app.listen(config.get("server.PORT"), () =>
  console.log(
    chalk.white.bgGray(`Listening to port ${config.get("server.PORT")}`)
  )
);

async function seedInitialData() {
  await User.deleteMany();
  await Card.deleteMany();

  let i = 0;
  while (i < usersInitialData.length - 1) {
    await seedUsers(usersInitialData[i]);
    i++;
  }

  const user = await seedUsers(usersInitialData[usersInitialData.length - 1]);

  let j = 0;
  while (j < cardsInitialData.length) {
    await createCard({
      ...cardsInitialData[j],
      user_id: user._id,
    });
    j++;
  }

  console.log(
    chalk.black.bgYellow(
      "The initial data has been seeded, now you can run the application by writing 'npm run start/dev...'"
    )
  );
}

async function seedUsers(usersInitialData) {
  const seedUser = await new User({
    ...usersInitialData,
    password: await bcrypt.hash(usersInitialData.password, 12),
  }).save();

  console.log(
    chalk.whiteBright.bgGreen(
      `A new user was added: ${usersInitialData.email}, isAdmin: ${usersInitialData.isAdmin}, isBusiness: ${usersInitialData.isBusiness}`
    )
  );
  return seedUser;
}

async function createCard(card) {
  const seedCard = await new Card({
    ...card,
    bizNumber: await generateBizNumber(),
  }).save();
  console.log(
    chalk.whiteBright.bgBlue(`A new card was added: ${seedCard.title}`)
  );
  return seedCard;
}

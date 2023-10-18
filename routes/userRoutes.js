const router = require("express").Router();
const { User, validateUser } = require("../models/userModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const authMW = require("../middleware/authMW");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User already registered");
    return;
  }
  user = await new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);
  await user.save();

  res.send(user);
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email or password");
    return;
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("Invalid email or password");
    return;
  }
  const token = user.generateAuthToken();
  res.send({ token });
});

router.get("/", authMW("isAdmin"), async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");
    res.send(allUsers);
  } catch (error) {
    res
      .status(401)
      .send("You do not have permission to perform this action.", error);
  }
});

router.get("/:id", authMW("isAdmin", "registeredUser"), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    res.send(user);
  } catch (error) {
    res
      .status(401)
      .send("You do not have permission to perform this action.", error);
  }
});

router.put("/:id", authMW("registeredUser"), async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  let user = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user._id },
  });
  if (user) {
    res
      .status(401)
      .send(
        "It is not possible to change to the email address you selected, please choose another address"
      );
    return;
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    res
      .status(401)
      .send(
        "There was a problem changing the details, please try again",
        error
      );
  }
});

router.patch("/:id", authMW("registeredUser"), async (req, res) => {
  if (!Object.keys(req.body).includes("isBusiness")) {
    res.status(401).send("You didn't pass the object's key properly");
    return;
  }
  if (typeof req.body.isBusiness !== "boolean") {
    res.status(401).send("The value of isBusiness can only be true or false");
    return;
  }
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { isBusiness: req.body.isBusiness },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    res
      .status(401)
      .send(
        "There was an error performing the operation, please try again.",
        error
      );
  }
});

router.delete("/:id", authMW("isAdmin", "registeredUser"), async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      res
        .status(401)
        .send(`User with id:${req.params.id} does not exist in the database `);
      return;
    }
    res.send(user);
  } catch (error) {
    res.status(401).send("An error occurred, the user was not deleted.");
  }
});

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email({ tlds: false }),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(user);
}

module.exports = router;

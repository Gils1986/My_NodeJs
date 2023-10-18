const router = require("express").Router();
const authMW = require("../middleware/authMW");
const {
  Card,
  validateCard,
  generateBizNumber,
} = require("../models/cardModel");

router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (error) {
    res.status(400).send("No cards found", error);
  }
});

router.get("/my-cards", authMW(), async (req, res) => {
  try {
    const cards = await Card.find({ user_id: req.user._id });
    res.send(cards);
  } catch (error) {
    res.status(400).send("No cards found", error);
  }
});

router.get("/:id", async (req, res) => {
  if (req.params.id.length < 24) {
    res.status(401).send("The ID number is smaller than it should be");
    return;
  }
  try {
    const card = await Card.findOne({ _id: req.params.id });
    res.send(card);
  } catch (error) {
    res
      .status(400)
      .send(
        "The card with the ID number you are looking for was not found, please try another number",
        error
      );
  }
});

router.post("/", authMW("isBusiness"), async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    const card = await new Card({
      ...req.body,
      bizNumber: await generateBizNumber(),
      user_id: req.user._id,
    });
    await card.save();
    res.send(card);
  } catch (error) {
    res
      .status(400)
      .send(
        "The card was not saved, there was a problem filling in the details",
        error
      );
  }
});

router.put("/:id", authMW("cardCreator"), async (req, res) => {
  try {
    const { error } = validateCard(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );

    if (!card) {
      return res
        .status(401)
        .send("Card not found or you don't have permission.");
    }

    res.send(card);
  } catch (error) {
    res.status(400).send("An error occurred while updating the card: " + error);
  }
});

router.patch("/:id", authMW(), async (req, res) => {
  try {
    const card = await Card.findOne({
      _id: req.params.id,
      "likes.user_id": req.user._id,
    });
    if (card) {
      res.statusMessage = "This card is already in your favorites...";
      res.status(400).send("This card is already in your favorites...");
      return;
    }
    console.log("hello");
    const favoriteCard = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { likes: { user_id: req.user._id } } },
      { new: true }
    );

    res.send(favoriteCard);
  } catch (error) {
    res
      .status(401)
      .send(
        "There was an error entering the data, check and try again",
        error.message
      );
  }
});

router.delete("/:id", authMW("isAdmin", "cardCreator"), async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
    });
    if (!card) {
      res.status(400).send("The card was already deleted");
      return;
    }
    res.send(card);
  } catch (error) {
    res
      .status(401)
      .send(
        "The card was not deleted, there was an error in the data transfer",
        error
      );
  }
});

router.patch("/changeBizNumber/:id", authMW("isAdmin"), async (req, res) => {
  if (req.body.bizNumber) {
    const card = await Card.findOne({
      bizNumber: req.body.bizNumber,
      _id: { $ne: req.params.id },
    });
    if (card) {
      res
        .status(401)
        .send("There is already a card with the business number you wrote");
      return;
    }
  }
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { bizNumber: req.body.bizNumber || (await generateBizNumber()) },
      { new: true }
    );
    res.send(card);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;

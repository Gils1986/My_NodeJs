const jwt = require("jsonwebtoken");
const config = require("config");
const { Card } = require("../models/cardModel");

function authMW(...roles) {
  return async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
      res.statusMessage = "Access denied, No Token was provided.";
      res.status(401).send("Access denied, No Token was provided.");
      return;
    }
    try {
      const decode = jwt.verify(token, config.get("auth.JWT_SECRET"));
      req.user = decode;
      if (!roles || roles.length == 0) {
        next();
        return;
      }
      if (roles.includes("isAdmin") && req.user.isAdmin) {
        console.log(decode);
        next();
        return;
      }
      if (roles.includes("registeredUser") && req.user._id == req.params.id) {
        next();
        return;
      }
      if (roles.includes("cardCreator")) {
        try {
          const card = await Card.findOne({
            _id: req.params.id,
            user_id: req.user._id,
          });
          if (!card) {
            res.statusMessage =
              "Failed to find the specified card, No card was found with this ID or you are not the user who created it.";
            res
              .status(401)
              .send(
                "Failed to find the specified card, No card was found with this ID or you are not the user who created it."
              );
            return;
          }
          next();
          return;
        } catch (error) {
          res.statusMessage = "No such card found";
          res.status(401).send("No such card found");
          return;
        }
      }
      if (roles.includes("isBusiness") && req.user.isBusiness) {
        next();
        return;
      }
      res.statusMessage =
        "Access is denied, you do not have the appropriate permission to perform this action";
      res
        .status(400)
        .send(
          "Access is denied, you do not have the appropriate permission to perform this action"
        );
      return;
    } catch (error) {
      res.statusMessage = "Invalid token";
      res.status(400).send("Invalid Token");
      return;
    }
  };
}
module.exports = authMW;

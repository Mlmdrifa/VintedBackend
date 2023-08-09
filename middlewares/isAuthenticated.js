const Offer = require("../models/offer");

const isAutenticated = (req, res, next) => {
  console.log(req.headers.authorization);
  const receivedToken = req.headers.authorization.replace("Bearer", "");
  console.log(receivedToken);

  Offer.findOne({ token: receivedToken });

  console.log("On est ici");
  next();
};

module.exports = isAutenticated;

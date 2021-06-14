const googleRouter = require("express").Router();
const UserGoogle = require("../models/UserGoogle");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

googleRouter.post("/", async (req, res) => {
  const body = req.body;

  let user = await UserGoogle.findOne({ googleId: body.googleId }).populate(
    "personalPlan"
  );

  if (user) {
    const token = jwt.sign(user.toJSON(), config.SECRET);
    res.send({
      token,
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      id: user._id,
      familyPlans: user.familyPlans,
    });
  } else {
    user = new UserGoogle({
      googleId: body.googleId,
      email: body.email,
      name: body.name,
      image: body.imageUrl,
    });

    const token = jwt.sign(user.toJSON(), config.SECRET);

    try {
      await user.save();
      res.send({
        token,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        id: user._id,
      });
    } catch (e) {
      console.error(e.message);
    }
  }
});

module.exports = googleRouter;

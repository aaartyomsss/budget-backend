const googleRouter = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

googleRouter.post('/', async (req, res) => {
  const body = req.body;

  let user = await User.findOne({ email: body.email }).populate('personalPlan');

  if (user) {
    const token = jwt.sign(user.toJSON(), config.SECRET);
    res.send({
      token,
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      id: user._id,
      familyPlans: user.familyPlans,
      username: user.username,
    });
  } else {
    user = new User({
      googleId: body.googleId,
      email: body.email,
      name: body.name,
      image: body.imageUrl,
      confirmed: true,
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

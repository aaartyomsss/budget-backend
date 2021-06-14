const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username }).populate(
    "personalPlan"
  );
  const passwordValidation =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordValidation)) {
    return res.status(401).json({
      error: "Invalid password or username",
    });
  }

  if (!user.confirmed) {
    return res.status(403).json({ error: "Your account is not confirmed" });
  }

  const userForToken = {
    username: user.username,
    name: user.name,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name,
      personalPlan: user.personalPlan,
      id: user._id,
      familyPlans: user.familyPlans,
    });
});

module.exports = loginRouter;

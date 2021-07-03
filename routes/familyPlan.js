const familyPlanRouter = require('express').Router();
const FamilyPlan = require('../models/FamilyPlan');
const User = require('../models/User');

familyPlanRouter.get('/plans', async (req, res) => {
  const all = await FamilyPlan.find({});
  res.json(all);
});

familyPlanRouter.post('/initialize-plan', async (req, res) => {
  const { planName, userId } = req.body;
  const newFamilyPlan = new FamilyPlan({
    users: [userId],
    planName,
    created_by: userId,
  });
  try {
    await newFamilyPlan.save();
    res.json(newFamilyPlan);
  } catch (error) {
    res.json({ error });
  }
});

//TODO add get request to get specific plan
//TODO add addition, updating, deletition of expenses
// check that user is within the plan should be implemented

module.exports = familyPlanRouter;

const familyPlanRequestRouter = require('express').Router();
const { json } = require('express');
const FamilyPlanRequest = require('../models/FamilyPlanRequest');
const FamilyPlan = require('../models/FamilyPlan');
const { returningUserById } = require('../utils/helperFunctions');
const User = require('../models/User');

const REQUEST_SENT = 'sent';
const REQUEST_ACCEPTED = 'accepted';

familyPlanRequestRouter.post('/send-request', async (req, res) => {
  const { requester, planName, recepientId, planId } = req.body;
  const recepient = await returningUserById(recepientId);

  if (!recepient) {
    return res.status(403).json({ error: 'User was not found' });
  }

  const request = new FamilyPlanRequest({
    status: REQUEST_SENT,
    recepient: recepient._id,
    requester,
    planName,
    planId,
  });

  await request.save();
  res.json(request);
});

// Uses recepient id as url param
familyPlanRequestRouter.get('/requests/:id', async (req, res) => {
  const userId = req.params.id;
  const requests = await FamilyPlanRequest.find({ recepient: userId });
  res.json(requests);
});

// Uses request's id as an url param
familyPlanRequestRouter.patch('/request-response/:id', async (req, res) => {
  const { answer, userId } = req.body;
  if (!answer) {
    return res.status(400).json({ error: 'No answer was provided' });
  }

  try {
    //TODO Implement validation that request was not answered already
    const request = await FamilyPlanRequest.findOneAndUpdate(
      { _id: req.params.id },
      { status: answer },
      { new: true }
    );
    if (answer === REQUEST_ACCEPTED) {
      try {
        const plan = await FamilyPlan.findById(request.planId);
        const user = await User.findById(userId);
        plan.users = plan.users.concat(user._id);
        user.familyPlans = user.familyPlans.concat(plan._id);
        await plan.save();
        await user.save();
        res.json(plan);
      } catch (error) {
        res.json({ error: error.message });
      }
    }
  } catch (e) {
    return res.status(403).json({ error: 'Request was not found ' });
  }
});

module.exports = familyPlanRequestRouter;

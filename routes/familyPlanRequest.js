const familyPlanRequestRouter = require("express").Router();
const { json } = require("express");
const FamilyPlanRequest = require("../models/FamilyPlanRequest");
const { returningUserById } = require("../utils/helperFunctions");

const REQUEST_SENT = "sent";
const REQUEST_ACCEPTED = "accepted";
const REQUEST_DECLINED = "declined";

familyPlanRequestRouter.post("/send-request", async (req, res) => {
  const { requester, planName, recepientId } = req.body;
  const recepient = await returningUserById(recepientId);

  if (!recepient) {
    return res.status(403).json({ error: "User was not found" });
  }

  const request = new FamilyPlanRequest({
    status: REQUEST_SENT,
    recepient: recepient._id,
    requester,
    planName,
  });

  await request.save();
  res.json(request);
});

// Uses recepient id as url param
familyPlanRequestRouter.get("/requests/:id", async (req, res) => {
  const userId = req.params.id;
  const requests = await FamilyPlanRequest.find({ recepient: userId });
  res.json(requests);
});

// Uses request's id as an url param
familyPlanRequestRouter.patch("/request-response/:id", async (req, res) => {
  const answer = req.body.answer;
  if (!answer) {
    return res.status(400).json({ error: "No answer was provided" });
  }

  try {
    const request = await FamilyPlanRequest.findOneAndUpdate(
      { _id: req.params.id },
      { status: answer },
      { new: true }
    );
    res.json(request);
  } catch (e) {
    return res.status(403).json({ error: "Request was not found " });
  }
});

module.exports = familyPlanRequestRouter;

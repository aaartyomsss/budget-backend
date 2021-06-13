const mongoose = require("mongoose");

const familyPlanRequestSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  recepient: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
});

familyPlanRequestSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const FamilyPlanRequest = mongoose.model(
  "FamilyPlanRequest",
  familyPlanRequestSchema
);

module.exports = FamilyPlanRequest;

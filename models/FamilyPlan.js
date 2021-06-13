const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const familyPlanScheme = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  ],
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  planName: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

familyPlanScheme.plugin(uniqueValidator);

familyPlanScheme.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const FamilyPlan = mongoose.model("FamilyPlan", familyPlanScheme);

module.exports = FamilyPlan;

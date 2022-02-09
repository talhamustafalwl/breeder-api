const mongoose = require("mongoose");

//for Activity create to hold info
const ActivitySchema = mongoose.Schema(
  {
    // name: { type: String },
    categoryType: { type: String },
    description: { type: String },
    assignToType: {
      type: String,
      enum: ["Animal", "Group"],
      default: "Animal",
    },
    categoryName: { type: String },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    groupId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    animalId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Animal",
      },
    ],
    employeeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    breederId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    date: { type: Date },
    period: {
      type: String,
      enum: ["Daily", "Weekly", "Montly", "Yearly", "Group"],
      default: "Daily",
    },
    time: [
      {
        type: String,
      },
    ],
    days: [
      {
        type: String,
      },
    ],
    months: [
      {
        type: String,
      },
    ],
    years: [
      {
        type: String,
      },
    ],
    // timePeriod: {
    //     type: String,
    //     enum: ["P.M", "A.M"],
    // },

    //more...
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = { Activity };

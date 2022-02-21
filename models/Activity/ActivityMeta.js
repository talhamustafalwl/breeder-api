const mongoose = require("mongoose");

//for Activity create to hold info
const ActivityMetaSchema = mongoose.Schema(
  {
    employeeName: {
      type: String,
    },

    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      require: true,
    },
    isPerformed: {
      type: Boolean,
      default: false,
    },
    performedTime: {
      type: Date,
    },
    description: {
      type: String,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    employeeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    performedDate: { type: Date },
    period: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly", "Group"],
      default: "Daily",
    },
    time: {
      type: String,
    },

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

const ActivityMeta = mongoose.model("ActivityMeta", ActivityMetaSchema);

module.exports = { ActivityMeta };

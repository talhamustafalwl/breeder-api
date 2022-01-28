const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//for business Details
const businessDetail = mongoose.Schema({
  businessInfo: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  daysOpen: [String],
  openHrStart: {
    type: Date,
  },
  openHrEnd: {
    type: Date,
  },
  breakTimeStart: {
    type: Date,
  },
  breakTimeEnd: {
    type: Date,
  },
  holidays: [
    {
      holi_date: Date,
      holi_name: String,
    },
  ],
  taxPercentage: {
    type: Number,
  },

  breederId: { type: Schema.Types.ObjectId, ref: "User" },
});

const BusinessDetail = mongoose.model("BusinessDetail", businessDetail);

module.exports = { BusinessDetail };

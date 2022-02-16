const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//for business Details
const recentSearch = mongoose.Schema({
  name: {
    type: String,
  },
  searchId: {
    type: String,
  },
  type: {
    type: String,
  },

  breederId: { type: Schema.Types.ObjectId, ref: "User" },
});

const RecentSearch = mongoose.model("RecentSearch", recentSearch);

module.exports = { RecentSearch };

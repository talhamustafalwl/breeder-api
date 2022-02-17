const mongoose = require("mongoose");
var idvalidator = require("mongoose-id-validator");
//first thing to define animal categories
//?? it is created by admin
const categorySchema = mongoose.Schema(
  {
    //userId: {type: Schema.Types.ObjectId,ref: 'User'},
    name: {
      type: String,
    },

    active: {
      type: Boolean,
      default: 0,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    type: {
      type: String,
      enum: ["animal", "activity", "product", "contact"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subType: [{ type: String }],
    breeds: [{ name: { type: String }, value: { type: String } }],
    traits: [
      {
        name: { type: String },
        value: { type: String },
        breed: { type: String },
      },
    ],
    subCategories: [{ name: { type: String }, value: { type: String } }],
    animals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

//downcase name
categorySchema.pre("save", function (next) {
  var category = this;
  // category.name = this.name.toLowerCase();
  next();
});

categorySchema.plugin(idvalidator);
const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };

const mongoose = require("mongoose");
// var idvalidator = require('mongoose-id-validator');

// Schema when user modify any validation..
const modifyValidationSchama = mongoose.Schema({
  validation: {
    minLength: { type: Number },
    maxLength: { type: Number },
    allowNumber: { type: Boolean },
    decimalPlacesLength: { type: Number },
    allowString: { type: Boolean },
    allowSpecialCharacter: { type: Boolean },
    allowSpace: { type: Boolean },
    shouldAtLeastOneUpperCase: { type: Boolean },
    shouldAtLeastOneSpecialCharacter: { type: Boolean },
    shouldAtLeastOneLowerCase: { type: Boolean },
    shouldAtLeastOneNumber: { type: Boolean },
    required: { type: Boolean },
  },

  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// Schama represents form structure..
const formStructureSchema = mongoose.Schema({
  displayName: { type: String },
  name: { type: String },
  type: { type: String },
  prefix: {type: String},
  mandatory: { type: Boolean },
  validation: {
    minLength: { type: Number },
    maxLength: { type: Number },
    allowNumber: { type: Boolean },
    allowString: { type: Boolean },
    decimalPlacesLength: { type: Number },
    allowString: { type: Boolean },
    allowSpecialCharacter: { type: Boolean },
    allowSpace: { type: Boolean },
    shouldAtLeastOneUpperCase: { type: Boolean },
    shouldAtLeastOneSpecialCharacter: { type: Boolean },
    shouldAtLeastOneLowerCase: { type: Boolean },
    shouldAtLeastOneNumber: { type: Boolean },
    required: { type: Boolean },
  },
  breedersId: [{_id: Object, index: Number}],
  values: [mongoose.Schema({ name: String, value: String })],
  // Breeder can modify values of any attribute...
  modifiedValuesRequest: [
    mongoose.Schema({
      name: String,
      value: String,
      modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      status: { type: String, enum: ["approved", "rejected", "pending"] },
      modifiedAt: Date,
    }),
  ],
  // Breeder can modify validation .. request will be send to admin ..
  modifiedValidationRequest: [modifyValidationSchama],
});

const FormSchema = mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    formStructure: [formStructureSchema],
    published: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    userType: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    breedersId: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

// FormSchema.plugin(idvalidator);

FormSchema.statics.cloneFormToBreeder = function (id, next) {
  this.updateMany({ userType: "admin" }, { $push: { breedersId: id } }).then(
    (result) => {
      next(result);
    }
  );
};

// FormSchema.pre("save", function (next) {
//   console.log(this);
//   Form.findOne({ categoryId: this.categoryId }).then((result) => {
//     console.log("pre length", result);
//     if (result) return next(new Error("Category Already Exist"));
//     return next();
//   });
// });

const Form = mongoose.model("Form", FormSchema);

module.exports = { Form };

// {
// 	"categoryId": "5eb0538bf7c4281aee712665",
// 	"formStructure": [
// 		{
// 			"displayName": "First Name",
// 			"name": "firstName",
// 			"type": "text",
// 			"validation" : {
// 				"minLength": 4,
// 				"maxLength": 30,
// 				"allowNumber": false,
// 				"allowSpecialCharacter": false,
// 				"allowSpace": true,
// 				"regex": ""
// 			}
//          "addedBy": "",
//          "isApproved": "",
//          "isActive": "",
//          "date": "",
//          breedersId: []
// 		},
// 		{
// 			"displayName": ""Color"",
// 			"name": "color",
// 			"type": "dropdown",
//          "values": {
//              name: "blue",
//              addedBy: "",
//              isApproved: '',
//              date: '',
//              breedersId: []
//          }
// 			"validation" : {
// 				"minLength": 4,
// 				"maxLength": 30,
// 				"allowNumber": false,
// 				"allowSpecialCharacter": false,
// 				"allowSpace": true,
// 				"regex": ""
// 			}
//          "addedBy": "",
//          "isApproved": "",
//          "isActive": "",
//          "date": "",
//          breedersId: []
// 		}
// 	],
// 	"userType": "admin",
// 	"userId": "5eb01d527f460917dee8b5ab",
//  "breedersId": ["5eb01d527f460917dee8b5ab"]
// }

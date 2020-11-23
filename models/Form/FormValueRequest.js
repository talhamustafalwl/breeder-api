const mongoose = require('mongoose');
//var idvalidator = require('mongoose-id-validator');
const FormValueRequestSchema = mongoose.Schema({
    formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true,
          },
          formStructureId: {type: String,
            required: true,
          },
        value:{type: String,
          required: true,
        },
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        breederId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        status: { type: String, enum: ["approved", "rejected", "pending"],default:"pending" },
        type: { type: String, enum: ["animal", "product"],default:"animal" },
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Category",
        },
}, { timestamps: true })

const FormValueRequest = mongoose.model('FormValueRequest', FormValueRequestSchema);

module.exports = { FormValueRequest }
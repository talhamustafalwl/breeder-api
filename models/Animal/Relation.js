const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
//for animal relation ship

const RelationSchema = mongoose.Schema({
  
    animalId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Animal',required:true},
    otherAnimalId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Animal',required:true},
    relationName:{type:String,required:true,enum:["parent","children","sibling"]},

}, { timestamps: true })

RelationSchema.index({ animalId: 1,otherAnimalId: 1,}, {
    unique: true,
  });

RelationSchema.plugin(idvalidator);
const Relation = mongoose.model('Relation', RelationSchema);

module.exports = { Relation }
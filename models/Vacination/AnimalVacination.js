const mongoose = require('mongoose');
//kis animal ko kn se vacination dene ha
const animalvacinationSchema = mongoose.Schema({
    
    date:{type:Date},
    description:{type:String},
    animalId: {type: Schema.Types.ObjectId,
        ref: 'Animal'},
    vacinationId: {type: Schema.Types.ObjectId,
        ref: 'Vacination'}
}, { timestamps: true })


const AnimalVacination = mongoose.model('AnimalVacination', animalvacinationSchema);

module.exports = { AnimalVacination }
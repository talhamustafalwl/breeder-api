const mongoose = require('mongoose');
// var idvalidator = require('mongoose-id-validator');

const FormSchema = mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
    formStructure: { type: mongoose.Schema.Types.Array, require: true },
    published: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    userType: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

// FormSchema.plugin(idvalidator);

FormSchema.pre('save', function (next) {

    Form.findOne({ categoryId: this.categoryId }).then(result => {
        console.log('pre length', result);
        if (result) return next(new Error('Category Already Exist'));
        return next();
    })
})

const Form = mongoose.model('Form', FormSchema);

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

// 		}	
// 	],
// 	"userType": "admin",
// 	"userId": "5eb01d527f460917dee8b5ab"
// }
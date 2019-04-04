// contactModel.js
const mongoose = require('mongoose');

const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Setup schema
var contactSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
        description: "String value allowed"
    },
    lname: {
        type: String,
        required: true,
        description: "String value allowed"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        description: "String value allowed",
        unique: 'Email {VALUE} is already registered please login'
    },
    username: {
        type: String,
        required: true,
        unique: true,
        description: "String value allowed",
        unique: 'Username {VALUE} not available'
    },
    password: {
        type: String,
        required: true,
        description: "String value allowed"
    },
    gender:{
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    phone: {
        type: Number, 
        required: true,
        description: "Only numbers are allowed"
    },
    address: {
        type: String,
        required: true,
        description: "Only strings are allowed"
    },
    role: {
        type: String,
        description: "Only strings are allowed"
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});
contactSchema.plugin(beautifyUnique);
// Export Contact model
var Contact = module.exports = mongoose.model('contact', contactSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}
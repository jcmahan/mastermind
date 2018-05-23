var mongoose = require('mongoose');

var Schema = mongoose.Schema; 

var scoreSchema = new Schema({
    initials: String, 
    numGuesses: Number, 
    seconds: Number, 
});

module.exports = mongoose.model('Score', scoreSchema);
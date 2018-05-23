var mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);
var db = mongoose.connection; 

db.once('open', function() {
    console.log(`connected to MongoDB at ${db.host}:${db.port}`);
});
db.on('error', function(err) {
    console.error(`database error:/n${err}`);
});
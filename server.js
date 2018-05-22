var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

//Put the API routes here, before the "catch all" route 
app.use("/api", require('./routes/api'))
//The followning catch-all route is necessary for a SPA's client side 
//routing to properly work

app.get('*', function(req, res) {
    res.sentFile(path.join(__dirname, 'build', 'index.html'));
});

//configure to use port 3001 instead of 3000 during development
// to avoid collision with React's dev server

var port = process.env.PORT || 3001; 
app.listen(port, function() {
    console.log(`Express App running on port ${port}`);
});
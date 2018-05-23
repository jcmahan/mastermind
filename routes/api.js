var express = require('express');
var router = express.Router();
var Score = require('../models/scores');


router.get('/tacos', function(req, res){
    res.json({tacos: ['carne asada', 'al pastor', 'pollo al carbon', 'carnitas', 'pescado']})
});

router.get('/scores', function(req, res){
    Score.find({}).limit(10).sort({'numGuesses': 1, 'seconds': 1}).then(scores => res.json(scores));
});

router.post('/scores/new', function(req, res){
    let b = req.body; 
    let newScore = new Score({
        initials: b.initials, 
        numGuesses: b.numGuesses, 
        seconds: b.seconds}) 
    newScore.save(function(err, doc) {
        res.json(doc)
    })
})

module.exports = router; 
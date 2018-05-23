var express = require('express');
var router = express.Router();

router.get('/scores', function(req, res){
    res.json([
        {initials: "JM", numGuesses: 4, seconds: 32},
        {initials: "MA", numGuesses: 5, seconds: 120},
        {initials: "LA", numGuesses: 9, seconds: 220},
        {initials: "JG", numGuesses: 10, seconds: 450}
    ])
})
module.exports = router; 
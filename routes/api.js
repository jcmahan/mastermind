var express = require('express');
var router = express.Router();

router.get('/tacos', function(req, res){
    res.json({tacos: ['carne asada', 'al pastor', 'pollo al carbon', 'carnitas', 'pescado']})
})
module.exports = router; 
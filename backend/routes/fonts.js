var express = require('express');
var fontService = require('./../services/fonts/fontService');

var router = express.Router();

router.get('/', (req, res) => {
     res.send(fontService.getFonts());
});

module.exports = router;
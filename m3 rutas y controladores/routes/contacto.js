var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/contacto', function(req, res, next) {
  res.render('contacto', { title: 'Contacto' });
});

module.exports = router;

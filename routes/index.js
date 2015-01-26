var app = require('express');
var router = app.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/students')
  .get(function(req, res, next){
    res.json({ s1: "Elotta Vegina" })
});

module.exports = router;

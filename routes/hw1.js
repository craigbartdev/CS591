var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:name', function(req, res, next) {
    const name = req.params.name;  
    res.send({"string": name, "length": name.length});
});

router.post('/', (req, res) => {
    const name = req.body.name;  
    res.send({"string": name, "length": name.length});
});

module.exports = router;

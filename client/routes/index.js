const router = require('express').Router();
const indexCtrl = require('../controllers/index');

router.get('/', indexCtrl.index);
router.get('/game', indexCtrl.game);

module.exports = router;
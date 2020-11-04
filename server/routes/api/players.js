const router = require('express').Router();
const playerCtrl = require('../../controllers/players');

router.post('/', playerCtrl.createPlayer);
router.get('/:playerID', playerCtrl.getPlayer);

module.exports = router;
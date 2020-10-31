const router = require('express').Router();
const roomCtrl = require('../../controllers/rooms');

router.get('/:roomID', roomCtrl.getRoom);
router.get('/:roomID/players', roomCtrl.getPlayers);

module.exports = router;
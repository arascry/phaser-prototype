const router = require('express').Router();
const roomCtrl = require('../../controllers/rooms');

router.get('/:roomID', roomCtrl.getRoom);

module.exports = router;
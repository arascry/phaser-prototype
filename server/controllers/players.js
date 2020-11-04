const path = require('path');
module.exports = {
    createPlayer,
    getPlayer
}

function createPlayer(req, res) {

}

function getPlayer(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.sendFile(path.join(__dirname, `../static/img/${req.params.playerID}.png`));
}
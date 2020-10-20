module.exports = {
    index,
    game
}

function index(req, res) {
    res.render('index');
}

function game(req, res) {
    res.render('game/index');
}
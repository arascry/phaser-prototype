const path = require('path');
const fs = require('fs');
const Room = require('../room').Room;
module.exports = {
    getRoom
}

const activeRooms = [];
function getRoom(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    fs.readFile(path.join(__dirname, `../static/map/${req.params.roomID}.json`), 'utf8', (err, data) => {
        if (err) {
            res.status(400).json('Something went wrong');
        } else {
            const roomCheck = activeRooms.find(({ name }) => name === req.params.roomID);
            if (roomCheck) {
                res.json(roomCheck.room.getTilemapJSON());
            } else {
                const newRoom = new Room(req.params.roomID, JSON.parse(data));
                activeRooms.push({ name: req.params.roomID, room: newRoom });
                res.json(newRoom.getTilemapJSON());
            }
        }
    });
}
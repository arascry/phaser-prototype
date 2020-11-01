const NPC = require('./npc').NPC;
const Player = require('./player').Player;
const io = require('socket.io-client');

class Room {
    constructor(name, tilemap) {
        this.name = name;
        this.tilemap = tilemap;
        this.players = {};
        this.npcLayer = this.tilemap.layers.find(({ name }) => name === 'npcs');
        this.npcs = this.initNPCS(this.npcLayer.objects);
        this.socket = this.initSocket(this.name);
    }

    initSocket(name) {
        const socket = io('https://arascry.dev/', {path: '/phaser/game/socket.io'});
        socket.emit('listen', { roomID: name });
        socket.on('enter', (player) => {
            this.addPlayer(player);
        });
        socket.on('position', (player) => {
            this.updatePlayer(player);
        });
        socket.on('exit', (player) => {
            this.removePlayer(player);
        });
        return socket;
    }

    initNPCS(npcObjects) {
        const npcs = [];
        npcObjects.forEach(npc => {
            npcs.push(new NPC(npc));
        });
        return npcs;
    }

    addPlayer({ playerID, playerInfo }) {
        this.players[playerID] = { ...playerInfo };
    }

    updatePlayer({ playerID, position }) {
        this.players[playerID] = { ...position };
    }

    removePlayer({ playerID }) {
        this.players = { ...delete this.players[playerID] };
    }

    getPlayers() {
        return this.players;
    }

    getNPCS() {
        return this.npcs;
    }

    getTilemapJSON() {
        return this.tilemap;
    }
}

module.exports = {
    Room
}

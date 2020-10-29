const NPC = require('./npc').NPC;
const Player = require('./player').Player;

class Room {
    constructor(name, tilemap) {
        this.name = name;
        this.tilemap = tilemap;
        this.npcLayer = this.tilemap.layers.find(({ name }) => name === 'npcs');
        this.npcs = this.initNPCS(this.npcLayer.objects);
    }

    initNPCS(npcObjects) {
        const npcs = [];
        npcObjects.forEach(npc => {
            npcs.push(new NPC(npc));
        });
        return npcs;
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
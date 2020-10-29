class NPC {
    constructor(npcObject) {
        this.gid = npcObject.gid;
        this.height = npcObject.height;
        this.id = npcObject.id;
        this.name = npcObject.name;
        this.rotation = npcObject.rotation;
        this.type = npcObject.type;
        this.visible = npcObject.visible;
        this.width = npcObject.width;
        this.x = npcObject.x;
        this.y = npcObject.y;
    }
}

module.exports = {
    NPC
}
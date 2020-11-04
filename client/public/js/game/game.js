const socket = io('http://localhost:8087', {
    path: '/phaser/game/socket.io'
});

class BaseScene extends Phaser.Scene {
    constructor(name = 'DungeonScene-0') {
        super(name);
        this.cursor;
        this.num = 0;
        this.npcs;
        this.npcsLayer;
        this.player;
        this.players = {};
        this.prevFrame;
        this.pointer;
        this.portals;
        this.portalLayer;
    }

    preload() {
        this.load.setCORS('anonymous');
        this.load.image('tiles', 'static/img/dungeonWalls.png');
        this.load.tilemapTiledJSON(`map-${this.num}`, `http://localhost:8087/phaser/game/rooms/DungeonScene-${this.num}`);
        this.load.spritesheet('base', 'http://localhost:8087/phaser/game/players/baseMale', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('megaset', 'static/img/dungeonTileSet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('wallset', 'static/img/dungeonWalls.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        let map = this.add.tilemap(`map-${this.num}`);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true);

        let tiles = map.addTilesetImage('dungeonWalls', 'tiles');
        let floors = map.createStaticLayer('floors', tiles, 0, 0);
        let walls = map.createStaticLayer('walls', tiles, 0, 0);

        walls.setCollisionByProperty({ collides: true });

        this.portals = this.physics.add.staticGroup();
        this.portalsLayer = map.getObjectLayer('portals')['objects'];
        this.portalsLayer.forEach(object => {
            let obj = this.portals.create(object.x, object.y, 'wallset', object.type);
            obj.name = object.name;
            obj.exitDoor = object.properties[0].value;
            obj.link = object.properties[1].value;
            obj.teleports = object.properties[2].value;
        });

        this.npcs = this.physics.add.staticGroup();
        this.npcsLayer = map.getObjectLayer('npcs')['objects'];
        this.npcsLayer.forEach(object => {
            let obj = this.npcs.create(object.x, object.y, 'megaset', object.type);
        });

        this.players = this.physics.add.staticGroup();
        this.player = this.physics.add.sprite(400, 300, 'base');

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('base', { frames: [0, 1, 2, 3] }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('base', { frames: [4, 5, 6, 7] }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('base', { frames: [8, 9, 10, 11] }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('base', { frames: [12, 13, 14, 15] }),
            frameRate: 6,
            repeat: -1
        });

        this.physics.add.overlap(this.player, this.portals, null, this.moveRooms, this);
        this.physics.add.collider(this.player, walls, null, null, this);
        this.physics.add.collider(this.player, this.npcs, null, this.sendCollision, this);
        this.physics.add.collider(this.npcs, walls, null, null, this);
        this.physics.add.collider(this.npcs, this.npcs, null, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.pointer = this.input.activePointer;

        this.cameras.main.setBounds(0, 0, map.widthInPixels + 100, map.heightInPixels + 100);
        this.cameras.main.startFollow(this.player, false, .5, .5);

        socket.emit('register', { roomID: this.sys.config, x: this.player.x, y: this.player.y });

        socket.on('sendPlayers', playerList => {
            for (const [playerID, playerInfo] of Object.entries(playerList)) {
                this.addPlayer({ playerID, playerInfo });
            }
        });

        socket.on('exit', playerID => {
            this.removePlayer(playerID);
        });

        socket.on('enter', (payload) => {
            this.addPlayer(payload);
        });

        socket.on('position', ({ playerID, position, frame }) => {
            this.updatePlayers(playerID, position, frame);
        });
    }

    addPlayer({ playerID, playerInfo }) {
        let obj = this.players.create(playerInfo.x, playerInfo.y, 'base');
        obj.name = playerID;
    }

    updatePlayers(playerID, position, frame) {
        const player = this.players.getChildren().find(el => el.name === playerID);
        if (player) {
            player.x = position.x;
            player.y = position.y;
            player.setFrame(frame);
        }
    }

    removePlayer({ playerID }) {
        const player = this.players.getChildren().find(el => el.name === playerID);
        player.destroy();
    }

    update() {
        this.player.setVelocity(0);
        this.input.on('pointerdown', (pointer) => {
            let pointOffset = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            this.player.setX(pointOffset.x);
            this.player.setY(pointOffset.y);
        });

        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-100);
                this.prevFrame = 0;
                if (this.cursors.shift.isDown) {
                    this.player.setVelocityY(-160);
                }
            }

            if (this.cursors.down.isDown) {
                this.player.setVelocityY(100);
                this.prevFrame = 4;
                if (this.cursors.shift.isDown) {
                    this.player.setVelocityY(160);
                }
            }

            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-100);
                this.prevFrame = 8;
                if (this.cursors.shift.isDown) {
                    this.player.setVelocityX(-160);
                }
            }

            if (this.cursors.right.isDown) {
                this.player.setVelocityX(100);
                this.prevFrame = 12;
                if (this.cursors.shift.isDown) {
                    this.player.setVelocityX(160);
                }
            }

            switch (this.prevFrame) {
                case 0: this.player.play('up', true);
                    break;
                case 4: this.player.play('down', true);
                    break;
                case 8: this.player.play('left', true);
                    break;
                case 12: this.player.play('right', true);
                    break;
            }
            socket.emit('position', { roomID: this.sys.config, x: this.player.x, y: this.player.y, frame: this.player.frame.name });
        } else {
            this.player.setFrame(this.prevFrame);
            socket.emit('position', { roomID: this.sys.config, x: this.player.x, y: this.player.y, frame: this.player.frame.name });
        }
    }

    moveRooms(player, portal) {
        if (portal.teleports === true) {
            if (this.scene.getIndex(`DungeonScene-${portal.link}`) === -1) {
                this.scene.add(`DungeonScene-${portal.link}`, new DungeonScene(portal.link), false);
            } else {
                socket.emit('exit', { roomID: this.sys.config });
                socket.removeAllListeners();
                this.scene.start(`DungeonScene-${portal.link}`);
            }
        }
    }
}

class DungeonScene extends BaseScene {
    constructor(num) {
        super(`DungeonScene-${num}`);
        this.num = num;
    }

    preload() {
        this.load.image('tiles', 'static/img/dungeonWalls.png');
        this.load.tilemapTiledJSON(`map-${this.num}`, `http://localhost:8087/phaser/game/rooms/DungeonScene-${this.num}`);
        this.load.spritesheet('megaset', 'static/img/dungeonTileSet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('wallset', 'static/img/dungeonWalls.png', { frameWidth: 16, frameHeight: 16 });
    }
}

var config = {
    type: Phaser.CANVAS,
    pixelArt: true,
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 700,
        height: 400
    },
    physics: {
        default: 'arcade',
    },
    scene: [BaseScene]
};

var game = new Phaser.Game(config);
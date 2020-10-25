class BaseScene extends Phaser.Scene {
    constructor(name = 'BaseScene') {
        super(name);
        this.player;
        this.prevFrame;
        this.cursor;
        this.pointer;
        this.portals;
        this.portalLayer;
    }
    preload() {
        this.cache.tilemap.remove('map');
        this.load.image('tiles', 'static/img/dungeonWalls.png');
        this.load.tilemapTiledJSON('map', 'static/maps/map-0.json');
        this.load.spritesheet('base', 'static/img/base.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('megaset', 'static/img/dungeonTileSet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('wallset', 'static/img/dungeonWalls.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        let map = this.add.tilemap('map');
        let tiles = map.addTilesetImage('dungeonWalls', 'tiles');
        let floors = map.createStaticLayer('floors', tiles, 0, 0);
        let walls = map.createStaticLayer('walls', tiles, 0, 0);

        walls.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true);
        this.portals = this.physics.add.staticGroup();
        this.portalsLayer = map.getObjectLayer('portals')['objects'];
        this.portalsLayer.forEach(object => {
            let obj = this.portals.create(object.x, object.y, 'wallset', object.type);
            obj.link = object.properties[0].value;
            obj.teleports = object.properties[1].value;
        });

        this.player = this.physics.add.sprite(400, 300, 'base');

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('base', { frames: [20, 21, 22, 23] }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('base', { frames: [28, 29, 30, 31] }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('base', { frames: [4, 5, 6, 7] }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('base', { frames: [12, 13, 14, 15] }),
            frameRate: 6,
            repeat: -1
        });

        this.physics.add.overlap(this.player, this.portals, null, this.moveRooms, this);

        const orcLeader = this.physics.add.image(350, 250, 'megaset', '164');
        const orcBrown = this.physics.add.image(325, 250, 'megaset', '163');
        const orcGreen = this.physics.add.image(300, 250, 'megaset', '162');

        this.physics.add.collider(this.player, orcBrown);
        this.physics.add.collider(this.player, orcGreen);
        this.physics.add.collider(this.player, orcLeader);

        this.physics.add.collider(orcLeader, orcBrown);
        this.physics.add.collider(orcLeader, orcGreen);
        this.physics.add.collider(orcBrown, orcGreen);

        this.physics.add.collider(this.player, walls);
        this.physics.add.collider(orcLeader, walls);
        this.physics.add.collider(orcBrown, walls);
        this.physics.add.collider(orcGreen, walls);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.pointer = this.input.activePointer;

        orcLeader.setVelocity(50, 50);
        orcLeader.setBounce(1, 1);
        orcLeader.setCollideWorldBounds(true);

        orcBrown.setVelocity(50, 50);
        orcBrown.setBounce(1, 1);
        orcBrown.setCollideWorldBounds(true);

        orcGreen.setVelocity(50, 50);
        orcGreen.setBounce(1, 1);
        orcGreen.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, map.widthInPixels + 100, map.heightInPixels + 100);
        this.cameras.main.startFollow(this.player, false, .5, .5);
    }

    update() {
        this.player.setVelocity(0);
        this.input.on('pointerdown', (pointer) => {
            let pointOffset = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            this.player.setX(pointOffset.x);
            this.player.setY(pointOffset.y);
        });
        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
            if (this.cursors.down.isDown) {
                this.player.setVelocityY(100);
                this.prevFrame = 12;
                if (this.cursors.shift.isDown) {
                    this.player.setVelocityY(160);
                }
            }

            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-100);
                this.prevFrame = 4;
                if (this.cursors.shift.isDown) {
                    this.player.setVelocityY(-160);
                }
            }

            if (this.cursors.right.isDown) {
                this.player.setVelocityX(100);
                this.prevFrame = 28;
                if (this.cursors.shift.isDown) {
                    this.player.setVelocityX(160);
                }
            }

            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-100);
                this.prevFrame = 20;
                if (this.cursors.shift.isDown) {
                    this.player.setVelocityX(-160);
                }
            }

            switch (this.prevFrame) {
                case 4: this.player.play('up', true);
                    break;
                case 12: this.player.play('down', true);
                    break;
                case 20: this.player.play('left', true);
                    break;
                case 28: this.player.play('right', true);
                    break;
            }
        } else {
            this.player.setFrame(this.prevFrame);
        }
    }

    moveRooms(player, portal) {
        if (portal.teleports === true) {
            if (this.scene.getIndex(`DungeonScene-${portal.link}`) === -1) {
                this.scene.add(`DungeonScene-${portal.link}`, new DungeonScene(portal.link), false);
            } else {
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
        this.cache.tilemap.remove('map');
        this.load.image('tiles', 'static/img/dungeonWalls.png');
        this.load.tilemapTiledJSON('map', `static/maps/map-${this.num}.json`);
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

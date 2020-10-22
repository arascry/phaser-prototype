class BaseScene extends Phaser.Scene {
    constructor(name = 'BaseScene') {
        super(name);
        this.player;
        this.cursor;
        this.portals;
        this.portalLayer;
    }
    preload() {
        this.cache.tilemap.remove('map');
        this.load.image('tiles', 'static/img/dungeonWalls.png');
        this.load.tilemapTiledJSON('map', 'static/img/map-0.json');
        this.load.spritesheet('megaset', 'static/img/dungeonTileSet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('wallset', 'static/img/dungeonWalls.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        let map = this.add.tilemap('map');
        let tiles = map.addTilesetImage('dungeonWalls', 'tiles');
        let floors = map.createStaticLayer('floors', tiles, 0, 0);
        let walls = map.createStaticLayer('walls', tiles, 0, 0);

        walls.setCollisionByProperty({ collides: true });

        this.portals = this.physics.add.staticGroup();
        this.portalsLayer = map.getObjectLayer('portals')['objects'];
        this.portalsLayer.forEach(object => {
            let obj = this.portals.create(object.x, object.y, 'wallset', object.type);
            obj.link = object.properties[0].value;
            obj.teleports = object.properties[1].value;
        });


        this.player = this.physics.add.image(400, 300, 'megaset', '252');
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

        orcLeader.setVelocity(50, 50);
        orcLeader.setBounce(1, 1);
        orcLeader.setCollideWorldBounds(true);

        orcBrown.setVelocity(50, 50);
        orcBrown.setBounce(1, 1);
        orcBrown.setCollideWorldBounds(true);

        orcGreen.setVelocity(50, 50);
        orcGreen.setBounce(1, 1);
        orcGreen.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        }

        if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        }

        if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
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
        this.load.tilemapTiledJSON('map', `static/img/map-${this.num}.json`);
        this.load.spritesheet('megaset', 'static/img/dungeonTileSet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('wallset', 'static/img/dungeonWalls.png', { frameWidth: 16, frameHeight: 16 });
    }
}

var config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: 1000,
    height: 1000,
    zoom: 2,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    physics: {
        default: 'arcade',
    },
    scene: [BaseScene]
};

var game = new Phaser.Game(config);

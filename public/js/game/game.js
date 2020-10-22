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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursor;
var portals;
var portalLayer;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', 'static/img/dungeonWalls.png');
    this.load.tilemapTiledJSON('map', 'static/img/mapZero.json');
    this.load.spritesheet('megaset', 'static/img/dungeonTileSet.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('wallset', 'static/img/dungeonWalls.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {

    let map = this.add.tilemap('map');
    let tiles = map.addTilesetImage('dungeonWalls', 'tiles');
    let floors = map.createStaticLayer('floors', tiles, 0, 0);
    let walls = map.createStaticLayer('walls', tiles, 0, 0);

    walls.setCollisionByProperty({ collides: true });

    portals = this.physics.add.staticGroup();
    portalsLayer = map.getObjectLayer('portals')['objects'];
    portalsLayer.forEach(object => {
        let obj = portals.create(object.x, object.y, 'wallset', object.type);
        obj.setOrigin(0);
    });


    player = this.physics.add.image(400, 300, 'megaset', '252');
    this.physics.add.overlap(player, portals, moveRooms, null, this);

    const orcLeader = this.physics.add.image(350, 250, 'megaset', '164');
    const orcBrown = this.physics.add.image(325, 250, 'megaset', '163');
    const orcGreen = this.physics.add.image(300, 250, 'megaset', '162');

    this.physics.add.collider(player, orcBrown);
    this.physics.add.collider(player, orcGreen);
    this.physics.add.collider(player, orcLeader);

    this.physics.add.collider(orcLeader, orcBrown);
    this.physics.add.collider(orcLeader, orcGreen);
    this.physics.add.collider(orcBrown, orcGreen);

    this.physics.add.collider(player, walls);
    this.physics.add.collider(orcLeader, walls);
    this.physics.add.collider(orcBrown, walls);
    this.physics.add.collider(orcGreen, walls);

    cursors = this.input.keyboard.createCursorKeys();

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

function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    }

    if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    }

    if (cursors.down.isDown) {
        player.setVelocityY(160);
    }
}

function moveRooms(player, portal) {
    console.log('Player hit portal!');
}
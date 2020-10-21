var config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: 1000,
    height: 1000,
    zoom: 2,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', 'static/img/dungeonWalls.png');
    this.load.tilemapTiledJSON('map', 'static/img/map.json');
    this.load.spritesheet('megaset', 'static/img/dungeonTileSet.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {


    let map = this.add.tilemap('map');
    let tiles = map.addTilesetImage('dungeonWalls', 'tiles');
    let floors = map.createStaticLayer('floors', tiles, 0, 0);
    let walls = map.createStaticLayer('walls', tiles, 0, 0);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    walls.setCollisionByProperty({ collides: true });

    const orcLeader = this.physics.add.image(350, 250, 'megaset', '164');
    const orcBrown = this.physics.add.image(325, 250, 'megaset', '163');
    const orcGreen = this.physics.add.image(300, 250, 'megaset', '162');

    this.physics.add.collider(orcLeader, orcBrown);
    this.physics.add.collider(orcLeader, orcGreen);
    this.physics.add.collider(orcBrown, orcGreen);

    this.physics.add.collider(orcLeader, walls);
    this.physics.add.collider(orcBrown, walls);
    this.physics.add.collider(orcGreen, walls);


    orcLeader.setVelocity(100, 200);
    orcLeader.setBounce(1, 1);
    orcLeader.setCollideWorldBounds(true);

    orcBrown.setVelocity(100, 250);
    orcBrown.setBounce(1, 1);
    orcBrown.setCollideWorldBounds(true);

    orcGreen.setVelocity(100, 150);
    orcGreen.setBounce(1, 1);
    orcGreen.setCollideWorldBounds(true);
}
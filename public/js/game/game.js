var config = {
    type: Phaser.AUTO,
    antialias: false,
    width: 800,
    height: 600,
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
    this.load.spritesheet('megaset', 'static/img/dungeonTileSet.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {
    const orcLeader = this.physics.add.image(300, 300, 'megaset', '164').setDisplaySize(100, 100);
    const orcBrown = this.physics.add.image(400, 300, 'megaset', '163').setDisplaySize(100, 100);
    const orcGreen = this.physics.add.image(500, 300, 'megaset', '162').setDisplaySize(100, 100);

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
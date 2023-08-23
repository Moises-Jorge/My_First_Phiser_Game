class Scene01 extends Phaser.Scene {
    constructor() {
        super('Scene01')
    }

    // Método para o carregamento dos recursos iniciais do jogo.
    preload() {
        this.load.image('sky', 'img/sky.png')
        this.load.spritesheet('player', 'img/player.png', {frameWidth: 32, frameHeight: 32}) // spritesheet pq está a se carregar um ficheiro com várias imagens, onde cada uma delas representa uma posição diferente do personagem.
    }

    // Método para a criação e configuração inicial desses recursos no jogo
    create() {
        this.sky = this.add.image(0, 0, 'sky').setOrigin(0, 0)
        this.sky.displayWidth = 800
        this.sky.displayHeight = 600

        this.player = this.physics.add.sprite(50, 500, 'player')
        .setCollideWorldBounds(true)
        .setScale(2, 2) // Alterando o tamanho do persogem. Por ser um método que pode ser encadeado, então pode se usar deste jeito. É a mesma coisa que fazer: "this.player = algo.func1().func2().funcN"
        
    }

    // Método de Actualização, onde vai se estabelecer as dinâmicas e regras do jogo.
    update() {

    }
}
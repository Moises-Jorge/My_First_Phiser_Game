class Scene01 extends Phaser.Scene {
    constructor() {
        super('Scene01')
    }

    // Método para o carregamento dos recursos iniciais do jogo.
    preload() {
        this.load.image('sky', 'img/sky.png')
    }

    // Método para a criação e configuração inicial desses recursos no jogo
    create() {
        this.sky = this.add.image(0, 0, 'sky').setOrigin(0, 0)
        this.sky.displayWidth = 800
        this.sky.displayHeight = 600
    }

    // Método de Actualização, onde vai se estabelecer as dinâmicas e regras do jogo.
    update() {

    }
}
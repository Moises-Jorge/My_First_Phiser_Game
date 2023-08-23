let game

window.onload = function() {
    // Definição da constante de configuração
    const config = {
        type: Phaser.AUTO, // Definição do tipo de tecnologia que vai ser usado para renderizar o jogo. Também poderíamos usar: Phaser.Canvas || Phaser.WebGL
        width: 800, // Definição da largura e altura da tela do jogo
        height: 600,
        scene: [Scene01],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y: 1000}
            }
        },
        pixelArt: true
    }

    game = new Phaser.Game(config) // esta var foi declarada de forma global, mas foi refenciada aqui dentro da função.
}
class Scene01 extends Phaser.Scene {
    constructor() {
        super('Scene01')
    }

    // Método para o carregamento dos recursos iniciais do jogo.
    preload() {
        this.load.image('sky', 'img/sky.png')
        this.load.spritesheet('player', 'img/player.png', {frameWidth: 32, frameHeight: 32}) // spritesheet pq está a se carregar um ficheiro com várias imagens, onde cada uma delas representa uma posição diferente do personagem.
        this.load.image('platform', 'img/platform.png') // Carrengando a imagem referente as plataformas

    }

    // Método para a criação e configuração inicial desses recursos no jogo
    create() {
        this.sky = this.add.image(0, 0, 'sky').setOrigin(0, 0)
        this.sky.displayWidth = 800
        this.sky.displayHeight = 600

        this.player = this.physics.add.sprite(50, 500, 'player')
        .setCollideWorldBounds(true)
        .setScale(2, 2) // Alterando o tamanho do persogem. Por ser um método que pode ser encadeado, então pode se usar deste jeito. É a mesma coisa que fazer: "this.player = algo.func1().func2().funcN"
        this.player.canJump = true // Atributo que vai controlar/regular o salto do personagem
        
        this.control = this.input.keyboard.createCursorKeys() // createCursorKeys(): método responsável por criar objecto capaz de controlar os eventos das teclas pressionadas.
        
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(0, 600, 'platform') // Até aqui se criou as plataformas, porém, o personagem ainda não colide nas plataformas. Para resolver isso, fizemo:
        .setScale(2, 1) // essa função multiplica o valor da imagem pelos valores passados por parámetro. Sendo que o primero é o "X" e o segundo é o "Y"
        .setOrigin(0, 1) 
        .refreshBody() // para actualizar as carecterísticas físicas do objecto depois da sua criação.
        this.platforms.create(200, 200, 'platform') // Criando outras plataformas...
        this.platforms.create(600, 400, 'platform').setScale(0.75, 1) // reduzindo o tamanho da plataforma
        .refreshBody()

        this.physics.add.collider(this.player, this.platforms) // Quer dizer que toda a plataforma já vai colidir com o personagem
    }

    // Método de Actualização, onde vai se estabelecer as dinâmicas e regras do jogo.
    update() {
        // Movimentando o jogador no eixo "X"
        if (this.control.left.isDown) // Se a tecla de movimentação "esquerda" for pressionada...
            this.player.setVelocityX(-150) //... o jogador move-se para a esquerda no eixo "X"
        else if (this.control.right.isDown)
            this.player.setVelocityX(150)
        else    this.player.setVelocityX(0)

        // Movimentando o jogador no eixo "Y"
        if (this.control.up.isDown && this.player.canJump) { // Se a tecla de movimentação "cima" for pressionada...
            this.player.setVelocityY(-500) // ... o jogador move-se para cima (eixo "Y"), mas ele será sempre puxado para baixo, porque estamos trabalhando com a gravidade
            this.player.canJump = false // se o personagem já tiver saltado, então já não pode mais saltar. Desse modo, vamos precisar recuperar o valor "true" no objecto "canJump" para que o personagem possa saltar novamente; senão, o personagem nunca mais volta a saltar
        }
        // Recuperando o valor "true" no objecto "canJump"
        if (!this.control.up.isDown && !this.player.canJump) // Se a tecla "cima" NÃO(!) tiver sido pressionada e o jogador não poder pular (objecto "canJump" tiver o valor "false")...
            this.player.canJump = true // atribuímos de novo o valor "true" no objecto "canJump"
    }
}


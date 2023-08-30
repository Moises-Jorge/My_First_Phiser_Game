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
        this.sky.displayWidth = 1000
        this.sky.displayHeight = 600

        this.player = this.physics.add.sprite(50, 500, 'player')
        .setCollideWorldBounds(true)
        .setScale(2, 2) // Alterando o tamanho do persogem. Por ser um método que pode ser encadeado, então pode se usar deste jeito. É a mesma coisa que fazer: "this.player = algo.func1().func2().funcN"
        .setBounce(0.4) // De acordo com o valor passado, o personagem dá um salto quando cai de um salto/plataforma (para não ser uma queda estática)
        this.player.canJump = true // Atributo que vai controlar/regular o salto do personagem

        // CRIANDO A ANIMAÇÃO
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }), // Dividindo colocando índices à cada posição do spriteSheet do personagem
            frameRate: 8, // Definindo a velocidade da animação
            repeat: -1 // Informando o número de vezes que a animação vai se repetir. O -1 implica que vai se repetir infinitamente
        }) // ATÉ AQUI TERMINAMOS DE CRIAR A NOSSA ANIMAÇÃO. PODEMOS CRIAR OUTRAS ANIMAÇÕES SE FOR NECESSÁRIO. AGORA, DEVEMOS CHAMAR ESSA ANIMAÇÃO PARA QUE ELA SEJA APLICADA ENQUANTO O PERSONAGEM SE MOVE
        
        this.control = this.input.keyboard.createCursorKeys() // createCursorKeys(): método responsável por criar objecto capaz de controlar os eventos das teclas pressionadas.
        
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(0, 600, 'platform') // Até aqui se criou as plataformas, porém, o personagem ainda não colide nas plataformas. Para resolver isso, fizemo:
        .setScale(2.5, 1) // essa função multiplica o valor da imagem pelos valores passados por parámetro. Sendo que o primero é o "X" e o segundo é o "Y"
        .setOrigin(0, 1) 
        .refreshBody() // para actualizar as carecterísticas físicas do objecto depois da sua criação.
        this.platforms.create(200, 200, 'platform') // Criando outras plataformas...
        this.platforms.create(1100, 200, 'platform')
        this.platforms.create(1100, 475, 'platform')
        this.platforms.create(600, 400, 'platform').setScale(0.75, 1) // reduzindo o tamanho da plataforma
        .refreshBody()

        this.physics.add.collider(this.player, this.platforms) // Quer dizer que toda a plataforma já vai colidir com o personagem

        this.physics.world.setBounds(0,0,1000,600) // Redimensionando o mundo de jogo
        this.cameras.main.startFollow(this.player) // configuração para a câmera seguir o personagem ao longo da tela
        this.cameras.main.setBounds(0,0,1000,600) // Aqui estamos configurando a câmera para respeitar os limites do mundo do jogo, ou seja, só segue o personagem, se este começa a se aproximar do limite da tela (pode ser aplicado a chamada encadeada de funções neste caso, já que estamos nos ferindo ao mesmo objecto)

    }

    // Método de Actualização, onde vai se estabelecer as dinâmicas e regras do jogo.
    update() {
        // Movimentando o jogador no eixo "X"
        if (this.control.left.isDown) { // Se a tecla de movimentação "esquerda" for pressionada...
            this.player.anims.play('walk', true) // Chamando a animação e definindo o parâmetro "true" para que a animação seja executada ao mesmo tempo com a movimentação
            this.player.flipX = true // flipX = true: o personagem vira para a esquerda quando estiver se movimentando para a esquerda
            this.player.setVelocityX(-150) //... o jogador move-se para a esquerda no eixo "X"
        }
        else if (this.control.right.isDown) {
            this.player.anims.play('walk', true)
            this.player.flipX = false // flipX = false: o personagem vira para a direita quando estiver se movimentando para a direita
            this.player.setVelocityX(150)
        }
        else {
            this.player.setVelocityX(0)
            this.player.setFrame(0) // Fica sem animação (parado), se nenhum botão for pressionado
        }

        // Movimentando o jogador no eixo "Y"
        if (this.control.up.isDown && this.player.canJump && this.player.body.touching.down) { // Se a tecla de movimentação "cima" for pressionada...
            this.player.setVelocityY(-500) // ... o jogador move-se para cima (eixo "Y"), mas ele será sempre puxado para baixo, porque estamos trabalhando com a gravidade
            this.player.canJump = false // se o personagem já tiver saltado, então já não pode mais saltar. Desse modo, vamos precisar recuperar o valor "true" no objecto "canJump" para que o personagem possa saltar novamente; senão, o personagem nunca mais volta a saltar
        }
        // Recuperando o valor "true" no objecto "canJump"
        if (!this.control.up.isDown && !this.player.canJump && this.player.body.touching.down) {// Se a tecla "cima" NÃO(!) tiver sido pressionada e o jogador não poder pular (objecto "canJump" tiver o valor "false")...
            this.player.canJump = true // atribuímos de novo o valor "true" no objecto "canJump"
        }

        if (!this.player.body.touching.down) { // Animação aplicada quando o personagem não estiver colidindo com nada por baixo (pulando/caindo)
            this.player.setFrame(
                this.player.body.velocity.y < 0 ? 1 : 3 // se a velocidade do personagem no eixo y for menor que zero(pulando), recebe animação "1"
            )
        }
    }
}


class Scene01 extends Phaser.Scene {
    constructor() {
        super('Scene01')
    }

    // Método para o carregamento dos recursos iniciais do jogo.
    preload() {
        this.load.image('sky', 'img/sky.png')
        this.load.spritesheet('player', 'img/player.png', {frameWidth: 32, frameHeight: 32}) // spritesheet pq está a se carregar um ficheiro com várias imagens, onde cada uma delas representa uma posição diferente do personagem.
        this.load.image('platform', 'img/platform.png') // Carrengando a imagem referente as plataformas
        this.load.spritesheet('coin', 'img/coin.png', {frameWidth: 32, frameHeight: 32}) // Carregando as moedas
        this.load.image('enemy', 'img/enemy.png') // Carrengo o objecto que vai servir de inimigo/ameça para o personagem

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
        this.player.body.setSize(16, 32)// Redimensionando a área ocupada pelo personagem

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
        this.platforms.create(1090, 475, 'platform')
        this.platforms.create(600, 400, 'platform').setScale(0.75, 1) // reduzindo o tamanho da plataforma
        .refreshBody()

        // CRIANDO PLATAFORMAS DINÂMICA (que se movem na tela)
        this.mPlatforms = this.physics.add.group({
            allowGravity: false, // Anulando a ação da gravidade (o objecto já não vai cair)
            immovable: true // Para não se mover quando colidirem com o personagem
        }) // criando o grupo de plataformas dinâmicas

        let mPlatform = this.mPlatforms.create(150, 475, 'platform').setScale(0.25, 1) // criando uma plataforma dinâmica e atribuindo à uma variável
            mPlatform.speed = 2 // velociadade em que a plataforma vai se mover no eixo x
            mPlatform.minX = 150 // Posição mínima/inicial da plataforma
            mPlatform.maxX = 300 // Posição máxima/final em que a plataforma vai se mover

            mPlatform = this.mPlatforms.create(500, 280, 'platform').setScale(0.25, 1) // criando outra plataforma dinâmica
            mPlatform.speed = 1 // velociadade em que a plataforma vai se mover no eixo x
            mPlatform.minX = 500 // Posição mínima/inicial da plataforma
            mPlatform.maxX = 800 // Posição máxima/final em que a plataforma vai se mover
        
        // CRIANDO O GRUPO DE MOEDAS: e vamos criar também as moedas exatamente neste momento da criação do grupo
        this.coins = this.physics.add.group({
            key: 'coin', // Nome da imagem que estamos usando para criar as moedas
            repeat: 14, // O número de moedas que vai ser criado
            setXY: { // Objecto que se refere ao posicinamento das moedas
                x: 12, // Onde vai ser coloacada a primeira moeda
                y: -50, // O ponto em que moedas vão começar a cair (por esta razão algumas delas vão ficar por cima da plataformas)
                stepX: 70 // Valor referente ao distanciamento das moedas
            }
        })

        // Criando a animação das moedas(porque elas ficam girando na tela)
        this.anims.create({
            key: 'spin', // Nome da animação (é spin pq as moedas ficam girando na tela)
            frames: this.anims.generateFrameNumbers('coin', { // É aqui onde se divide o sprite por índices
                start: 0, // O índice atribuído à primeira imagem do spritesheet
                end: 4 // Índice atribuído à última imagem do spritesheet
            }),
            frameRate: 8, // Velocidade da animação
            repeat: -1 // O número de vezes que a animação vai se repetir (-1 significa que nunca vai parar de se repetir)
        })

        // Aplicando Bounce e Animação Spin a cada elemento que faz parte do grupo de moedas
        this.coins.children.iterate((c) => {
            c.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)) // Aplicando o efeito Bounce
            c.anims.play('spin') // Aplicando a animação
        })

        // Criando o placar para contabilizar as moedas recolhidas
        this.score = 0 // contador das moedas recolhidas
        this.txtScore = this.add.text(15, 15, `SCORE: ${this.score}`, {fontSize: '32px'}).setShadow(0, 0, '#000', 3).setScrollFactor(0)
        this.setScore() // Método que vai actualizar o placar sempre que uma moeda for apanhada

        // Criando o grupo para a configuração de inimigos/ameaças
        this.enemies = this.physics.add.group()
        let enemy = this.enemies.create(Phaser.Math.Between(50, 950), 0, 'enemy').setBounce(1).setCollideWorldBounds(true).setVelocity(Math.random() < 0.5 ? -200 : 200)


        this.physics.add.collider(this.player, this.platforms) // Quer dizer que toda a plataforma já vai colidir com o personagem
        this.physics.add.collider(this.coins, this.platforms) // Para as moedas colidirem com as plataformas
        this.physics.add.collider(this.enemies, this.platforms) // Para as ameaças colidirem com as plataformas
        this.physics.add.collider(this.player, this.mPlatforms, this.platformMovingThings) // os dois elementos são passados automaticamente neste caso
        this.physics.add.collider(this.coins, this.mPlatforms, this.platformMovingThings) // Para as moedas coliderem com as plataformas móveis e se manterem lá de acordo com o movimento das plataformas
        this.physics.add.collider(this.enemies, this.mPlatforms) // Para as ameaças colidirem com as plataformas móveis
        this.physics.add.collider(this.player, this.enemies, this.enemyHit, null, this) // Colisão entre o personagem com o inimigo
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this) // Sobreposição quando o personagem entrar em contacto com as moedas. O "this" refere-se ao contexto da função que foi chamada

        this.physics.world.setBounds(0,0,1000,600) // Redimensionando o mundo de jogo
        this.cameras.main.startFollow(this.player) // configuração para a câmera seguir o personagem ao longo da tela
        this.cameras.main.setBounds(0,0,1000,600) // Aqui estamos configurando a câmera para respeitar os limites do mundo do jogo, ou seja, só segue o personagem, se este começa a se aproximar do limite da tela (pode ser aplicado a chamada encadeada de funções neste caso, já que estamos nos ferindo ao mesmo objecto)

        this.gameOver = false // Variável que controla o fim do jogo
    }

    // Método de Actualização, onde vai se estabelecer as dinâmicas e regras do jogo.
    update() {
        if (!this.gameOver) {
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

            // Aplicando o método "movePlatform" para todos os objectos do grupo dinâminco de plataformas
            this.mPlatforms.children.iterate((plat) => {
                this.movePlatform(plat)
            })
        }
    }

    // MÉTODO PARA MOVIMENTAR AS PLATAFORMAS DINÂMICAS (auxiliar)
    movePlatform(plat) { // plat: representa a plataforma que é passada por parâmetro
        if (plat.x < plat.minX || plat.x > plat.maxX) {
            plat.speed *= -1 // speed = speed * (-1). Para mudar a direção do objecto (negativo move para esquerda no eixo X)
        }
        plat.x += plat.speed // Depois de mudar a direção, agora é necessário mover-se, então vamos modificar a posição da plataforma em função da sua velocidade. Agora só basta chamar a função.
    }

    // MÉTODO RESPONSÁVEL POR MOVIMENTAR A PLATAFORMA COM OS OBJECTOS QUE ESTIVEREM SOBRE ELE
    platformMovingThings(sprite, plat) { // O método recebe o objecto e a plataforma
        sprite.x += plat.speed
    }

    // MÉTODO RESPONSÁVEL PELA COLHEITA DAS MOEDAS
    collectCoin(player, coin) {
        coin.destroy()
        this.score++
        this.setScore()
    }

    // MÉTODO RESPONSÁVEL POR ACTUALIZAR O PLACAR
    setScore() {
        this.txtScore.setText(this.score > 9 ? `SCORE: ${this.score}` : `SCORE: 0${this.score}`)
    }

    // MÉTODO RESPONSÁVEL POR MATAR O PERSONAGEM (ACTIVAR O GAME OVER)
    enemyHit(player, enemy) {
        this.physics.pause()
        player.anims.stop()
        player.setTint(0xff0000)
        this.gameOver = true
    }
}


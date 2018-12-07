(function() {
  var width = window.innerWidth;
  var height = window.innerHeight > 480 ? 480 : window.innerHeight;
  var gameScore = 0;
  var highScore = 0;
  var collecties;
  var solved = false;
  var runForrest = {
    prepForrest: function() {
      this.game = new Phaser.Game(width, height, Phaser.CANVAS, '');
      this.game.state.add("load", this.load);
      this.game.state.add("title", this.title);
      this.game.state.add("play", this.play);
      this.game.state.add("gameOver", this.gameOver);
      this.game.state.start("load");
    },
    load: {
      preload: function() {
        this.game.load.image('platform', 'assets/ground1.png');

        this.game.load.spritesheet('trump-run', 'assets/trump_run.png', 90,90 );//38, 63);
        this.game.load.image('runnerBack', 'assets/dess.png');
        this.game.load.image("logo", "https://cdn.glitch.com/fc02ae88-423e-41c5-9598-355a32541bb5%2Fgame-logo.png?1544182444735");
        this.game.load.image("game-over", "assets/game-over.png");
        this.game.load.image("startMado", "assets/start-btn.png");
        this.game.load.image("playGameButton", "assets/play-btn.png");
      //  this.game.load.image("replayGameButton", "assets/play-btn.png");
        this.game.load.image('moneyyy', 'assets/download.png');

      },
      create: function() {
        this.game.state.start("title");
      }
    },
    // title screen
    title: {
      create: function() {
        this.bg = this.game.add.tileSprite(0, 0, width, height, 'runnerBack');
        this.logo = this.game.add.sprite(0,0 , 'logo');
        this.logo.scale.setTo(0.6, 0.6);
        this.logo.x = this.game.world.width / 2 - this.logo.width/2;
        this.logo.y = this.logo.height/2;
        this.logo.alpha = 0;
        this.game.add.tween(this.logo).to({
          alpha: 1
            }, 1000, Phaser.Easing.Linear.None, true, 0);
        this.startMado = this.game.add.button(this.game.world.width / 2 - 159, this.game.world.height - 120, 'startMado', this.startClicked);
        this.startMado.alpha = 0;
        this.game.add.tween(this.startMado).to({
          alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 1000);
      },
      startClicked: function() {
        this.game.state.start("play");
      },
    },
    play: {
      create: function() {
        highScore = gameScore > highScore ? Math.floor(gameScore) : highScore;
        gameScore = 0;
        this.currentFrame = 0;
        this.particleInterval = 2 * 60;
        this.gameSpeed = 580;
        this.isGameOver = false;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bg = this.game.add.tileSprite(0, 0, width, height, 'runnerBack');

        this.bg.fixedToCamera = true;
        this.bg.autoScroll(-this.gameSpeed / 6, 0);
        this.cloudyWithAChance = this.game.add.emitter(this.game.world.centerX, -32, 50);
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;
        this.platforms.createMultiple(5, 'platform', 0, false);
        this.platforms.setAll('anchor.x', 0.1);
        this.platforms.setAll('anchor.y', 0.25);
        var plat;
        for (var i = 0; i < 5; i++) {
          plat = this.platforms.getFirstExists(false);
          plat.reset(i * 192, this.game.world.height - 24);
          plat.width = 111;
          plat.height = 24;
          this.game.physics.arcade.enable(plat);
          plat.body.immovable = true;
          plat.body.bounce.set(0);
        }
        this.lastPlatform = plat;
        this.forrest = this.game.add.sprite(100, this.game.world.height - 200, 'trump-run');
        this.forrest.animations.add("run");
        this.forrest.animations.play('run', 20, true);
        this.game.physics.arcade.enable(this.forrest);
        this.forrest.body.gravity.y = 1500;
        this.forrest.body.collideWorldBounds = true;
        this.cloudyWithAChance.makeParticles('moneyyy');
        this.cloudyWithAChance.maxParticleScale = .15;
        this.cloudyWithAChance.minParticleScale = .01;
        this.cloudyWithAChance.setYSpeed(100, 200);
        this.cloudyWithAChance.gravity = 0;
        this.cloudyWithAChance.width = this.game.world.width * 1.5;
        this.cloudyWithAChance.minRotation = 0;
        this.cloudyWithAChance.maxRotation = 40;
        this.game.camera.follow(this.forrest);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cloudyWithAChance.start(false, 0, 0);
        this.score = this.game.add.text(20, 20, '-', {
          font: "20px Helvetica",
          fill: "gray",
          fontWeight: "bold"
        });
        this.quest = this.game.add.text(400, 20+20, '',{
          font: "18px Helvetica",
          fill: "white"
        });
        this.quest.anchor.set(0.5);
        collecties = this.game.add.group();
        collecties.enableBody = true;
        // generate starts
      //  for (var i = 0; i < 12; i++) {
      //    var pene;
      //    pene = collecties.create(i * 70, 0, 'star');
        //  pene.body.gravity.y = 300;
        //  pene.body.bounce.y = 0.7 + Math.random() * 0.2;
        //}
        if (highScore > 0) {
          this.highScore = this.game.add.text(20, 45, 'Best: ' + highScore, {
            font: "18px Arial",
            fill: "white"
          });
        }

      },
      update: function() {

        var that = this;
      //  game.physics.arcade.overlap(santa, collecties, collectStar, null, this);
        if (!this.isGameOver) {
          gameScore += .5;
          this.gameSpeed += .03;
          this.score.text = 'Score: ' + Math.floor(gameScore);
          this.currentFrame++;
          var moveAmount = this.gameSpeed / 100;
          this.game.physics.arcade.collide(this.forrest, this.platforms);
          if (this.forrest.body.bottom >= this.game.world.bounds.bottom) {
            this.isGameOver = true;
            this.endGame();
          }
          if (this.cursors.up.isDown && this.forrest.body.touching.down || this.spacebar.isDown && this.forrest.body.touching.down || this.game.input.mousePointer.isDown && this.forrest.body.touching.down || this.game.input.pointer1.isDown && this.forrest.body.touching.down) {
            this.forrest.body.velocity.y = -500;
          }
          if (this.particleInterval === this.currentFrame) {
            this.cloudyWithAChance.makeParticles('moneyyy');
            this.currentFrame = 0;
          }
          this.platforms.children.forEach(function(platform) {
            platform.body.position.x -= moveAmount;
            if (platform.body.right <= 0) {
              platform.kill();
              var plat = that.platforms.getFirstExists(false);
              plat.reset(that.lastPlatform.body.right + 192, that.game.world.height - (Math.floor(Math.random() * 50)) - 24);
              plat.body.immovable = true;
              that.lastPlatform = plat;
            }
          });
        }
      },
      endGame: function() {
        this.game.state.start("gameOver");
      }
    },
    gameOver: {
      create: function() {
        this.bg = this.game.add.tileSprite(0, 0, width, height, 'runnerBack');
        this.msg = this.game.add.sprite(this.game.world.width / 2 - 280.5, 50, 'game-over');
        this.msg.alpha = 0;
        this.game.add.tween(this.msg).to({
          alpha: 1
        }, 600, Phaser.Easing.Linear.None, true, 0);
        this.score = this.game.add.text(this.game.world.width / 2 - 100, 200, 'Score: ' + Math.floor(gameScore), {
          font: "42px Arial",
          fill: "white"
        });
        this.score.alpha = 0;
        this.game.add.tween(this.score).to({
          alpha: 1
        }, 600, Phaser.Easing.Linear.None, true, 600);
        this.replayGameButton = this.game.add.button(this.game.world.width / 2 - 183.5, 280, 'startMado', this.restartClicked);
        this.replayGameButton.alpha = 0;
        this.game.add.tween(this.replayGameButton).to({
          alpha: 1
        }, 600, Phaser.Easing.Linear.None, true, 1000);
      },
      restartClicked: function() {
        this.game.state.start("play");
      },
    }
  };
  runForrest.prepForrest();
})();

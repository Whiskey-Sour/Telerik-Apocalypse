var gameModule = function() {
    var game = {
        startGame: function() {
            return play();
        }
    };

    function play() {
        //Phaser init
        var game = new Phaser.Game(CONSTANTS.screen.width, CONSTANTS.screen.height, Phaser.AUTO, '', {
            preload: preload,
            create: create,
            update: update
        });

        //Container for all physics object groups, and init
        var gameGroupWithPhysics = {
            add: function(groupName) {
                this[groupName] = game.add.group();
                this[groupName].enableBody = true;
            }
        };

        //Loading assets
        function preload() {
            game.load.image('loose', 'assets/loose-screen.png');
            game.load.image('win', 'assets/win-screen.png');
            game.load.image('ground', 'assets/platform.png');
            game.load.image('shot', 'assets/bolt-flipped.png');
            game.load.image('ammo', 'assets/bolt.png');
            game.load.image('key', 'assets/js-logo.png');
            game.load.image('turret', 'assets/turret.png');
            game.load.image('spike', 'assets/spike.png');
            game.load.image('firstaid', 'assets/firstaid.png');
            game.load.image('background', 'assets/game-bg.png');
            game.load.spritesheet('john', 'assets/john.png', frameWidthJohn, frameHeightJohn);
            game.load.spritesheet('robot', 'assets/robot.png', frameWidthBot, frameHeightBot);
            game.load.spritesheet('border', 'assets/border-block.png', 22, 32);
            game.load.audio('jump', 'https://raw.githubusercontent.com/Whiskey-Sour/Beta/Sound/PhaserTest/assets/audio/spaceman.wav');
            game.load.audio('fire', 'https://raw.githubusercontent.com/Whiskey-Sour/Beta/Sound/PhaserTest/assets/audio/pistol.wav');
            game.load.audio('bothit', 'https://raw.githubusercontent.com/Whiskey-Sour/Beta/Sound/PhaserTest/assets/audio/sentry_explode.wav');
            game.load.audio('theme', 'https://raw.githubusercontent.com/Whiskey-Sour/Beta/Sound/PhaserTest/assets/audio/HonkyTonkVillai2.ogg');
            game.load.audio('pickup', 'https://raw.githubusercontent.com/Whiskey-Sour/Beta/Sound/PhaserTest/assets/audio/p-ping.mp3');
            game.load.audio('playerdeath', 'https://raw.githubusercontent.com/Whiskey-Sour/Beta/Sound/PhaserTest/assets/audio/player_death.wav');
            game.load.audio('step', 'https://raw.githubusercontent.com/Whiskey-Sour/Beta/Sound/PhaserTest/assets/audio/0085-1.ogg');
            game.load.audio('playerhit', 'https://raw.githubusercontent.com/Whiskey-Sour/Beta/Sound/PhaserTest/assets/audio/player_hit.wav');
        }

        //Varibles used in the game
        var controller,
            platforms,
            background,
            looseSscreen,
            winScreen,
            player,
            oldLives,
            oldAmmo,
            turret,
            jumpSound,
            fireSound,
            botHitSound,
            themeSound,
            pickupSound,
            playerDeathSound,
            stepSound,
            playerHitSound,
            canJump = true,
            worldHeight = 900,
            xVelocityScale = 175,
            yVelocityScale = 300,
            frameWidthJohn = 158.5,
            frameHeightJohn = 225,
            frameWidthBot = 96,
            frameHeightBot = 202,
            maxRange = 1000,
            neededBonusCount = 4,
            totalBulletVelocityScale = 300;

        // init game
        function create() {
            createWorld();
            createAllGroups();
            createPlatforms();
            createPlayer();
            drawHearts();
            drawAmmo();
            createBots();
            createSpikes();
            createBonusTokens();
            createTurret();
            createSounds();
            createController();
            createEvents()
        }

        // game loop
        function update() {
            //Old values for indicators
            oldLives = player.lives;
            oldAmmo = player.ammo;

            //Updates every game loop iteration
            playerUpdate();
            botsUpdate();
            cameraUpdate();
            playerCollision();
            bulletsUpdate();
            turretUpdate();
            indicatorUpdate(player, oldLives, gameGroupWithPhysics, oldAmmo);
            endGameCheck();
        }

        /*Group Management*/
        function createAllGroups() {
            //The string arguments is the name of the variable used later
            gameGroupWithPhysics.add('platforms');
            gameGroupWithPhysics.add('botBoundaries');
            gameGroupWithPhysics.add('bonus');
            gameGroupWithPhysics.add('bullets');
            gameGroupWithPhysics.add('bots');
            gameGroupWithPhysics.add('lives');
            gameGroupWithPhysics.add('playerAmmo');
            gameGroupWithPhysics.add('spikes');
        }

        function destroyGroup(group) {
            for (var i in group.children) {
                group.children[i].kill();
            }
        }

        /*Populating game world*/
        function createBots() {
            var dir;

            //bots in second segment
            for (var i = 0; i < CONSTANTS.numberOfBots; i += 1) {
                dir = Math.random() >= 0.5 ? 1 : -1;
                createBot(CONSTANTS.screen.width + i * 80, 700, dir);
            }

            //single bot in the first segment
            createBot(550, worldHeight - 650, 1);
        }

        function createWorld() {
            game.world.setBounds(0, 0, CONSTANTS.screen.width * 4, worldHeight);

            game.physics.startSystem(Phaser.Physics.ARCADE);

            background = game.add.sprite(0, 0, 'background');
            background.scale.setTo(3, 1.1);
            background.alpha = 1;
        }

        function SegmentOne() {
            createLedge(400, worldHeight - 200, true);
            createLedge(600, worldHeight - 350, true, 0.5, 1);
            createLedge(0, worldHeight - 400, true);
            createLedge(500, worldHeight - 550, true, 0.75, 1);
        }

        function SegmentTwo() {
            createLedge(CONSTANTS.screen.width, 850, true, 2, 1);
        }

        function SegmentThree() {
            createLedge(1700, 700, false, 0.2, 0.4);
            createLedge(1750, 500, false, 0.2, 0.4);
            createLedge(1900, 600, false, 0.2, 0.4);
            createLedge(1900, 300, false, 0.2, 0.4);
            createLedge(2000, 450, false, 0.4, 0.4);
            createLedge(2400, 700, false, 0.4, 0.4);
        }

        function createPlatforms() {
            //addGround
            var ground = gameGroupWithPhysics.platforms.create(0, game.world.height - 64, 'ground');
            ground.scale.setTo(8, 2);
            ground.body.immovable = true;

            SegmentOne();
            SegmentTwo();
            SegmentThree();
        }

        function createBonusTokens() {
            gameGroupWithPhysics.bonus.create(700, worldHeight - 600, 'key');
            gameGroupWithPhysics.bonus.create(1200, 800, 'key');
            gameGroupWithPhysics.bonus.create(1920, 250, 'key');
            gameGroupWithPhysics.bonus.create(3100, 750, 'key');
        }

        function createSpikes() {
            var spikeCount = 15,
                spike,
                i;

            // for segment three
            for (i = 0; i < spikeCount; i += 1) {
                spike = gameGroupWithPhysics.spikes.create(1700 + i * 50, 800, 'spike');
            }
        }

        function createPlayer() {
            //sprite: placeHolder
            player = game.add.sprite(200, game.world.height - 150, 'john');

            game.physics.arcade.enable(player);

            player.body.gravity.y = 500;
            player.body.collideWorldBounds = true;

            //animation: placeHolder
            player.animations.add('right', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 35, true);
            player.animations.add('left', [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14], 35, true);
            player.animations.add('faceRight', [0], 10, true);
            player.animations.add('faceLeft', [27], 10, true);
            player.animations.add('faceRightJump', [28], 10, true);
            player.animations.add('faceLeftJump', [29], 10, true);

            // additional attributes
            player.scale.setTo(0.25);
            player.lives = 3;
            player.score = 0;
            player.bonusCount = 0;
            player.lastDirection = 1; //right
            player.ammo = 5;
            player.timeOfLastHit = game.time.totalElapsedSeconds();
            player.immortalTime = 1.5;
            player.canBeHurt = true;
        }

        function createTurret() {
            //sprite
            turret = game.add.sprite(3000, 700, 'turret');
            turret.scale.setTo(0.5);
            turret.angle = 30;

            //additional attributes
            turret.reloadTime = 2;
            turret.timeOfLastShot = game.time.totalElapsedSeconds();
        }

        function createSounds() {
            game.sound.volume = 0.5;
            jumpSound = game.add.audio('jump');
            fireSound = game.add.audio('fire');
            botHitSound = game.add.audio('bothit');
            pickupSound = game.add.audio('pickup');
            playerDeathSound = game.add.audio('playerdeath');
            themeSound = game.add.audio('theme');
            stepSound = game.add.audio('step');
            stepSound.volume = 0.5;
            playerHitSound = game.add.audio('playerhit');
            themeSound.loopFull();
        }

        function createEvents(){
            controller.mute.onDown.add(muteSound, this);
        }

        /* Single Object Creators*/
        function bulletPlayer() {
            //generates a bullet coming from player
            var bullet = gameGroupWithPhysics.bullets.create(player.x + 50 * player.lastDirection, player.y, 'shot');
            game.physics.arcade.enable(bullet);

            bullet.body.velocity.x = 300 * player.lastDirection;
            player.ammo -= 1;
            return bullet;
        }

        function bulletTurret() {
            //generates bullet from turret
            var bullet = gameGroupWithPhysics.bullets.create(turret.x - 30, turret.y, 'shot');
            game.physics.arcade.enable(bullet);

            bullet.body.velocity.y = -totalBulletVelocityScale * Math.sin(turret.angle * Math.PI / 180);
            bullet.body.velocity.x = -totalBulletVelocityScale * Math.cos(turret.angle * Math.PI / 180);
            return bullet;
        }

        // Creates ledge. When putBorders is true, adds borders that constrain the bots.
        function createLedge(ledgeX, ledgeY, putBorders, scaleX, scaleY) {
            var platformOriginalWidth = 400,
                platformOriginalHeight = 32,
                borderOriginalWidth = 22,
                scaleX = scaleX || 1,
                scaleY = scaleY || 1,
                ledge,
                ledgeWidth,
                ledgeHeight,
                borderLeft,
                borderRight,
                borderY;

            ledge = gameGroupWithPhysics.platforms.create(ledgeX, ledgeY, 'ground');
            ledge.body.immovable = true;
            ledge.scale.setTo(scaleX, scaleY);

            if (putBorders) {
                ledgeWidth = platformOriginalWidth * scaleX;
                ledgeHeight = platformOriginalHeight * scaleY;

                borderY = ledgeY - ledgeHeight;

                borderLeft = gameGroupWithPhysics.botBoundaries.create(ledgeX - borderOriginalWidth, borderY, 'border');
                borderLeft.body.immovable = true;
                borderLeft.renderable = false;

                borderRight = gameGroupWithPhysics.botBoundaries.create(ledgeX + ledgeWidth, borderY, 'border');
                borderRight.body.immovable = true;
                borderRight.renderable = false;
            }
        }

        function createBot(x, y, dir) {
            var bot = game.add.sprite(x, y, 'robot');

            game.physics.arcade.enable(bot);

            bot.body.gravity.y = 500;
            bot.animations.add('left', [13, 12, 11, 10, 9], 10, true);
            bot.animations.add('right', [1, 2, 3, 4, 5, 6], 10, true);
            bot.scale.setTo(0.3, 0.28);
            bot.direction = dir;
            gameGroupWithPhysics.bots.add(bot);
        }

        /*Player Controlls*/
        function createController() {
            controller = game.input.keyboard.createCursorKeys();
            controller.fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            controller.mute = game.input.keyboard.addKey(Phaser.Keyboard.M);
        }

        /*Draw Functions*/
        function drawHearts() {
            for (var i = 0; i < player.lives; i += 1) {
                var obj = gameGroupWithPhysics.lives.create(i * 50, 20, 'firstaid');
                obj.fixedToCamera = true;
            }
        }

        function drawAmmo() {
            for (var i = 0; i < player.ammo; i += 1) {
                var obj = gameGroupWithPhysics.playerAmmo.create(i * 25, 555, 'ammo');
                obj.fixedToCamera = true;
                obj.scale.setTo(0.75);
            }
        }

        /*Update Function*/
        var timer = 0,
            reloadTimePlayer = 15;

        function playerUpdate() {
            if (player.alive) {
                //collide with ground and platforms
                game.physics.arcade.collide(player, gameGroupWithPhysics.platforms);

                //retain speed in air or make it 0 when touching ground
                if (player.body.touching.down) {
                    player.body.velocity.x = 0;
                    player.body.gravity.x = 0;
                }

                //movement left/right
                if (controller.left.isDown) {
                    player.body.velocity.x = -xVelocityScale;
                    player.animations.play('left');
                    player.lastDirection = -1;

                    if (!stepSound.isPlaying && player.body.touching.down) {
                        stepSound.play();
                    }
                } else if (controller.right.isDown) {
                    player.body.velocity.x = xVelocityScale;
                    player.animations.play('right');
                    player.lastDirection = 1;

                    if (!stepSound.isPlaying && player.body.touching.down) {
                        stepSound.play();
                    }
                } else {
                    //  Stand still
                    if (player.lastDirection == 1) {
                        player.animations.play('faceRight');
                    } else {
                        player.animations.play('faceLeft');
                    }
                }

                if (controller.fire.isDown && timer >= reloadTimePlayer && player.ammo > 0) {
                    bulletPlayer();
                    timer = 0;
                    fireSound.play();
                }

                timer += 1;

                // movement jump
                // prevent continuous jumping
                if (player.body.touching.down && !controller.up.isDown) {
                    canJump = true;
                }

                // Allow the player to jump if they are touching the ground.
                if (controller.up.isDown && player.body.touching.down && canJump) {
                    player.body.velocity.y = -yVelocityScale;
                    canJump = false;
                    jumpSound.play();
                }
                if (controller.up.isDown) {
                    player.body.gravity.y = yVelocityScale;
                } else {
                    player.body.gravity.y = 700;
                }
                if (!player.body.touching.down) {
                    if (player.lastDirection == 1) {
                        player.animations.play('faceRightJump');
                    } else {
                        player.animations.play('faceLeftJump');
                    }
                }

                // resistance in x
                var speed = Math.abs(player.body.velocity.x);
                if (speed > 0) {
                    player.body.gravity.x = (speed / player.body.velocity.x) * 25 * -1;
                }

                //hit track and check if player is invunerable
                player.canBeHurt = player.timeOfLastHit + player.immortalTime < game.time.totalElapsedSeconds();

                if (!player.canBeHurt) {
                    player.alpha = Math.random();
                } else {
                    player.alpha = 1;
                }
            }
        }

        function indicatorUpdate(player, oldLives, gameGroupWithPhysics, oldAmmo) {
            if (player.lives !== oldLives) {
                destroyGroup(gameGroupWithPhysics.lives);
                drawHearts();
            }

            if (player.ammo !== oldAmmo) {
                destroyGroup(gameGroupWithPhysics.playerAmmo);
                drawAmmo();
            }
        }

        function endGameCheck() {
            if (player.alive && player.lives <= 0) {
                player.kill();
                looseSscreen = game.add.sprite(CONSTANTS.endScreen.x, CONSTANTS.endScreen.y, 'loose');
                player.x = 0;
                game.world.bringToTop(looseSscreen);
                playerDeathSound.play();
                window.setTimeout(function() {
                    game.destroy();
                    main.menu.createMenu();
                }, 2500);
            }

            if (player.bonusCount === neededBonusCount) {
                player.kill();
                winScreen = game.add.sprite(CONSTANTS.endScreen.x, CONSTANTS.endScreen.y, 'win');
                player.x = 0;
                game.world.bringToTop(winScreen);
                window.setTimeout(function() {
                    game.destroy();
                    main.menu.createMenu();
                }, 2500);
            }
        }

        function botsUpdate() {
            game.physics.arcade.collide(gameGroupWithPhysics.bots, gameGroupWithPhysics.platforms);
            game.physics.arcade.collide(gameGroupWithPhysics.botBoundaries, gameGroupWithPhysics.bots);
            for (var i in gameGroupWithPhysics.bots.children) {
                botUpdate(gameGroupWithPhysics.bots.children[i]);
            }
        }

        function bulletsUpdate() {
            game.physics.arcade.collide(gameGroupWithPhysics.bullets, gameGroupWithPhysics.platforms);
            game.physics.arcade.overlap(gameGroupWithPhysics.bullets, gameGroupWithPhysics.bots, hitBot, null, this);
            game.physics.arcade.overlap(player, gameGroupWithPhysics.bullets, die, null, this);
            game.physics.arcade.overlap(gameGroupWithPhysics.platforms, gameGroupWithPhysics.bots, hitWall, null, this);
            for (var i in gameGroupWithPhysics.bullets.children) {
                if (gameGroupWithPhysics.bullets.children[i].body.touching.left || gameGroupWithPhysics.bullets.children[i].body.touching.right || gameGroupWithPhysics.bullets.children[i].body.touching.down) {
                    gameGroupWithPhysics.bullets.children[i].kill();
                }
            }
        }

        function botUpdate(bot) {
            if (bot.body.touching.right || bot.body.touching.left) {
                bot.direction *= -1;
            }

            //movement
            bot.body.velocity.x = xVelocityScale * 1.2 * bot.direction;
            if (bot.body.velocity.x <= 0) {
                bot.animations.play('left');
            } else {
                bot.animations.play('right');
            }
        }

        function cameraUpdate() {
            // keeps in the middle of the screen always
            if (game.camera.x < CONSTANTS.screen.width / 2) {
                game.camera.x = 0;
            }

            // left most camera
            if (game.camera.x > CONSTANTS.screen.width * 3 - CONSTANTS.screen.width / 2) {
                game.camera.x = CONSTANTS.screen.width * 3 - CONSTANTS.screen.width / 2;
            }

            // right most camera
            game.camera.x = player.x - CONSTANTS.screen.width / 2;
            game.camera.y = player.y - 300;
        }

        var timeOfLastShotT = 0,
            reloadTime = 2;

        function turretUpdate() {
            var xDistance = Math.abs(turret.x - player.x);
            var yDistance = turret.y - player.y;

            var angle = Math.atan(yDistance / xDistance) * 180 / Math.PI;

            turret.angle = angle;

            if (timeOfLastShotT + reloadTime <= game.time.totalElapsedSeconds() && xDistance < maxRange) {
                bulletTurret();
                timeOfLastShotT = game.time.totalElapsedSeconds();
                fireSound.play();
            }

            turret.angle = angle - 10.1;
        }

        function playerCollision() {
            game.physics.arcade.collide(gameGroupWithPhysics.bonus, platforms);
            game.physics.arcade.overlap(player, gameGroupWithPhysics.bonus, collect, null, this);
            game.physics.arcade.overlap(player, gameGroupWithPhysics.bots, die, null, this);
            game.physics.arcade.overlap(player, gameGroupWithPhysics.spikes, dieSpike, null, this);
        }

        /*Collision Consequences*/
        function collect(player, bon) {
            bon.kill();
            player.bonusCount += 1;
            pickupSound.play();
        }

        function hitBot(bullet, bot) {
            bullet.kill();
            bot.kill();
            botHitSound.play();
        }

        function hitWall(bullet) {
            bullet.kill();
        }

        function die(player) {
            if (player.canBeHurt) {
                player.lives -= 1;
                player.timeOfLastHit = game.time.totalElapsedSeconds();
                playerHitSound.play();
            }
        }

        function dieSpike(player) {
            player.lives = 0;
        }

        function muteSound(){
            game.sound.mute = !game.sound.mute;
        }

        return {
            load: preload,
            create: create,
            loop: update
        };
    }

    return game;
}();

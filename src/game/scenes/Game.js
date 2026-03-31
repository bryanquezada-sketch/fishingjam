import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {        
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');
        this.cameras.main.setBackgroundColor(0x141414);

        this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'player');
        this.player.setCollideWorldBounds(true);
        Phaser.Display.Bounds.SetBottom(this.player, this.scale.height);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys ({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.lastKeyPressed = null;
        this.fishPrompts = [
            "BIG-REEL",
            "REEL", "REEL", "REEL", "REEL", "REEL",
            "STABALIZE-LEFT", "STABALIZE-LEFT", "STABALIZE-LEFT", "STABALIZE-LEFT", "STABALIZE-LEFT", "STABALIZE-LEFT",
            "STABALIZE-RIGHT", "STABALIZE-RIGHT", "STABALIZE-RIGHT", "STABALIZE-RIGHT", "STABALIZE-RIGHT", "STABALIZE-RIGHT",
            "SLACK", "SLACK"
        ]
        this.currentPrompt = null;
        this.correctInput = null;
        
        this.input.keyboard.on('keydown', (e) => {
            this.lastKeyPressed = e;
            console.log(this.lastKeyPressed.key);
            this.checkPromptMatch();
        });

        this.fishTimerMin = 1200
        this.fishTimerMax = 3000

        this.activeFishingTimer = this.time.addEvent({
            delay: Phaser.Math.Between(this.fishTimerMin, this.fishTimerMax),
            callback: this.updatePrompt,
            args: [],
            callbackScope: this,
            loop: true,
        });

        
    }

    checkPromptMatch(){
        if (this.lastKeyPressed.key === this.correctInput) {
            console.log('CORRECT INPUT!')
        } else {
            console.log('WRONG INPUT!')
        }
    }

    updatePrompt(){
        this.currentPrompt = Phaser.Utils.Array.GetRandom(this.fishPrompts);
        this.events.emit('promptChanged', this.currentPrompt);
        this.activeFishingTimer.delay = Phaser.Math.Between(this.fishTimerMin, this.fishTimerMax);
        console.log(this.currentPrompt)

        if (this.currentPrompt === "BIG-REEL"){
            this.correctInput = "w"
        } else if (this.currentPrompt === "REEL") {
            this.correctInput = "s"
        } else if (this.currentPrompt === "STABALIZE-LEFT") {
            this.correctInput = "a"  
        } else if (this.currentPrompt === "STABALIZE-RIGHT") {
            this.correctInput = "d"
        }

        // do something like, promptRepeatCounterPreventer. So like count how many times each prompt was given and if it was given three times in a row, maybe switch to a different array set that's weighted against it or like just...make it so that it can't happen a fourth time. youre smart ull figureitout...with lov, -pastbryan. ps.sotired.
    }

    update()
    {
        //#region Top-Down Controller with Sprint and cancel-logic for opposing arrow keys pressed. Remember to turn off gravity.
        /*
        const playerSpeed = 160;

        let x = 0;
        let y = 0

        if (this.cursors.up.isDown || this.wasd.up.isDown ) {
            y -= playerSpeed;
        }
        if (this.cursors.down.isDown || this.wasd.down.isDown ) {
            y += playerSpeed;
        }
        if (this.cursors.left.isDown || this.wasd.left.isDown ) {
            x -= playerSpeed;
        }
        if (this.cursors.right.isDown || this.wasd.right.isDown ) {
            x += playerSpeed;
        }

        this.player.setVelocity(x, y);

        if (x !== 0 || y !== 0) {
            this.player.body.velocity.normalize().scale(playerSpeed);
            if (this.cursors.shift.isDown) {
                this.player.body.velocity.normalize().scale(playerSpeed * 1.5);
            }
        }
        */
        //#endregion

        //#region Precise Movement 2D Controller with Last Button Pressed logic and Buffer for anti-fat-fingering. Only left and right directions and No Jump(Add that later Bryan)
        /*

        // --- vvv IMPORTANT, ADD THIS TO CREATE vvv ---
        this.stopBuffer = 0;
        this.lastXKey = 'none'
        this.input.keyboard.on('keydown', (e) => {
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                this.lastXKey = 'left';
            } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                this.lastXKey = 'right';
            }
        });
        // --- ^^^ IMPORTANT, ADD THIS TO CREATE ^^^ ---

        const playerSpeed = 160
        const leftDown = this.wasd.left.isDown || this.cursors.left.isDown;
        const rightDown = this.wasd.right.isDown || this.cursors.right.isDown;

        if (leftDown && rightDown) {
            this.stopBuffer = 0;
            if (this.lastXKey === 'left'){
                this.player.setVelocityX(-playerSpeed);
            } else {
                this.player.setVelocityX(playerSpeed);
            } 
        } else if (leftDown) {
            this.stopBuffer = 0;
            this.player.setVelocityX(-playerSpeed)
        } else if (rightDown) {
            this.stopBuffer = 0;
            this.player.setVelocityX(playerSpeed);
        } else {
            this.stopBuffer++;
            if (this.stopBuffer > 2) {
                this.player.setVelocityX(0);
                this.lastXKey = 'none';
            }
        }
        */
        //#endregion
    }
}

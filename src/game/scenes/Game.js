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
            "REEL", "REEL", "REEL", "REEL", "REEL", "REEL", "REEL",
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

        this.fishTimerMin = 2000
        this.fishTimerMax = 4000

        this.activeFishingTimer = this.time.addEvent({
            delay: Phaser.Math.Between(this.fishTimerMin, this.fishTimerMax),
            callback: this.updatePrompt,
            args: [],
            callbackScope: this,
            loop: true,
        });

        this.lineTension = 0;
        
        this.passiveTension = this.time.addEvent({
            delay: 1000,
            callback: this.addPassiveTension,
            args: [],
            callbackScope: this,
            loop: true
        });

        this.fishStamina = 100;

        this.fishFighting = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.fishRegenate();
                this.fishMove();
            },
            args: [],
            callbackScope: this,
            loop: true
        });

        this.fishIsStunned = false;

        this.fishRegenRate = 1.25;

        this.fishDistance = 20;

        this.fishSpeed = 2;

        this.displayTension = this.add.circle(this.scale.width / 2, 80, 16, 0x66ff00, 1);
        this.visualTension = 0;

        this.greenTension = Phaser.Display.Color.IntegerToColor(0x00ff00);
        this.redTension = Phaser.Display.Color.IntegerToColor(0x8B0000);
        // -- END OF CREATE --
    }

    updateTension(targetTension){
        if (this.tensionTween) this.tensionTween.stop();

        this.tensionTween = this.tweens.add({
            targets: this,
            visualTension: Phaser.Math.Clamp(targetTension, 0, 100),
            duration: 200,
            ease: 'Linear',
            onUpdate: () => {
                const percentage = this.visualTension / 100;
                const result = Phaser.Display.Color.Interpolate.ColorWithColor(
                    this.greenTension,
                    this.redTension,
                    1,
                    percentage
                );

                if (percentage >= 0.80) {
                    if (!this.isFlashing) {
                        this.isFlashing = true;
                        this.flashTween = this.tweens.add({
                            targets: this.displayTension,
                            alpha: 0,
                            duration: 100,
                            ease: 'Power2',
                            yoyo: true,
                            repeat: -1
                        });
                    }

                } else {
                    if (this.isFlashing) {
                        if (this.flashTween) this.flashTween.stop();
                        this.isFlashing = false;
                        this.displayTension.setAlpha(1);
                    }
                }

                const hex = Phaser.Display.Color.GetColor(result.r, result.g, result.b);
                this.displayTension.setFillStyle(hex);
            }
        })
    }

    fishMove(){
        if (this.fishIsStunned) return;
        this.events.emit('distanceUpdate', this.fishDistance);
        if (this.fishDistance <= 100){
            this.fishDistance += this.fishSpeed;
        } else {
            console.log('Fish got away...');
        }
    }

    fishStun(){
        if (this.fishIsStunned) return;
        this.fishIsStunned = true;
        this.fishRegenRate = 0;
        this.fishSpeed = 0.5;

        console.log("FISH IS STUNNED AND NOT REGENERATING");
        
        this.time.delayedCall(3000, () =>{
            this.fishIsStunned = false;
            this.fishRegenRate = 1.25;
            this.fishSpeed = 2;
        }, [], this);
    }

    fishRegenate(){
        if (this.fishIsStunned) return;
        if (this.fishStamina >= 100) return;

        this.fishStamina += this.fishRegenRate;
        this.events.emit('staminaUpdate', this.fishStamina);
    }

    addPassiveTension(){
        this.lineTension += 1;
        this.events.emit('tensionChange', this.lineTension);
        this.updateTension(this.lineTension);
    }

    checkPromptMatch(){
        if (this.lastKeyPressed.key.toLowerCase() === this.correctInput) {
            //console.log('CORRECT INPUT!');
            if (this.currentPrompt === "BIG-REEL") {
                this.lineTension += 10;
                this.fishStamina -= 6;
                this.fishDistance -= 2;
                this.fishSpeed = 5;
                this.updateTension(this.lineTension);
            } else if (this.currentPrompt === "REEL") {
                this.lineTension += 3.5; //originally 4. Testing...
                this.fishStamina -= 2.5;
                this.fishDistance -= 1.25
                this.updateTension(this.lineTension);
            } else if (this.currentPrompt === "STABALIZE-LEFT" || this.currentPrompt === "STABALIZE-RIGHT") {
                this.lineTension -= 6.5;
                this.fishStun();
            } else if (this.currentPrompt === "SLACK") {
                this.lineTension -= 17.5;
                this.fishSpeed = 3;
                this.updateTension(this.lineTension);
            }
         } else {
            console.log('WRONG INPUT!')
            this.lineTension += 15;
            this.updateTension(this.lineTension);
        }

        this.lastKeyPressed = null;
        this.events.emit('tensionChange', this.lineTension);
        this.events.emit('staminaUpdate', this.fishStamina);
        this.events.emit('distanceUpdate', this.fishDistance);

    }

    updatePrompt(){
        this.currentPrompt = Phaser.Utils.Array.GetRandom(this.fishPrompts);
        this.events.emit('promptChanged', this.currentPrompt);
        this.activeFishingTimer.delay = Phaser.Math.Between(this.fishTimerMin, this.fishTimerMax);
        console.log(this.currentPrompt)

        if (this.currentPrompt === "BIG-REEL"){
            this.correctInput = "w";
        } else if (this.currentPrompt === "REEL") {
            this.correctInput = " ";
        } else if (this.currentPrompt === "STABALIZE-LEFT") {
            this.correctInput = "a";
        } else if (this.currentPrompt === "STABALIZE-RIGHT") {
            this.correctInput = "d";
        } else if (this.currentPrompt === "SLACK") {
            this.correctInput = "s"
        }
        // do something like, promptRepeatCounterPreventer. So like count how many times each prompt was given and if it was given three times in a row, maybe switch to a different array set that's weighted against it or like just...make it so that it can't happen a fourth time. youre smart ull figureitout...with lov, -pastbryan. ps.sotired.
    }

    update()
    {
        if (this.lineTension < 0) {
            this.lineTension = 0;
            this.events.emit('tensionChange', this.lineTension);
        }

        if (this.lineTension >= 100 || this.fishDistance >= 80) {
            this.scene.stop('UIScene');
            this.scene.start('GameOver');
            //console.log("LINE SNAPPED!")
            //this.events.emit('lineSnapped')
        }

        if (this.fishStamina <= 0) {
            this.scene.stop('UIScene');
            this.scene.start('GameWin');
        }
    }
}

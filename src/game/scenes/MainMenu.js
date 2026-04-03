import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);

        const tutorial = this.add.image(this.scale.width / 2, this.scale.height / 2, 'tutorial').setOrigin(0.5).setScale(0.3);

        const tutorialText = this.add.bitmapText(
            this.scale.width / 2, 
            this.scale.height / 2 -45,
            'globalFont', 'Pay attention\nto the prompts!\nMash buttons\naccordingly!',
            12
            ).setOrigin(0.5).setCenterAlign();

        tutorialText.setTintFill(0xff0000);

        const oval = this.add.ellipse(160, 90, 200, 35).setStrokeStyle(2, 0xff0000, 1).setSmoothness(64);

        let clicks = 0;

        const skipButton = this.add.text(180, 155, 'SKIP TUTORIAL');
        skipButton.setInteractive()
        .on('pointerdown', () => {
            clicks = -10000;
            skipButton.destroy();
            this.cameras.main.fadeOut(750, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('Game');
            })
        });

        if (!this.sound.get('bg')) {
            this.bgMusic = this.sound.add('bg', {
                volume: 0.5,
                loop: true
            });
            this.bgMusic.play()
        }


        this.input.on('pointerdown', () => {
            clicks += 1;

            if (clicks === 1) {
                tutorialText.y = 120;
                tutorialText.setText(`Don't let the fish\nget too far\naway!`);
                oval.x = 150;
                oval.y = 160;
                oval.setSize(24, 24);
            }

            //320 x 180

            if (clicks === 2) {
                tutorialText.x = 240;
                tutorialText.y = 48;
                tutorialText.setText('To catch fish,\nstamina MUST\nreach ZERO!\nor reach you');
                oval.x = 244;
                oval.y = 12;
                oval.setSize(124, 24);
            }

            if (clicks === 3) {
                tutorial.destroy();
                tutorialText.x = this.scale.width/2;
                tutorialText.y = this.scale.height/2 - 24;
                tutorialText.setText('Your line has\nTENSION\nas indicated by the\nsky flashing\nToo much TENSION\n and your string\nwill SNAP!');
                oval.destroy();
            }

            if (clicks === 4) {
                tutorialText.y = this.scale.height/2;
                tutorialText.setText(`Pulling (A/D): STUNS fish\nto keeping it from moving\nand its STAMINA\nfrom RECOVERING.\n\nReeling (Space/W): Drains\nfish's STAMINA. Big Reel\ndrains faster\nbut spikes TENSION!`);
            }

            if (clicks === 5) {
                tutorialText.setText(`Slack (S): Quickly drops\nTENSION but allows fish to\nREGEN and gain DISTANCE`);
            }

            if (clicks === 6) {
                tutorialText.x = this.scale.width/2;
                tutorialText.setText(`That's it!\nClick again to START!`);
            }

            if (clicks === 7){
                this.cameras.main.fadeOut(750, 0, 0, 0);

                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('Game');
                })
            }

        });
    }
}

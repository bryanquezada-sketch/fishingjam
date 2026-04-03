import { Scene } from 'phaser';

export class UIScene extends Scene {
    constructor ()
    {
        super ({ key: 'UIScene' });
    }

    create () {
        this.gameScene = this.scene.get('Game');

        this.gameScene.events.on('playerLost', () => {
            this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'YOU LOSE!', {
                fontSize: '128px',
                wordWrap: { width: this.scale.width },
                align: 'center'
            }).setOrigin(0.5);
        });

        this.gameScene.events.on('playerWon', () => {
            this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'YOU WIN!\nDISNEY WORLD THAT WAY ->', {
                fontSize: '64px',
                wordWrap: { width: this.scale.width },
                align: 'center'
            }).setOrigin(0.5);
        });

        // -- NEW SHIT --

        this.fishyPrompt = this.add.text(this.scale.width/2, this.scale.height/2, `GET READY`, {
            fontSize: '14px',
            align: 'center'
        }).setOrigin(0.5);

        this.gameScene.events.on('promptChanged', (newPrompt) => {
            this.fishyPrompt.setText(`${newPrompt}`);
            this.tweens.add({
                targets: this.fishyPrompt,
                scale: 1.2,
                duration: 250,
                ease: 'Power2',
                yoyo: true,
            });
        });

        /*
        this.tensionText = this.add.text(this.scale.width/2, this.scale.height / 2 + 32, `Line Tension: 0`, {
            fontSize: '16px',
            align: 'center'
        }).setOrigin(0.5);

        this.gameScene.events.on('tensionChange', (tension) => {
            this.tensionText.setText(`Line Tension: ${tension}`);
        });
        */

        this.staminaText = this.add.text(this.scale.width - 4, 14, `Fish Stamina: 100`, {
            fontSize: '12px',
        }).setOrigin(1);

        this.gameScene.events.on('staminaUpdate', (newStamina) => {
            this.staminaText.setText(`Fish Stamina: ${newStamina} `);
        });

        /*
        this.distanceText = this.add.text(this.scale.width/2, this.scale.height / 2 - 64, `Fish Distance: 20 meters`, {
            fontSize: '16px',
            align: 'center'
        }).setOrigin(0.5);

        this.gameScene.events.on('distanceUpdate', (newDistance) => {
            this.distanceText.setText(`Fish Distance: ${newDistance} meters`);
        });
        */

        this.fishCount = this.add.text(4, 0, `Fish Caught: 0`, {
            fontSize: '12px',
        }).setOrigin(0);

        this.gameScene.events.on('fishCaught', (addFish) => {
            this.fishCount.setText(` Fish Caught: ${addFish}`);
        });

        this.gameScene.events.on('tensionSnap', () => {
            this.fishyPrompt.setText(`LINE SNAPPED!!!`);
        });

        this.gameScene.events.on('gotAway', () => {
            this.fishyPrompt.setText(`GOT AWAY!!!`);
        });

        this.gameScene.events.on('fishHooked', () => {
            this.fishyPrompt.setText(`FISH CAUGHT!!!`);
        });

        const wrongButton = this.add.text(this.scale.width / 2, this.scale.height / 2 - 30, `WRONG BUTTON!!!`, {
            fontSize: '18px',
            color: '#00ff00'
        }).setOrigin(0.5).setVisible(false);

        this.tweens.add({
            targets: wrongButton,
            alpha: 0,
            duration: 150,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        this.gameScene.events.on('wrongButton', () => {
            wrongButton.setVisible(true);
        });

        this.gameScene.events.on('correctButton', () => {
            wrongButton.setVisible(false);
        });

        const tensionWarning = this.add.text(this.scale.width / 2, this.scale.height / 2 - 58, `WATCH YOUR TENSION!`, {
            fontSize: '20px',
            color: '#00ff00'
        }).setOrigin(0.5).setVisible(false);

        this.tweens.add({
            targets: tensionWarning,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        this.gameScene.events.on('badTension', () => {
            tensionWarning.setVisible(true);
        });

        this.gameScene.events.on('goodTension', () => {
            tensionWarning.setVisible(false);
        });


        // -- END OF CREATE() --
    }
}
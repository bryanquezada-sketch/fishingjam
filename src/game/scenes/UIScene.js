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

        this.fishyPrompt = this.add.text(this.scale.width/2, this.scale.height/2, `FISHY PROMPT: GET READY`, {
            fontSize: '16px',
            align: 'center'
        }).setOrigin(0.5);

        this.gameScene.events.on('promptChanged', (newPrompt) => {
            this.fishyPrompt.setText(`FISHY PROMPT: ${newPrompt}`);
        });

        this.tensionText = this.add.text(this.scale.width/2, this.scale.height / 2 + 32, `Line Tension: 0`, {
            fontSize: '16px',
            align: 'center'
        }).setOrigin(0.5);

        this.gameScene.events.on('tensionChange', (tension) => {
            this.tensionText.setText(`Line Tension: ${tension}`);
        });

        this.staminaText = this.add.text(this.scale.width/2, this.scale.height / 2 - 32, `Fish Stamina: 100`, {
            fontSize: '16px',
            align: 'center'
        }).setOrigin(0.5);

        this.gameScene.events.on('staminaUpdate', (newStamina) => {
            this.staminaText.setText(`Fish Stamina: ${newStamina}`);
        });

        this.distanceText = this.add.text(this.scale.width/2, this.scale.height / 2 - 64, `Fish Distance: 20`, {
            fontSize: '16px',
            align: 'center'
        }).setOrigin(0.5);

        this.gameScene.events.on('distanceUpdate', (newDistance) => {
            this.distanceText.setText(`Fish Distance: ${newDistance} meters`);
        });
        

        // -- END OF CREATE() --
    }
}
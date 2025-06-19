import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create (): void
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(200, 400, 'background').setAlpha(0.5);

        this.add.text(200, 300, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        const fightButton = this.add.text(200, 500, 'FIGHT', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            backgroundColor: '#ff0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        fightButton.on('pointerdown', () => {
            this.scene.start('FightScene');
        });
    }
}

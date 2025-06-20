import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create (): void {
        this.add.image(200, 400, 'game_background').setAlpha(0.5);

        const fightButton = this.add.text(200, 500, 'FIGHT', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            backgroundColor: '#ff0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        fightButton.on('pointerup', () => {
            this.scene.start('FightScene');
        });
    }
}

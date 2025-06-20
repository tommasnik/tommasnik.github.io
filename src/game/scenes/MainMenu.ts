import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create (): void
    {
        this.add.image(200, 400, 'background').setScale(0.55);



        const startGameButton = this.add.text(200, 500, 'Start game', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            backgroundColor: '#ff0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startGameButton.on('pointerup', () => {
            this.scene.start('Game');
        });
    }
}

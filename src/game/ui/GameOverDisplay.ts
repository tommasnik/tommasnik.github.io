import { Scene } from 'phaser';

export class GameOverDisplay {
    private scene: Scene;
    private displayText: Phaser.GameObjects.Text | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    showWinMessage(): void {
        this.displayText = this.scene.add.text(200, 400, 'YOU WIN!', {
            fontSize: '48px',
            color: '#00ff00'
        }).setOrigin(0.5);
    }

    showLoseMessage(): void {
        this.displayText = this.scene.add.text(200, 400, 'YOU LOSE!', {
            fontSize: '48px',
            color: '#ff0000'
        }).setOrigin(0.5);
    }

    hide(): void {
        if (this.displayText) {
            this.displayText.destroy();
            this.displayText = null;
        }
    }

    destroy(): void {
        this.hide();
    }
} 
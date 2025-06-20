import { Scene } from 'phaser';

export class BackButton {
    private button: Phaser.GameObjects.Text;
    private scene: Scene;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.button = scene.add.text(x, y, 'BACK', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#666666',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
        
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.button.on('pointerdown', () => {
            this.scene.events.emit('backButtonClicked');
        });
    }

    destroy(): void {
        this.button.destroy();
    }
} 
import { Scene } from 'phaser';

export class ShieldEffect {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(x: number, y: number): void {
        const shield = this.scene.add.circle(x, y, 40, 0x0000ff, 0.3);
        
        this.scene.tweens.add({
            targets: shield,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 1000,
            onComplete: () => shield.destroy()
        });
    }
} 
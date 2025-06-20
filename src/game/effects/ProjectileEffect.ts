import { Scene } from 'phaser';

export abstract class ProjectileEffect {
    protected scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    abstract create(startX: number, startY: number, targetX: number, targetY: number): void;

    protected createExplosion(x: number, y: number, color: number, size: number = 20): void {
        const explosion = this.scene.add.circle(x, y, size, color, 0.8);
        
        this.scene.tweens.add({
            targets: explosion,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => explosion.destroy()
        });
    }
} 
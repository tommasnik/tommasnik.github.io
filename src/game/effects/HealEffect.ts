import { Scene } from 'phaser';

export class HealEffect {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(x: number, y: number): void {
        const healParticles = this.scene.add.graphics();
        healParticles.fillStyle(0x00ff00, 0.8);
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const particleX = x + Math.cos(angle) * 20;
            const particleY = y + Math.sin(angle) * 20;
            
            this.scene.tweens.add({
                targets: { x: particleX, y: particleY },
                x: particleX + Math.cos(angle) * 30,
                y: particleY + Math.sin(angle) * 30,
                alpha: 0,
                duration: 800,
                onUpdate: () => {
                    healParticles.fillCircle(particleX, particleY, 3);
                },
                onComplete: () => {
                    if (i === 7) healParticles.destroy();
                }
            });
        }
    }
} 
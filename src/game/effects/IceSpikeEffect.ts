import { ProjectileEffect } from './ProjectileEffect';

export class IceSpikeEffect extends ProjectileEffect {
    create(startX: number, startY: number, targetX: number, targetY: number): void {
        const iceSpike = this.scene.add.triangle(startX, startY, 0, -8, -4, 8, 4, 8, 0x00ffff);
        
        this.scene.tweens.add({
            targets: iceSpike,
            x: targetX,
            y: targetY,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
                this.createExplosion(targetX, targetY, 0x00ffff);
                iceSpike.destroy();
            }
        });
    }
} 
import { ProjectileEffect } from './ProjectileEffect';

export class MeteorEffect extends ProjectileEffect {
    create(startX: number, startY: number, targetX: number, targetY: number): void {
        const meteor = this.scene.add.circle(targetX, targetY - 100, 15, 0xff0000);
        
        this.scene.tweens.add({
            targets: meteor,
            y: targetY,
            duration: 1000,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.createExplosion(targetX, targetY, 0xff0000, 30);
                meteor.destroy();
            }
        });
    }
} 
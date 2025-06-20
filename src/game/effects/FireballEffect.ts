import { ProjectileEffect } from './ProjectileEffect';

export class FireballEffect extends ProjectileEffect {
    create(startX: number, startY: number, targetX: number, targetY: number): void {
        const fireball = this.scene.add.circle(startX, startY, 8, 0xff4400);
        
        this.scene.tweens.add({
            targets: fireball,
            x: targetX,
            y: targetY,
            duration: 400,
            onComplete: () => {
                this.createExplosion(targetX, targetY, 0xff4400);
                fireball.destroy();
            }
        });
    }
} 
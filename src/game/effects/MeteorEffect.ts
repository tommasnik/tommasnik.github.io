import { ProjectileEffect } from './ProjectileEffect';

export class MeteorEffect extends ProjectileEffect {
    create(startX: number, startY: number, targetX: number, targetY: number): void {
        this.createMeteorFall(targetX, targetY);
    }

    private createMeteorFall(targetX: number, targetY: number): void {
        const meteorStartY = targetY - 300;
        const meteor = this.scene.add.graphics();
        
        meteor.fillStyle(0x8B4513, 1);
        meteor.fillCircle(0, 0, 12);
        meteor.fillStyle(0xFF4500, 0.8);
        meteor.fillCircle(0, 0, 8);
        meteor.fillStyle(0xFF6347, 0.6);
        meteor.fillCircle(0, 0, 4);
        
        meteor.setPosition(targetX, meteorStartY);
        
        const trail = this.scene.add.graphics();

        const impactY = targetY + 15;
        
        this.scene.tweens.add({
            targets: meteor,
            y: impactY,
            duration: 800,
            ease: 'Cubic.In',
            onUpdate: () => {
                trail.clear();
                trail.fillStyle(0xFF4500, 0.3);
                trail.fillCircle(meteor.x, meteor.y - 20, 6);
                trail.fillStyle(0xFF6347, 0.2);
                trail.fillCircle(meteor.x, meteor.y - 40, 4);
            },
            onComplete: () => {
                trail.destroy();
                meteor.destroy();
                this.createMeteorImpact(targetX, impactY);
            }
        });
    }

    private createMeteorImpact(x: number, y: number): void {
        const impact = this.scene.add.graphics();
        impact.fillStyle(0xFF4500, 1);
        impact.fillCircle(0, 0, 20);
        impact.setPosition(x, y);
        
        this.scene.tweens.add({
            targets: impact,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                impact.destroy();
                this.createFireExplosion(x, y);
            }
        });
    }

    private createFireExplosion(x: number, y: number): void {
        const explosion = this.scene.add.graphics();
        explosion.fillStyle(0xFF4500, 0.8);
        explosion.fillCircle(0, 0, 30);
        explosion.setPosition(x, y);
        
        this.scene.tweens.add({
            targets: explosion,
            scaleX: 2.5,
            scaleY: 2.5,
            alpha: 0,
            duration: 600,
            onComplete: () => explosion.destroy()
        });

        this.createExplosiveParticles(x, y);
        this.createSmokeParticles(x, y);
    }

    private createExplosiveParticles(x: number, y: number): void {
        for (let i = 0; i < 20; i++) {
            const particle = this.scene.add.graphics();
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 30 + Math.random() * 40;
            const startX = x + Math.cos(angle) * distance;
            const startY = y + Math.sin(angle) * distance;
            
            particle.fillStyle(0xFF4500, 1);
            particle.fillCircle(0, 0, 3 + Math.random() * 3);
            particle.setPosition(startX, startY);
            
            const spreadAngle = angle + (Math.random() - 0.5) * Math.PI / 2;
            const velocity = 40 + Math.random() * 60;
            const targetX = x + Math.cos(spreadAngle) * velocity;
            const targetY = y + Math.sin(spreadAngle) * velocity;
            
            this.scene.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 600 + Math.random() * 400,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    private createSmokeParticles(x: number, y: number): void {
        for (let i = 0; i < 12; i++) {
            const particle = this.scene.add.graphics();
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 25;
            const startX = x + Math.cos(angle) * distance;
            const startY = y + Math.sin(angle) * distance;
            
            particle.fillStyle(0x696969, 0.6);
            particle.fillCircle(0, 0, 4 + Math.random() * 4);
            particle.setPosition(startX, startY);
            
            const spreadAngle = angle + (Math.random() - 0.5) * Math.PI / 3;
            const velocity = 30 + Math.random() * 50;
            const targetX = x + Math.cos(spreadAngle) * velocity;
            const targetY = y + Math.sin(spreadAngle) * velocity;
            
            this.scene.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 1000 + Math.random() * 600,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
} 
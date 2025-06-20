import { Scene } from 'phaser';

export class HealEffect {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(x: number, y: number): void {
        this.createHealGlow(x, y);
    }

    private createHealGlow(x: number, y: number): void {
        const glow = this.scene.add.graphics();
        glow.fillStyle(0x00ff66, 0.6);
        glow.fillCircle(0, 0, 35);
        glow.setPosition(x, y);
        
        const innerGlow = this.scene.add.graphics();
        innerGlow.fillStyle(0x00ff66, 0.4);
        innerGlow.fillCircle(0, 0, 25);
        innerGlow.setPosition(x, y);
        
        const pulseGlow = this.scene.add.graphics();
        pulseGlow.fillStyle(0x00ff66, 0.3);
        pulseGlow.fillCircle(0, 0, 45);
        pulseGlow.setPosition(x, y);
        
        this.scene.tweens.add({
            targets: [glow, innerGlow, pulseGlow],
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                glow.destroy();
                innerGlow.destroy();
                pulseGlow.destroy();
            }
        });
        
        this.createHealParticles(x, y);
    }

    private createHealParticles(x: number, y: number): void {
        for (let i = 0; i < 6; i++) {
            const particle = this.scene.add.graphics();
            const angle = (Math.PI * 2 * i) / 6;
            const startX = x + Math.cos(angle) * 15;
            const startY = y + Math.sin(angle) * 15;
            
            particle.fillStyle(0x00ff66, 0.8);
            particle.fillCircle(0, 0, 2 + Math.random() * 2);
            particle.setPosition(startX, startY);
            
            const targetX = startX + Math.cos(angle) * 25;
            const targetY = startY + Math.sin(angle) * 25;
            
            this.scene.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 600 + Math.random() * 200,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
} 
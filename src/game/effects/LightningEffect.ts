import { ProjectileEffect } from './ProjectileEffect';

export class LightningEffect extends ProjectileEffect {
    create(startX: number, startY: number, targetX: number, targetY: number): void {
        const lightning = this.scene.add.graphics();
        lightning.lineStyle(3, 0x00ffff);
        
        const points = this.generateLightningPoints(startX, startY, targetX, targetY);
        lightning.strokePoints(points);
        
        this.scene.tweens.add({
            targets: lightning,
            alpha: 0,
            duration: 300,
            onComplete: () => lightning.destroy()
        });
    }

    private generateLightningPoints(startX: number, startY: number, endX: number, endY: number): Phaser.Geom.Point[] {
        const points: Phaser.Geom.Point[] = [];
        const segments = 8;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            
            if (i > 0 && i < segments) {
                const offset = (Math.random() - 0.5) * 20;
                points.push(new Phaser.Geom.Point(x + offset, y + offset));
            } else {
                points.push(new Phaser.Geom.Point(x, y));
            }
        }
        
        return points;
    }
} 
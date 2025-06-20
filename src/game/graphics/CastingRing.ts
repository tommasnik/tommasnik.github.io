import Phaser from 'phaser';
import { GameConstants } from '../constants/GameConstants';

export class CastingRing {
    private scene: Phaser.Scene;
    private graphics: Phaser.GameObjects.Graphics;
    public isVisible: boolean = false;
    private currentProgress: number = 0;
    private animationType: string = '';
    private radius: number = GameConstants.UI.CASTING_RING.radius;
    private thickness: number = GameConstants.UI.CASTING_RING.thickness;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics()
            .setDepth(100)
            .setVisible(false);
    }

    startCasting(animationType: string, x: number, y: number): void {
        this.animationType = animationType;
        this.currentProgress = 0;
        this.isVisible = true;
        console.log('startCasting', this.isVisible);
        this.graphics.setVisible(true);
        this.updatePosition(x, y);
        this.updateRing();
        console.log('CastingRing: Started casting', animationType, 'at', x, y);
    }

    updateProgress(progress: number, x: number, y: number): void {
        if (!this.isVisible) return;
        console.log('updateProgress', progress);
        
        this.currentProgress = Math.min(progress, 1);
        this.updatePosition(x, y);
        this.updateRing();
        console.log('CastingRing: Updated progress', progress, 'at', x, y);
    }

    stopCasting(): void {
        console.log('stopCasting', this.isVisible);
        this.isVisible = false;
        this.graphics.setVisible(false);
        this.currentProgress = 0;
    }

    private updatePosition(x: number, y: number): void {
        this.graphics.setPosition(x, y);
    }

    private updateRing(): void {
        this.graphics.clear();
        
        if (!this.isVisible) {
            console.log('CastingRing: Not visible, skipping draw');
            return;
        }

        const color = this.getRingColor();
        const alpha = this.getRingAlpha();
        
        console.log('CastingRing: Drawing ring with color', color.toString(16), 'alpha', alpha, 'progress', this.currentProgress);
        
        this.graphics.lineStyle(this.thickness, color, alpha);
        this.graphics.beginPath();
        this.graphics.arc(
            0, 
            0, 
            this.radius, 
            -Math.PI / 2, 
            -Math.PI / 2 + (2 * Math.PI * this.currentProgress), 
            false
        );
        this.graphics.strokePath();

        this.addGlowEffect(color, alpha);
    }

    private getRingColor(): number {
        const colorMap: { [key: string]: number } = {
            'fireball': 0xff6600,
            'lightning': 0x00ffff,
            'ice_spike': 0x00ccff,
            'meteor': 0xff3300,
            'shield': 0x0066ff,
            'heal': 0x00ff66
        };
        return colorMap[this.animationType] || 0xffffff;
    }

    private getRingAlpha(): number {
        return GameConstants.UI.CASTING_RING.baseAlpha + (this.currentProgress * GameConstants.UI.CASTING_RING.progressAlphaMultiplier);
    }

    private addGlowEffect(color: number, alpha: number): void {
        const glowRadius = this.radius + GameConstants.UI.CASTING_RING.glowOffset;
        const glowAlpha = alpha * GameConstants.UI.CASTING_RING.glowAlphaMultiplier;
        
        this.graphics.lineStyle(this.thickness + 2, color, glowAlpha);
        this.graphics.beginPath();
        this.graphics.arc(
            0, 
            0, 
            glowRadius, 
            -Math.PI / 2, 
            -Math.PI / 2 + (2 * Math.PI * this.currentProgress), 
            false
        );
        this.graphics.strokePath();
    }

    destroy(): void {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null as any;
        }
    }
} 
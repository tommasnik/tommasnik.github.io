import Phaser from 'phaser';
import { GameConstants } from '../constants/GameConstants';
import { CastingSpell } from '../systems/CastingManager';

export class MultiCastingRing {
    private scene: Phaser.Scene;
    private graphics: Phaser.GameObjects.Graphics;
    private activeRings: Map<string, CastingRingData> = new Map();
    private baseRadius: number = GameConstants.UI.CASTING_RING.radius;
    private thickness: number = GameConstants.UI.CASTING_RING.thickness;
    private ringSpacing: number = 25;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics()
            .setDepth(100)
            .setVisible(true);
    }

    startCasting(skillName: string, animationType: string, x: number, y: number): void {
        const ringData: CastingRingData = {
            skillName,
            animationType,
            x,
            y,
            progress: 0,
            radius: this.calculateRingRadius(skillName),
            isVisible: true
        };
        
        this.activeRings.set(skillName, ringData);
        this.updateAllRings();
    }

    updateProgress(skillName: string, progress: number, x: number, y: number): void {
        const ringData = this.activeRings.get(skillName);
        if (ringData) {
            ringData.progress = Math.min(progress, 1);
            ringData.x = x;
            ringData.y = y;
            this.updateAllRings();
        } else {
            this.stopCasting(skillName);
        }
    }

    stopCasting(skillName: string): void {
        if (this.activeRings.has(skillName)) {
            this.activeRings.delete(skillName);
            this.recalculateRingRadii();
            this.updateAllRings();
        }
    }

    stopAllCasting(): void {
        this.activeRings.clear();
        this.updateAllRings();
    }

    forceCleanup(): void {
        this.activeRings.clear();
        this.graphics.clear();
    }

    getActiveRingNames(): string[] {
        return Array.from(this.activeRings.keys());
    }

    getActiveRingCount(): number {
        return this.activeRings.size;
    }

    debugState(): void {
        console.log('MultiCastingRing state:', {
            activeRings: Array.from(this.activeRings.keys()),
            ringCount: this.activeRings.size
        });
    }

    private calculateRingRadius(skillName: string): number {
        const currentRingCount = this.activeRings.size;
        return this.baseRadius + (currentRingCount * this.ringSpacing);
    }

    private recalculateRingRadii(): void {
        const ringNames = Array.from(this.activeRings.keys());
        ringNames.forEach((skillName, index) => {
            const ringData = this.activeRings.get(skillName);
            if (ringData) {
                ringData.radius = this.baseRadius + (index * this.ringSpacing);
            }
        });
    }

    private updateAllRings(): void {
        this.graphics.clear();
        
        if (this.activeRings.size === 0) {
            return;
        }

        for (const [skillName, ringData] of this.activeRings) {
            this.drawRing(ringData);
        }
    }

    private drawRing(ringData: CastingRingData): void {
        if (!ringData.isVisible) return;

        const color = this.getRingColor(ringData.animationType);
        const alpha = this.getRingAlpha(ringData.progress);
        const ringIndex = this.getRingIndex(ringData.skillName);
        const adjustedAlpha = alpha * (1 - (ringIndex * 0.1));
        const lineThickness = this.thickness + (ringIndex * 1);
        
        this.addGlowEffect(ringData, color, adjustedAlpha, lineThickness);
        
        this.graphics.lineStyle(lineThickness, color, adjustedAlpha);
        this.graphics.beginPath();
        this.graphics.arc(
            ringData.x, 
            ringData.y, 
            ringData.radius, 
            -Math.PI / 2, 
            -Math.PI / 2 + (2 * Math.PI * ringData.progress), 
            false
        );
        this.graphics.strokePath();
    }

    private getRingColor(animationType: string): number {
        const colorMap: { [key: string]: number } = {
            'fireball': 0xff6600,
            'lightning': 0x00ffff,
            'ice_spike': 0x00ccff,
            'meteor': 0xff3300,
            'shield': 0x0066ff,
            'heal': 0x00ff66
        };
        return colorMap[animationType] || 0xffffff;
    }

    private getRingAlpha(progress: number): number {
        return GameConstants.UI.CASTING_RING.baseAlpha + (progress * GameConstants.UI.CASTING_RING.progressAlphaMultiplier);
    }

    private getRingIndex(skillName: string): number {
        const ringNames = Array.from(this.activeRings.keys());
        return ringNames.indexOf(skillName);
    }

    private addGlowEffect(ringData: CastingRingData, color: number, alpha: number, lineThickness: number): void {
        const glowRadius = ringData.radius;
        const glowAlpha = alpha * GameConstants.UI.CASTING_RING.glowAlphaMultiplier;
        
        this.graphics.lineStyle(lineThickness +  GameConstants.UI.CASTING_RING.glowOffset, color, glowAlpha);
        this.graphics.beginPath();
        this.graphics.arc(
            ringData.x, 
            ringData.y, 
            glowRadius, 
            -Math.PI / 2, 
            -Math.PI / 2 + (2 * Math.PI * ringData.progress), 
            false
        );
        this.graphics.strokePath();
    }

    destroy(): void {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null as any;
        }
        this.activeRings.clear();
    }
}

interface CastingRingData {
    skillName: string;
    animationType: string;
    x: number;
    y: number;
    progress: number;
    radius: number;
    isVisible: boolean;
} 
import { Scene } from 'phaser';

export class HealthBar {
    private background: Phaser.GameObjects.Rectangle;
    private fill: Phaser.GameObjects.Rectangle;
    private scene: Scene;
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(scene: Scene, x: number, y: number, width: number = 200, height: number = 20) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.background = scene.add.rectangle(x, y, width, height, 0x333333);
        this.fill = scene.add.rectangle(x, y, width, height, 0x00ff00);
    }

    updateHealth(percentage: number): void {
        this.fill.width = this.width * Math.max(0, Math.min(1, percentage));
    }

    setFillColor(color: number): void {
        this.fill.fillColor = color;
    }

    destroy(): void {
        this.background.destroy();
        this.fill.destroy();
    }
} 
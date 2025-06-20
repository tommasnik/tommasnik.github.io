import { Scene } from 'phaser';

export class Fighter {
    private sprite: Phaser.GameObjects.Sprite;
    private scene: Scene;
    private name: string;
    private idleAnimationKey: string;

    constructor(scene: Scene, x: number, y: number, textureKey: string, frame: number, name: string, idleAnimationKey: string) {
        this.scene = scene;
        this.name = name;
        this.idleAnimationKey = idleAnimationKey;
        
        this.sprite = scene.add.sprite(x, y, textureKey, frame);
        this.createNameLabel();
    }

    private createNameLabel(): void {
        const labelY = this.sprite.y + 50;
        this.scene.add.text(this.sprite.x, labelY, this.name, { 
            fontSize: '16px', 
            color: '#ffffff' 
        }).setOrigin(0.5);
    }

    playAnimation(animationKey: string): void {
        this.sprite.play(animationKey);
    }

    playIdleAnimation(): void {
        this.sprite.play(this.idleAnimationKey);
    }

    onAnimationComplete(callback: () => void): void {
        this.sprite.once('animationcomplete', callback);
    }

    getPosition(): { x: number; y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    destroy(): void {
        this.sprite.destroy();
    }
} 
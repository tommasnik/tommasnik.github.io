import { Scene } from 'phaser';

export class AnimationManager {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createFighterAnimations(): void {
        this.createWizardAnimations();
        this.createOrcAnimations();
    }

    private createAnimationSafely(key: string, config: any): void {
        if (!this.scene.anims.exists(key)) {
            this.scene.anims.create({
                key,
                ...config
            });
        }
    }

    private createWizardAnimations(): void {
        this.createAnimationSafely('wizard_combat_idle', {
            frames: this.scene.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.createAnimationSafely('wizard_fireball', {
            frames: this.scene.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0
        });

        this.createAnimationSafely('wizard_lightning', {
            frames: this.scene.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        this.createAnimationSafely('wizard_ice_spike', {
            frames: this.scene.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: 0
        });

        this.createAnimationSafely('wizard_meteor', {
            frames: this.scene.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: 0
        });

        this.createAnimationSafely('wizard_shield', {
            frames: this.scene.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0
        });

        this.createAnimationSafely('wizard_heal', {
            frames: this.scene.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0
        });
    }

    private createOrcAnimations(): void {
        this.createAnimationSafely('orc_combat_idle', {
            frames: this.scene.anims.generateFrameNumbers('orc_combat_idle', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
    }
} 
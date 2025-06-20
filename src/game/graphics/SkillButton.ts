import Phaser from 'phaser';
import { Skill } from '../logic/Skill';

export class SkillButton {
    scene: Phaser.Scene;
    skill: Skill;
    radius: number;
    baseButton: Phaser.GameObjects.Arc;
    cooldownButton: Phaser.GameObjects.Arc;
    mask: Phaser.GameObjects.Graphics;
    text: Phaser.GameObjects.Text;
    icon: Phaser.GameObjects.Image;
    flash: Phaser.GameObjects.Arc;
    progressRing: Phaser.GameObjects.Graphics;
    previousCooldown: number = 0;
    private clickHandler: (skill: Skill) => void;
    private isPressed: boolean = false;
    private pressStartTime: number = 0;
    private minHoldTime: number = 100;

    constructor(scene: Phaser.Scene, x: number, y: number, skill: Skill, clickHandler: (skill: Skill) => void) {
        this.scene = scene;
        this.skill = skill;
        this.radius = 30;
        this.clickHandler = clickHandler;

        this.baseButton = scene.add.circle(x, y, this.radius, 0x444444)
            .setInteractive()
            .setDepth(1);

        this.cooldownButton = scene.add.circle(x, y, this.radius, 0x666666)
            .setDepth(1);

        this.mask = scene.add.graphics().setVisible(false);
        this.mask.x = x;
        this.mask.y = y;
        this.cooldownButton.mask = new Phaser.Display.Masks.BitmapMask(scene, this.mask);

        this.progressRing = scene.add.graphics()
            .setDepth(2)
            .setVisible(false);

        const iconKey = this.getIconKey(skill.animationType);
        this.icon = scene.add.image(x, y - 8, iconKey)
            .setScale(0.6)
            .setDepth(3);

        this.text = scene.add.text(x, y + 12, skill.name, {
            fontSize: '10px',
            color: '#ffffff',
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(3);

        this.flash = scene.add.circle(x, y, this.radius, 0xffffff)
            .setAlpha(0)
            .setDepth(4);

        this.setupEventHandlers();
    }

    getIconKey(animationType: string): string {
        const iconMap: { [key: string]: string } = {
            'fireball': 'fireball',
            'lightning': 'lightning',
            'ice_spike': 'ice_spike',
            'meteor': 'meteor',
            'shield': 'shield',
            'heal': 'heal'
        };
        return iconMap[animationType] || 'fireball';
    }

    setupEventHandlers(): void {
        this.baseButton.on('pointerdown', () => {
            this.handlePointerDown();
        });

        this.baseButton.on('pointerup', () => {
            this.handlePointerUp();
        });

        this.baseButton.on('pointerout', () => {
            this.handlePointerOut();
        });
    }

    private handlePointerDown(): void {
        if (this.skill.canUse()) {
            this.isPressed = true;
            this.pressStartTime = Date.now();
            this.baseButton.setFillStyle(0x666666);
            this.progressRing.setVisible(true);
            this.scene.tweens.add({
                targets: [this.baseButton, this.icon, this.text],
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                ease: 'Power2'
            });
        }
    }

    private handlePointerUp(): void {
        if (this.isPressed && this.skill.canUse()) {
            const holdTime = Date.now() - this.pressStartTime;
            if (holdTime >= this.minHoldTime) {
                this.clickHandler(this.skill);
            }
        }
        this.isPressed = false;
        this.baseButton.setFillStyle(0x444444);
        this.progressRing.setVisible(false);
        this.scene.tweens.add({
            targets: [this.baseButton, this.icon, this.text],
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: 'Power2'
        });
    }

    private handlePointerOut(): void {
        this.isPressed = false;
        this.baseButton.setFillStyle(0x444444);
        this.progressRing.setVisible(false);
        this.scene.tweens.add({
            targets: [this.baseButton, this.icon, this.text],
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: 'Power2'
        });
    }

    update(): void {
        if (!this.text || !this.text.active || !this.icon || !this.icon.active) {
            return;
        }

        const cooldownPercent = this.skill.getCooldownPercentage();

        this.mask.clear();
        if (cooldownPercent > 0) {
            this.mask.fillStyle(0, 1);
            this.mask.beginPath();
            this.mask.slice(0, 0, this.radius, -Math.PI / 2, -Math.PI / 2 - (2 * Math.PI * cooldownPercent), false);
            this.mask.fillPath();

            this.text.setColor('#888888');
            this.icon.setAlpha(0.5);
        } else {
            this.text.setColor('#ffffff');
            this.icon.setAlpha(1);
        }

        if (this.isPressed && this.skill.canUse()) {
            const holdTime = Date.now() - this.pressStartTime;
            const progress = Math.min(holdTime / this.minHoldTime, 1);
            
            this.progressRing.clear();
            this.progressRing.lineStyle(3, 0x00ff00, 1);
            this.progressRing.beginPath();
            this.progressRing.arc(this.baseButton.x, this.baseButton.y, this.radius + 2, -Math.PI / 2, -Math.PI / 2 + (2 * Math.PI * progress), false);
            this.progressRing.strokePath();
        }

        if (cooldownPercent === 0 && this.previousCooldown > 0) {
            this.scene.tweens.add({
                targets: this.flash,
                alpha: { from: 0.8, to: 0 },
                duration: 300,
                ease: 'Power2'
            });
        }

        this.previousCooldown = cooldownPercent;
    }

    destroy(): void {
        if (this.baseButton) {
            this.baseButton.destroy();
            this.baseButton = null as any;
        }
        if (this.cooldownButton) {
            this.cooldownButton.destroy();
            this.cooldownButton = null as any;
        }
        if (this.mask) {
            this.mask.destroy();
            this.mask = null as any;
        }
        if (this.text) {
            this.text.destroy();
            this.text = null as any;
        }
        if (this.icon) {
            this.icon.destroy();
            this.icon = null as any;
        }
        if (this.flash) {
            this.flash.destroy();
            this.flash = null as any;
        }
        if (this.progressRing) {
            this.progressRing.destroy();
            this.progressRing = null as any;
        }
    }
} 
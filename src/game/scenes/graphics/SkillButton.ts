import Phaser from 'phaser';
import { Skill } from '../../logic/Skill';

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
    previousCooldown: number = 0;
    private clickHandler: (skill: Skill) => void;

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
            if (this.skill.canUse()) {
                this.clickHandler(this.skill);
            }
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
    }
} 
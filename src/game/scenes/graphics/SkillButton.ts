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

    constructor(scene: Phaser.Scene, x: number, y: number, skill: Skill) {
        this.scene = scene;
        this.skill = skill;
        this.radius = 30;

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
                (this.scene as any).onSkillButtonClick(this.skill);
            }
        });
    }

    update(): void {
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
        this.baseButton.destroy();
        this.cooldownButton.destroy();
        this.mask.destroy();
        this.text.destroy();
        this.icon.destroy();
        this.flash.destroy();
    }
} 
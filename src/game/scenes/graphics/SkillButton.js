export class SkillButton {
    constructor(scene, x, y, skill) {
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

        this.text = scene.add.text(x, y, skill.name, {
            fontSize: '14px',
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

    setupEventHandlers() {
        this.baseButton.on('pointerdown', () => {
            if (this.skill.canUse()) {
                this.scene.onSkillButtonClick(this.skill);
            }
        });
    }

    update() {
        const cooldownPercent = this.skill.getCooldownPercentage();

        this.mask.clear();
        if (cooldownPercent > 0) {
            this.mask.fillStyle(0, 1);
            this.mask.beginPath();
            this.mask.slice(0, 0, this.radius, -Math.PI / 2, -Math.PI / 2 - (2 * Math.PI * cooldownPercent), false);
            this.mask.fillPath();

            this.text.setColor('#888888');
        } else {
            this.text.setColor('#ffffff');
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

    destroy() {
        this.baseButton.destroy();
        this.cooldownButton.destroy();
        this.mask.destroy();
        this.text.destroy();
        this.flash.destroy();
    }
} 
export class SkillButton {
    constructor(scene, x, y, skill) {
        this.scene = scene;
        this.skill = skill;
        this.radius = 30;

        // Create the base circle
        this.button = scene.add.circle(x, y, this.radius, 0x444444)
            .setInteractive()
            .setDepth(1);

        // Create cooldown overlay
        this.cooldownOverlay = scene.add.graphics()
            .setDepth(2);
        this.cooldownOverlay.x = x;
        this.cooldownOverlay.y = y;

        // Create skill name text
        this.text = scene.add.text(x, y, skill.name, {
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(3);

        // Create flash effect for when cooldown completes
        this.flash = scene.add.circle(x, y, this.radius, 0xffffff)
            .setAlpha(0)
            .setDepth(4);

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.button.on('pointerdown', () => {
            if (this.skill.canUse()) {
                this.scene.onSkillButtonClick(this.skill);
            }
        });
    }

    update() {
        const cooldownPercent = this.skill.getCooldownPercentage();

        // Update cooldown overlay
        this.cooldownOverlay.clear();
        if (cooldownPercent > 0) {
            this.cooldownOverlay.fillStyle(0x666666, 0.8);
            
            // Draw cooldown arc (clockwise from top)
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (2 * Math.PI * cooldownPercent);
            
            this.cooldownOverlay.beginPath();
            this.cooldownOverlay.arc(0, 0, this.radius, startAngle, endAngle, false);
            this.cooldownOverlay.lineTo(0, 0);
            this.cooldownOverlay.closePath();
            this.cooldownOverlay.fill();

            this.text.setColor('#888888');
            this.button.setFillStyle(0x666666);
        } else {
            this.text.setColor('#ffffff');
            this.button.setFillStyle(0x444444);
        }

        // Flash effect when cooldown completes
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
        this.button.destroy();
        this.cooldownOverlay.destroy();
        this.text.destroy();
        this.flash.destroy();
    }
} 
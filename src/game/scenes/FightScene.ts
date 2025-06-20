import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame';
import { SkillButton } from './graphics/SkillButton';

export class FightScene extends Scene {
    gameLogic: FightingGame;
    skillButtons: SkillButton[];
    healthBars: Record<string, { background: Phaser.GameObjects.Rectangle; fill: Phaser.GameObjects.Rectangle }>;
    lastUpdateTime: number;
    playerFighter!: Phaser.GameObjects.Sprite;
    opponentFighter!: Phaser.GameObjects.Sprite;
    isPlayingSkillAnimation: boolean;
    currentSkillAnimation: string | null;

    constructor() {
        super('FightScene');
        this.gameLogic = new FightingGame();
        this.skillButtons = [];
        this.healthBars = {};
        this.lastUpdateTime = 0;
        this.isPlayingSkillAnimation = false;
        this.currentSkillAnimation = null;
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0x000000);
        this.createFighters();
        this.createHealthBars();
        this.createSkillButtons();
        this.createKeyboardInput();
        this.createBackButton();
        this.createAnimations();

        this.anims.create({
            key: 'orc_combat_idle',
            frames: this.anims.generateFrameNumbers('orc_combat_idle', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
        this.opponentFighter.play('orc_combat_idle');

        this.anims.create({
            key: 'wizard_combat_idle',
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.playerFighter.play('wizard_combat_idle');
    }

    createFighters(): void {
        this.playerFighter = this.add.sprite(200, 600, 'wizard_spellcast', 0);
        this.opponentFighter = this.add.sprite(200, 200, 'orc_combat_idle', 5);
        this.add.text(200, 650, 'Player', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
    }

    createHealthBars(): void {
        const barWidth = 200;
        const barHeight = 20;
        this.healthBars.player = {
            background: this.add.rectangle(200, 680, barWidth, barHeight, 0x333333),
            fill: this.add.rectangle(200, 680, barWidth, barHeight, 0x00ff00)
        };
        this.healthBars.opponent = {
            background: this.add.rectangle(200, 120, barWidth, barHeight, 0x333333),
            fill: this.add.rectangle(200, 120, barWidth, barHeight, 0xff0000)
        };
    }

    createSkillButtons(): void {
        const skills = this.gameLogic.getSkills();
        const circleRadius = 120;
        const screenPadding = 20;
        const screenWidth = 400;
        const screenHeight = 800;
        const leftCircleCenterX = screenPadding;
        const leftCircleCenterY = screenHeight - screenPadding;
        const rightCircleCenterX = screenWidth - screenPadding;
        const rightCircleCenterY = screenHeight - screenPadding;
        const skillSpacing = Math.PI / 6;
        const startAngleLeft = - Math.PI / 4;
        for (let i = 0; i < 3; i++) {
            const angle = startAngleLeft + skillSpacing * (i - 1);
            const x = leftCircleCenterX + Math.cos(angle) * circleRadius;
            const y = leftCircleCenterY + Math.sin(angle) * circleRadius;
            this.skillButtons.push(new SkillButton(this, x, y, skills[i]));
        }
        const startAngleRight =  - Math.PI / 4 - Math.PI;
        for (let i = 3; i < 6; i++) {
            const angle =  startAngleRight + skillSpacing * (i - 1);
            const x = rightCircleCenterX + Math.cos(angle) * circleRadius;
            const y = rightCircleCenterY + Math.sin(angle) * circleRadius;
            this.skillButtons.push(new SkillButton(this, x, y, skills[i]));
        }
    }

    createKeyboardInput(): void {
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            this.gameLogic.useSkillByKey(key);
        });
    }

    createBackButton(): void {
        const backButton = this.add.text(350, 50, 'BACK', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#666666',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
        backButton.on('pointerdown', () => {
            this.cleanup();
            this.scene.start('Game');
        });
    }

    createAnimations(): void {
        this.anims.create({
            key: 'wizard_fireball',
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'wizard_lightning',
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'wizard_ice_spike',
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: 'wizard_meteor',
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'wizard_shield',
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'wizard_heal',
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0
        });
    }

    playSkillAnimation(animationType: string): void {
        if (this.isPlayingSkillAnimation) {
            return;
        }

        this.isPlayingSkillAnimation = true;
        this.currentSkillAnimation = animationType;
        
        const animationKey = `wizard_${animationType}`;
        this.playerFighter.play(animationKey);
        
        this.playerFighter.once('animationcomplete', () => {
            this.isPlayingSkillAnimation = false;
            this.currentSkillAnimation = null;
            this.playerFighter.play('wizard_combat_idle');
        });

        this.createProjectileEffect(animationType);
    }

    createProjectileEffect(animationType: string): void {
        const playerX = this.playerFighter.x;
        const playerY = this.playerFighter.y;
        const targetX = this.opponentFighter.x;
        const targetY = this.opponentFighter.y;

        switch (animationType) {
            case 'fireball':
                this.createFireball(playerX, playerY, targetX, targetY);
                break;
            case 'lightning':
                this.createLightning(playerX, playerY, targetX, targetY);
                break;
            case 'ice_spike':
                this.createIceSpike(playerX, playerY, targetX, targetY);
                break;
            case 'meteor':
                this.createMeteor(targetX, targetY);
                break;
            case 'shield':
                this.createShield(playerX, playerY);
                break;
            case 'heal':
                this.createHealEffect(playerX, playerY);
                break;
        }
    }

    createFireball(startX: number, startY: number, targetX: number, targetY: number): void {
        const fireball = this.add.circle(startX, startY, 8, 0xff4400);
        
        this.tweens.add({
            targets: fireball,
            x: targetX,
            y: targetY,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                this.createExplosion(targetX, targetY, 0xff4400);
                fireball.destroy();
            }
        });
    }

    createLightning(startX: number, startY: number, targetX: number, targetY: number): void {
        const lightning = this.add.graphics();
        lightning.lineStyle(3, 0x00ffff);
        
        const points = this.generateLightningPoints(startX, startY, targetX, targetY);
        lightning.strokePoints(points);
        
        this.tweens.add({
            targets: lightning,
            alpha: 0,
            duration: 300,
            onComplete: () => lightning.destroy()
        });
    }

    createIceSpike(startX: number, startY: number, targetX: number, targetY: number): void {
        const iceSpike = this.add.triangle(startX, startY, 0, -8, -4, 8, 4, 8, 0x00ffff);
        
        this.tweens.add({
            targets: iceSpike,
            x: targetX,
            y: targetY,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
                this.createExplosion(targetX, targetY, 0x00ffff);
                iceSpike.destroy();
            }
        });
    }

    createMeteor(targetX: number, targetY: number): void {
        const meteor = this.add.circle(targetX, targetY - 100, 15, 0xff0000);
        
        this.tweens.add({
            targets: meteor,
            y: targetY,
            duration: 1000,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.createExplosion(targetX, targetY, 0xff0000, 30);
                meteor.destroy();
            }
        });
    }

    createShield(x: number, y: number): void {
        const shield = this.add.circle(x, y, 40, 0x0000ff, 0.3);
        
        this.tweens.add({
            targets: shield,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 1000,
            onComplete: () => shield.destroy()
        });
    }

    createHealEffect(x: number, y: number): void {
        const healParticles = this.add.graphics();
        healParticles.fillStyle(0x00ff00, 0.8);
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const particleX = x + Math.cos(angle) * 20;
            const particleY = y + Math.sin(angle) * 20;
            
            this.tweens.add({
                targets: { x: particleX, y: particleY },
                x: particleX + Math.cos(angle) * 30,
                y: particleY + Math.sin(angle) * 30,
                alpha: 0,
                duration: 800,
                onUpdate: () => {
                    healParticles.fillCircle(particleX, particleY, 3);
                },
                onComplete: () => {
                    if (i === 7) healParticles.destroy();
                }
            });
        }
    }

    createExplosion(x: number, y: number, color: number, size: number = 20): void {
        const explosion = this.add.circle(x, y, size, color, 0.8);
        
        this.tweens.add({
            targets: explosion,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => explosion.destroy()
        });
    }

    generateLightningPoints(startX: number, startY: number, endX: number, endY: number): Phaser.Geom.Point[] {
        const points: Phaser.Geom.Point[] = [];
        const segments = 8;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            
            if (i > 0 && i < segments) {
                const offset = (Math.random() - 0.5) * 20;
                points.push(new Phaser.Geom.Point(x + offset, y + offset));
            } else {
                points.push(new Phaser.Geom.Point(x, y));
            }
        }
        
        return points;
    }

    onSkillButtonClick(skill: any): void {
        const skillIndex = this.gameLogic.getSkills().indexOf(skill);
        if (skillIndex !== -1) {
            this.gameLogic.useSkill(skillIndex);
        }
    }

    update(time: number, delta: number): void {
        this.gameLogic.update(delta);
        this.updateHealthBars();
        this.updateSkillButtons();
        this.checkGameState();
        this.handleSkillAnimations();
    }

    updateHealthBars(): void {
        const playerHealthPercent = this.gameLogic.getPlayerHealthPercentage();
        const opponentHealthPercent = this.gameLogic.getOpponentHealthPercentage();
        this.healthBars.player.fill.width = 200 * playerHealthPercent;
        this.healthBars.opponent.fill.width = 200 * opponentHealthPercent;
    }

    updateSkillButtons(): void {
        this.skillButtons = this.skillButtons.filter(button => {
            if (button && button.text && button.text.active) {
                button.update();
                return true;
            }
            return false;
        });
    }

    checkGameState(): void {
        const gameState = this.gameLogic.getGameState();
        if (gameState === 'playerWon') {
            this.add.text(200, 400, 'YOU WIN!', {
                fontSize: '48px',
                color: '#00ff00'
            }).setOrigin(0.5);
            setTimeout(() => {
                this.cleanup();
                this.gameLogic.reset();
                this.scene.start('Game');
            }, 2000);
        }
    }

    cleanup(): void {
        this.skillButtons.forEach(button => button.destroy());
        this.skillButtons = [];
    }

    shutdown(): void {
        this.cleanup();
    }

    handleSkillAnimations(): void {
        const lastUsedSkill = this.gameLogic.getLastUsedSkill();
        if (lastUsedSkill && !this.isPlayingSkillAnimation) {
            this.playSkillAnimation(lastUsedSkill.animationType);
            this.gameLogic.clearLastUsedSkill();
        }
    }
} 
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
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 5,
            repeat: -1
        });
        this.playerFighter.play('wizard_spellcast');
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
            this.scene.start('Game');
        });
    }

    createAnimations(): void {
        this.anims.create({
            key: 'wizard_shoot',
            frames: this.anims.generateFrameNumbers('wizard_shoot', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: 'wizard_slash',
            frames: this.anims.generateFrameNumbers('wizard_slash', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'wizard_spellcast_skill',
            frames: this.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: 0
        });
    }

    playSkillAnimation(animationType: string): void {
        if (this.isPlayingSkillAnimation) {
            return;
        }

        this.isPlayingSkillAnimation = true;
        this.currentSkillAnimation = animationType;
        
        let animationKey: string;
        if (animationType === 'spellcast') {
            animationKey = 'wizard_spellcast_skill';
        } else {
            animationKey = `wizard_${animationType}`;
        }
        
        this.playerFighter.play(animationKey);
        
        this.playerFighter.once('animationcomplete', () => {
            this.isPlayingSkillAnimation = false;
            this.currentSkillAnimation = null;
            this.playerFighter.play('wizard_combat_idle');
        });
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
        this.skillButtons.forEach(button => button.update());
    }

    checkGameState(): void {
        const gameState = this.gameLogic.getGameState();
        if (gameState === 'playerWon') {
            this.add.text(200, 400, 'YOU WIN!', {
                fontSize: '48px',
                color: '#00ff00'
            }).setOrigin(0.5);
            setTimeout(() => {
                this.gameLogic.reset();
                this.scene.start('Game');
            }, 2000);
        }
    }

    handleSkillAnimations(): void {
        const lastUsedSkill = this.gameLogic.getLastUsedSkill();
        if (lastUsedSkill && !this.isPlayingSkillAnimation) {
            this.playSkillAnimation(lastUsedSkill.animationType);
            this.gameLogic.clearLastUsedSkill();
        }
    }
} 
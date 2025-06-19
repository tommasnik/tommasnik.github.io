import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame.js';
import { SkillButton } from './graphics/SkillButton.js';

export class Fighting extends Scene {
    constructor() {
        super('Fighting');
        this.gameLogic = new FightingGame();
        this.skillButtons = [];
        this.healthBars = {};
        this.lastUpdateTime = 0;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);
        
        this.createFighters();
        this.createHealthBars();
        this.createSkillButtons();
        this.createKeyboardInput();
        this.createBackButton();
    }

    createFighters() {
        this.playerFighter = this.add.rectangle(200, 600, 60, 100, 0x00ff00);
        this.opponentFighter = this.add.rectangle(200, 200, 60, 100, 0xff0000);
        
        this.add.text(200, 650, 'Player', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(200, 150, 'Opponent', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    createHealthBars() {
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

    createSkillButtons() {
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

    createKeyboardInput() {
        this.input.keyboard.on('keydown', (event) => {
            const key = event.key.toLowerCase();
            this.gameLogic.useSkillByKey(key);
        });
    }

    createBackButton() {
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

    onSkillButtonClick(skill) {
        const skillIndex = this.gameLogic.getSkills().indexOf(skill);
        if (skillIndex !== -1) {
            this.gameLogic.useSkill(skillIndex);
        }
    }

    update(time, delta) {
        this.gameLogic.update(delta);
        this.updateHealthBars();
        this.updateSkillButtons();
        this.checkGameState();
    }

    updateHealthBars() {
        const playerHealthPercent = this.gameLogic.getPlayerHealthPercentage();
        const opponentHealthPercent = this.gameLogic.getOpponentHealthPercentage();
        
        this.healthBars.player.fill.width = 200 * playerHealthPercent;
        this.healthBars.opponent.fill.width = 200 * opponentHealthPercent;
    }

    updateSkillButtons() {
        this.skillButtons.forEach(button => button.update());
    }

    checkGameState() {
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
} 
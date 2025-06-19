import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame.js';

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
        const buttonSize = 50;
        const buttonSpacing = 60;
        const startX = 50;
        const startY = 720;
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        for (let i = 0; i < 6; i++) {
            const x = startX + (i * buttonSpacing);
            const y = startY;
            
            const button = this.add.rectangle(x, y, buttonSize, buttonSize, 0x444444)
                .setInteractive()
                .on('pointerdown', () => this.onSkillButtonClick(i));
            
            const text = this.add.text(x, y, letters[i], {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.skillButtons.push({ button, text, index: i });
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

    onSkillButtonClick(skillIndex) {
        this.gameLogic.useSkill(skillIndex);
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
        const skills = this.gameLogic.getSkills();
        
        this.skillButtons.forEach((buttonData, index) => {
            const skill = skills[index];
            const cooldownPercent = skill.getCooldownPercentage();
            
            if (cooldownPercent > 0) {
                buttonData.button.setFillStyle(0x666666);
                buttonData.text.setColor('#888888');
            } else {
                buttonData.button.setFillStyle(0x444444);
                buttonData.text.setColor('#ffffff');
            }
        });
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
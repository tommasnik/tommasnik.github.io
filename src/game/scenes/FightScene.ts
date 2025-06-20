import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame';
import { EffectFactory } from '../effects/EffectFactory';
import { Fighter } from '../graphics/Fighter';
import { HealthBar } from '../graphics/HealthBar';
import { BackButton } from '../ui/BackButton';
import { SkillButtonManager } from '../ui/SkillButtonManager';
import { GameOverDisplay } from '../ui/GameOverDisplay';
import { KeyboardInputManager } from '../input/KeyboardInputManager';
import { SkillAnimationSystem } from '../systems/SkillAnimationSystem';

export class FightScene extends Scene {
    private gameLogic: FightingGame;
    private effectFactory!: EffectFactory;
    private playerFighter!: Fighter;
    private opponentFighter!: Fighter;
    private playerHealthBar!: HealthBar;
    private opponentHealthBar!: HealthBar;
    private backButton!: BackButton;
    private skillButtonManager!: SkillButtonManager;
    private gameOverDisplay!: GameOverDisplay;
    private keyboardInputManager!: KeyboardInputManager;
    private skillAnimationSystem!: SkillAnimationSystem;
    private gameOverTimer: ReturnType<typeof setTimeout> | null = null;
    

    constructor() {
        super('FightScene');
        this.gameLogic = new FightingGame();
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0x000000);
        
        this.initializeComponents();
        this.setupEventHandlers();
        this.startIdleAnimations();
    }

    private initializeComponents(): void {
        this.effectFactory = new EffectFactory(this);

        this.playerFighter = new Fighter(this, 200, 600, 'wizard_spellcast', 0, 'Player', 'wizard_combat_idle');
        this.opponentFighter = new Fighter(this, 200, 200, 'orc_combat_idle', 5, 'Opponent', 'orc_combat_idle');

        this.playerHealthBar = new HealthBar(this, 200, 680, 200, 20);
        this.playerHealthBar.setFillColor(0x00ff00);
        this.opponentHealthBar = new HealthBar(this, 200, 120, 200, 20);
        this.opponentHealthBar.setFillColor(0xff0000);

        this.backButton = new BackButton(this, 350, 50);
        this.skillButtonManager = new SkillButtonManager(this, this.gameLogic);
        this.skillButtonManager.createSkillButtons();

        this.gameOverDisplay = new GameOverDisplay(this);
        this.keyboardInputManager = new KeyboardInputManager(this, this.gameLogic);
        this.keyboardInputManager.setupKeyboardInput();

        this.skillAnimationSystem = new SkillAnimationSystem(
            this.gameLogic, 
            this.effectFactory, 
            this.playerFighter, 
            this.opponentFighter
        );
    }

    private setupEventHandlers(): void {
        this.events.on('backButtonClicked', () => {
            this.cleanup();
            this.scene.start('Game');
        });
    }

    private startIdleAnimations(): void {
        this.playerFighter.playIdleAnimation();
        this.opponentFighter.playIdleAnimation();
    }

    update(time: number, delta: number): void {
        this.gameLogic.update(delta);
        this.updateHealthBars();
        this.skillButtonManager.update();
        this.checkGameState();
        this.skillAnimationSystem.handleSkillAnimations();
    }

    private updateHealthBars(): void {
        const playerHealthPercent = this.gameLogic.getPlayerHealthPercentage();
        const opponentHealthPercent = this.gameLogic.getOpponentHealthPercentage();
        
        this.playerHealthBar.updateHealth(playerHealthPercent);
        this.opponentHealthBar.updateHealth(opponentHealthPercent);
    }

    private checkGameState(): void {
        const gameState = this.gameLogic.getGameState();
        
        if (gameState === 'playerWon') {
            this.gameOverDisplay.showWinMessage();
            if (!this.gameOverTimer) {
                this.gameOverTimer = setTimeout(() => {
                    this.cleanup();
                    this.gameLogic.reset();
                    this.scene.start('Game');
                }, 2000);
            }
        }
    }

    private cleanup(): void {
        if (this.gameOverTimer) {
            clearTimeout(this.gameOverTimer);
            this.gameOverTimer = null;
        }
        this.skillButtonManager.destroy();
        this.gameOverDisplay.destroy();
        this.keyboardInputManager.destroy();
        this.playerFighter.destroy();
        this.opponentFighter.destroy();
        this.playerHealthBar.destroy();
        this.opponentHealthBar.destroy();
        this.backButton.destroy();
    }

    shutdown(): void {
        this.cleanup();
    }
} 
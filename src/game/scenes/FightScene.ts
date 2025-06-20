import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame';
import { EffectFactory } from '../effects/EffectFactory';
import { Fighter } from '../graphics/Fighter';
import { HealthBar } from '../graphics/HealthBar';
import { CastingRing } from '../graphics/CastingRing';
import { BackButton } from '../ui/BackButton';
import { SkillButtonManager } from '../ui/SkillButtonManager';
import { GameOverDisplay } from '../ui/GameOverDisplay';
import { InputManager } from '../input/KeyboardInputManager';
import { SkillAnimationSystem } from '../systems/SkillAnimationSystem';
import { GameConstants } from '../constants/GameConstants';

export class FightScene extends Scene {
    private gameLogic: FightingGame;
    private effectFactory!: EffectFactory;
    private playerFighter!: Fighter;
    private opponentFighter!: Fighter;
    private playerHealthBar!: HealthBar;
    private opponentHealthBar!: HealthBar;
    private castingRing!: CastingRing;
    private backButton!: BackButton;
    private skillButtonManager!: SkillButtonManager;
    private gameOverDisplay!: GameOverDisplay;
    private inputManager!: InputManager;
    private skillAnimationSystem!: SkillAnimationSystem;
    private gameOverTimer: ReturnType<typeof setTimeout> | null = null;
    

    constructor() {
        super('FightScene');
        this.gameLogic = new FightingGame();
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0x000000);
        
        this.gameLogic.reset();
        this.initializeComponents();
        this.setupEventHandlers();
        this.startIdleAnimations();
    }

    private initializeComponents(): void {
        this.effectFactory = new EffectFactory(this);

        this.playerFighter = new Fighter(this, 200, 600, 'wizard_spellcast', 0, 'Player', 'wizard_combat_idle');
        this.opponentFighter = new Fighter(this, 200, 200, 'orc_combat_idle', 5, 'Opponent', 'orc_combat_idle');

        this.playerHealthBar = new HealthBar(this, 200, 680, 200, 20);
        this.playerHealthBar.setFillColor(GameConstants.UI.HEALTH_BAR.playerColor);
        this.opponentHealthBar = new HealthBar(this, 200, 120, 200, 20);
        this.opponentHealthBar.setFillColor(GameConstants.UI.HEALTH_BAR.opponentColor);

        this.castingRing = new CastingRing(this);

        this.backButton = new BackButton(this, 350, 50);
        this.inputManager = new InputManager(this, this.gameLogic);
        this.inputManager.setupInput();
        this.skillButtonManager = new SkillButtonManager(this, this.gameLogic, this.inputManager);
        this.skillButtonManager.createSkillButtons();

        this.gameOverDisplay = new GameOverDisplay(this);

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
        this.updateCastingRing();
        this.skillButtonManager.update();
        this.checkGameState();
        this.skillAnimationSystem.handleSkillAnimations();
    }

    private updateHealthBars(): void {
        const playerHealthPercent = this.gameLogic.getPlayer().getHealthPercentage();
        const opponentHealthPercent = this.gameLogic.getOpponent().getHealthPercentage();
        
        this.playerHealthBar.updateHealth(playerHealthPercent);
        this.opponentHealthBar.updateHealth(opponentHealthPercent);
    }

    private updateCastingRing(): void {
        const currentlyCastingSkill = this.gameLogic.getCurrentlyCastingSkill();
        const playerPos = this.playerFighter.getPosition();
        
        if (currentlyCastingSkill && currentlyCastingSkill.isCasting) {
            const progress = currentlyCastingSkill.getCastProgress();
            
            if (!this.castingRing.isVisible) {
                this.castingRing.startCasting(currentlyCastingSkill.animationType, playerPos.x, playerPos.y);
            } else {
                this.castingRing.updateProgress(progress, playerPos.x, playerPos.y);
            }
        } else {
            this.castingRing.stopCasting();
        }
    }

    private checkGameState(): void {
        const gameState = this.gameLogic.getGameState();
        
        if (gameState === GameConstants.GAME_STATES.GAME_OVER) {
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
        this.inputManager.destroy();
        this.playerFighter.destroy();
        this.opponentFighter.destroy();
        this.playerHealthBar.destroy();
        this.opponentHealthBar.destroy();
        this.castingRing.destroy();
        this.backButton.destroy();
    }

    shutdown(): void {
        this.cleanup();
    }
} 
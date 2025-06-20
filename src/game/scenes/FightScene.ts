import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame';
import { EffectFactory } from '../effects/EffectFactory';
import { Fighter } from '../graphics/Fighter';
import { HealthBar } from '../graphics/HealthBar';
import { MultiCastingRing } from '../graphics/MultiCastingRing';
import { BackButton } from '../ui/BackButton';
import { SkillButtonManager } from '../ui/SkillButtonManager';
import { GameOverDisplay } from '../ui/GameOverDisplay';
import { InputManager } from '../input/KeyboardInputManager';
import { MultiSkillAnimationSystem } from '../systems/MultiSkillAnimationSystem';
import { GameConstants } from '../constants/GameConstants';

export class FightScene extends Scene {
    private gameLogic: FightingGame;
    private effectFactory!: EffectFactory;
    private playerFighter!: Fighter;
    private opponentFighter!: Fighter;
    private playerHealthBar!: HealthBar;
    private opponentHealthBar!: HealthBar;
    private multiCastingRing!: MultiCastingRing;
    private backButton!: BackButton;
    private skillButtonManager!: SkillButtonManager;
    private gameOverDisplay!: GameOverDisplay;
    private inputManager!: InputManager;
    private multiSkillAnimationSystem!: MultiSkillAnimationSystem;
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
        this.multiCastingRing.forceCleanup();
    }

    private initializeComponents(): void {
        this.effectFactory = new EffectFactory(this);

        this.playerFighter = new Fighter(this, 200, 600, 'wizard_spellcast', 0, 'Player', 'wizard_combat_idle');
        this.opponentFighter = new Fighter(this, 200, 200, 'orc_combat_idle', 5, 'Opponent', 'orc_combat_idle');

        this.playerHealthBar = new HealthBar(this, 200, 680, 200, 20);
        this.playerHealthBar.setFillColor(GameConstants.UI.HEALTH_BAR.playerColor);
        this.opponentHealthBar = new HealthBar(this, 200, 120, 200, 20);
        this.opponentHealthBar.setFillColor(GameConstants.UI.HEALTH_BAR.opponentColor);

        this.multiCastingRing = new MultiCastingRing(this);

        this.backButton = new BackButton(this, 350, 50);
        this.inputManager = new InputManager(this, this.gameLogic);
        this.inputManager.setupInput();
        this.skillButtonManager = new SkillButtonManager(this, this.gameLogic, this.inputManager);
        this.skillButtonManager.createSkillButtons();

        this.gameOverDisplay = new GameOverDisplay(this);

        this.multiSkillAnimationSystem = new MultiSkillAnimationSystem(
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
        this.updateMultiCastingRing();
        this.skillButtonManager.update();
        this.checkGameState();
        this.multiSkillAnimationSystem.handleSkillAnimations();
        
        this.ensureRingCleanup();
    }

    private updateHealthBars(): void {
        const playerHealthPercent = this.gameLogic.getPlayer().getHealthPercentage();
        const opponentHealthPercent = this.gameLogic.getOpponent().getHealthPercentage();
        
        this.playerHealthBar.updateHealth(playerHealthPercent);
        this.opponentHealthBar.updateHealth(opponentHealthPercent);
    }

    private updateMultiCastingRing(): void {
        const castingSpells = this.gameLogic.getCastingSpells();
        const playerPos = this.playerFighter.getPosition();
        
        const activeSkillNames = new Set<string>();
        
        for (const castingSpell of castingSpells) {
            const skillName = castingSpell.skill.name;
            activeSkillNames.add(skillName);
            
            const progress = castingSpell.progress;
            
            if (progress === 0) {
                this.multiCastingRing.startCasting(skillName, castingSpell.skill.animationType, playerPos.x, playerPos.y);
            } else {
                this.multiCastingRing.updateProgress(skillName, progress, playerPos.x, playerPos.y);
            }
        }
        
        this.cleanupCompletedRings(activeSkillNames);
    }

    private cleanupCompletedRings(activeSkillNames: Set<string>): void {
        const currentlyDisplayedRings = this.multiCastingRing.getActiveRingNames();
        
        for (const ringName of currentlyDisplayedRings) {
            if (!activeSkillNames.has(ringName)) {
                this.multiCastingRing.stopCasting(ringName);
            }
        }
        
        if (currentlyDisplayedRings.length > 0 && activeSkillNames.size === 0) {
            this.multiCastingRing.forceCleanup();
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
        this.multiCastingRing.stopAllCasting();
        this.multiCastingRing.destroy();
        this.backButton.destroy();
    }

    shutdown(): void {
        this.cleanup();
    }

    private ensureRingCleanup(): void {
        const castingSpells = this.gameLogic.getCastingSpells();
        const activeRingCount = this.multiCastingRing.getActiveRingCount();
        
        if (castingSpells.length === 0 && activeRingCount > 0) {
            this.multiCastingRing.forceCleanup();
        }
    }
} 
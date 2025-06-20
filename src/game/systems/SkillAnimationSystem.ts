import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame';
import { EffectFactory } from '../effects/EffectFactory';
import { Fighter } from '../graphics/Fighter';

export class SkillAnimationSystem {
    private scene: Scene;
    private gameLogic: FightingGame;
    private effectFactory: EffectFactory;
    private playerFighter: Fighter;
    private opponentFighter: Fighter;
    private isPlayingSkillAnimation: boolean = false;
    private currentSkillAnimation: string | null = null;

    constructor(scene: Scene, gameLogic: FightingGame, effectFactory: EffectFactory, playerFighter: Fighter, opponentFighter: Fighter) {
        this.scene = scene;
        this.gameLogic = gameLogic;
        this.effectFactory = effectFactory;
        this.playerFighter = playerFighter;
        this.opponentFighter = opponentFighter;
    }

    playSkillAnimation(animationType: string): void {
        if (this.isPlayingSkillAnimation) {
            return;
        }

        this.isPlayingSkillAnimation = true;
        this.currentSkillAnimation = animationType;
        
        const animationKey = `wizard_${animationType}`;
        this.playerFighter.playAnimation(animationKey);
        
        this.playerFighter.onAnimationComplete(() => {
            this.isPlayingSkillAnimation = false;
            this.currentSkillAnimation = null;
            this.playerFighter.playIdleAnimation();
        });

        this.createProjectileEffect(animationType);
    }

    private createProjectileEffect(animationType: string): void {
        const playerPos = this.playerFighter.getPosition();
        const opponentPos = this.opponentFighter.getPosition();

        this.effectFactory.createEffect(animationType, playerPos.x, playerPos.y, opponentPos.x, opponentPos.y);
    }

    handleSkillAnimations(): void {
        const lastUsedSkill = this.gameLogic.getLastUsedSkill();
        if (lastUsedSkill && !this.isPlayingSkillAnimation) {
            this.playSkillAnimation(lastUsedSkill.animationType);
            this.gameLogic.clearLastUsedSkill();
        }
    }

    isAnimationPlaying(): boolean {
        return this.isPlayingSkillAnimation;
    }
} 
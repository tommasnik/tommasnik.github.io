import { FightingGame } from '../logic/FightingGame';
import { EffectFactory } from '../effects/EffectFactory';
import { Fighter } from '../graphics/Fighter';
import { Skill } from '../logic/Skill';

export class MultiSkillAnimationSystem {
    private gameLogic: FightingGame;
    private effectFactory: EffectFactory;
    private playerFighter: Fighter;
    private opponentFighter: Fighter;
    private activeAnimations: Map<string, SkillAnimationData> = new Map();
    private animationQueue: Skill[] = [];

    constructor(gameLogic: FightingGame, effectFactory: EffectFactory, playerFighter: Fighter, opponentFighter: Fighter) {
        this.gameLogic = gameLogic;
        this.effectFactory = effectFactory;
        this.playerFighter = playerFighter;
        this.opponentFighter = opponentFighter;
    }

    playSkillAnimation(skill: Skill): void {
        const animationKey = `wizard_${skill.animationType}`;
        
        if (this.activeAnimations.has(skill.name)) {
            this.animationQueue.push(skill);
            return;
        }

        const animationData: SkillAnimationData = {
            skill,
            animationKey,
            isPlaying: true,
            startTime: Date.now()
        };

        this.activeAnimations.set(skill.name, animationData);
        
        this.playerFighter.playAnimation(animationKey);
        
        this.playerFighter.onAnimationComplete(() => {
            this.completeAnimation(skill.name);
        });

        this.createProjectileEffect(skill.animationType);
    }

    private completeAnimation(skillName: string): void {
        this.activeAnimations.delete(skillName);
        
        if (this.animationQueue.length > 0) {
            const nextSkill = this.animationQueue.shift()!;
            this.playSkillAnimation(nextSkill);
        } else {
            this.playerFighter.playIdleAnimation();
        }
    }

    private createProjectileEffect(animationType: string): void {
        const playerPos = this.playerFighter.getPosition();
        const opponentPos = this.opponentFighter.getPosition();

        this.effectFactory.createEffect(animationType, playerPos.x, playerPos.y, opponentPos.x, opponentPos.y);
    }

    handleSkillAnimations(): void {
        const lastUsedSkill = this.gameLogic.getLastUsedSkill();
        if (lastUsedSkill) {
            this.playSkillAnimation(lastUsedSkill);
            this.gameLogic.clearLastUsedSkill();
        }
    }

    isAnimationPlaying(): boolean {
        return this.activeAnimations.size > 0 || this.animationQueue.length > 0;
    }

    getActiveAnimationCount(): number {
        return this.activeAnimations.size + this.animationQueue.length;
    }

    clearAllAnimations(): void {
        this.activeAnimations.clear();
        this.animationQueue = [];
        this.playerFighter.playIdleAnimation();
    }
}

interface SkillAnimationData {
    skill: Skill;
    animationKey: string;
    isPlaying: boolean;
    startTime: number;
} 
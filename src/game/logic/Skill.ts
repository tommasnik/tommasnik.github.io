import { GameConstants } from '../constants/GameConstants';

export class Skill {
    name: string;
    damage: number;
    cooldown: number;
    currentCooldown: number;
    castTime: number;
    currentCastTime: number;
    keyBinding: string;
    animationType: 'fireball' | 'lightning' | 'ice_spike' | 'shield' | 'heal' | 'meteor';
    skillType: 'offensive' | 'defensive';
    targetType: 'single' | 'aoe';
    description: string;
    isCasting: boolean;

    constructor(
        name: string, 
        damage: number, 
        cooldown: number, 
        keyBinding: string, 
        animationType: 'fireball' | 'lightning' | 'ice_spike' | 'shield' | 'heal' | 'meteor',
        skillType: 'offensive' | 'defensive' = 'offensive',
        targetType: 'single' | 'aoe' = 'single',
        description: string = '',
        castTime?: number
    ) {
        this.name = name;
        this.damage = damage;
        this.cooldown = cooldown;
        this.currentCooldown = 0;
        this.keyBinding = keyBinding;
        this.animationType = animationType;
        this.skillType = skillType;
        this.targetType = targetType;
        this.description = description;
        this.isCasting = false;
        
        this.castTime = castTime ?? this.calculateDefaultCastTime(cooldown);
        this.currentCastTime = 0;
    }

    private calculateDefaultCastTime(cooldown: number): number {
        const calculatedCastTime = cooldown * GameConstants.SKILLS.CAST_TIME_MULTIPLIER;
        return Math.max(
            GameConstants.SKILLS.MIN_CAST_TIME,
            Math.min(calculatedCastTime, GameConstants.SKILLS.MAX_CAST_TIME)
        );
    }

    canUse(): boolean {
        return this.currentCooldown <= 0 && !this.isCasting;
    }

    canStartCasting(): boolean {
        return this.currentCooldown <= 0;
    }

    startCasting(): boolean {
        if (!this.canStartCasting()) {
            return false;
        }
        this.isCasting = true;
        this.currentCastTime = 0;
        return true;
    }

    updateCastTime(deltaTime: number): boolean {
        if (!this.isCasting) {
            return false;
        }

        this.currentCastTime += deltaTime;
        
        if (this.currentCastTime >= this.castTime) {
            this.completeCast();
            return true;
        }
        
        return false;
    }

    completeCast(): void {
        this.isCasting = false;
        this.currentCastTime = 0;
        this.use();
    }

    completeCastOnRelease(): boolean {
        if (!this.isCasting) {
            return false;
        }
        this.isCasting = false;
        this.currentCastTime = 0;
        return this.use();
    }

    completeCastWithoutUse(): void {
        this.isCasting = false;
        this.currentCastTime = 0;
    }

    cancelCast(): void {
        this.isCasting = false;
        this.currentCastTime = 0;
    }

    getCastProgress(): number {
        if (!this.isCasting) {
            return 0;
        }
        return Math.min(this.currentCastTime / this.castTime, 1);
    }

    use(): boolean {
        if (!this.canUse()) {
            return false;
        }
        this.currentCooldown = this.cooldown;
        return true;
    }

    update(deltaTime: number): void {
        if (this.currentCooldown > 0) {
            this.currentCooldown = Math.max(0, this.currentCooldown - deltaTime);
        }
    }

    getCooldownPercentage(): number {
        return this.cooldown > 0 ? this.currentCooldown / this.cooldown : 0;
    }
} 
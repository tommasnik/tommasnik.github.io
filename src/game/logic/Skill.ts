export class Skill {
    name: string;
    damage: number;
    cooldown: number;
    currentCooldown: number;
    keyBinding: string;
    animationType: 'shoot' | 'slash' | 'spellcast';

    constructor(name: string, damage: number, cooldown: number, keyBinding: string, animationType: 'shoot' | 'slash' | 'spellcast' = 'slash') {
        this.name = name;
        this.damage = damage;
        this.cooldown = cooldown;
        this.currentCooldown = 0;
        this.keyBinding = keyBinding;
        this.animationType = animationType;
    }

    canUse(): boolean {
        return this.currentCooldown <= 0;
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
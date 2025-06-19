export class Skill {
    constructor(name, damage, cooldown, keyBinding) {
        this.name = name;
        this.damage = damage;
        this.cooldown = cooldown;
        this.currentCooldown = 0;
        this.keyBinding = keyBinding;
    }

    canUse() {
        return this.currentCooldown <= 0;
    }

    use() {
        if (!this.canUse()) {
            return false;
        }
        this.currentCooldown = this.cooldown;
        return true;
    }

    update(deltaTime) {
        if (this.currentCooldown > 0) {
            this.currentCooldown = Math.max(0, this.currentCooldown - deltaTime);
        }
    }

    getCooldownPercentage() {
        return this.cooldown > 0 ? this.currentCooldown / this.cooldown : 0;
    }
} 
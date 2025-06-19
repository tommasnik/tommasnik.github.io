export class Fighter {
    constructor(name, health, x, y) {
        this.name = name;
        this.maxHealth = health;
        this.currentHealth = health;
        this.x = x;
        this.y = y;
        this.isAlive = true;
    }

    takeDamage(damage) {
        this.currentHealth = Math.max(0, this.currentHealth - damage);
        this.isAlive = this.currentHealth > 0;
        return this.isAlive;
    }

    heal(amount) {
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    getHealthPercentage() {
        return this.currentHealth / this.maxHealth;
    }
} 
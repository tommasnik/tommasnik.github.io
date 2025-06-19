export class Fighter {
    name: string;
    maxHealth: number;
    currentHealth: number;
    x: number;
    y: number;
    isAlive: boolean;

    constructor(name: string, health: number, x: number, y: number) {
        this.name = name;
        this.maxHealth = health;
        this.currentHealth = health;
        this.x = x;
        this.y = y;
        this.isAlive = true;
    }

    takeDamage(damage: number): boolean {
        this.currentHealth = Math.max(0, this.currentHealth - damage);
        this.isAlive = this.currentHealth > 0;
        return this.isAlive;
    }

    heal(amount: number): void {
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    getHealthPercentage(): number {
        return this.currentHealth / this.maxHealth;
    }
} 
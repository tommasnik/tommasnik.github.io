import { Fighter } from './Fighter';
import { Skill } from './Skill';

type GameState = 'fighting' | 'playerWon';

export class FightingGame {
    player: Fighter;
    opponent: Fighter;
    skills: Skill[];
    gameState: GameState;
    lastUpdateTime: number;
    lastUsedSkill: Skill | null;

    constructor() {
        this.player = new Fighter('Player', 100, 200, 600);
        this.opponent = new Fighter('Opponent', 100, 200, 200);
        this.skills = this.createSkills();
        this.gameState = 'fighting';
        this.lastUpdateTime = 0;
        this.lastUsedSkill = null;
    }

    createSkills(): Skill[] {
        return [
            new Skill('Fireball', 15, 2000, 'a', 'fireball', 'offensive', 'single', 'Launches a fiery projectile at the enemy'),
            new Skill('Lightning', 20, 3500, 's', 'lightning', 'offensive', 'single', 'Strikes the enemy with lightning from your staff'),
            new Skill('Ice Spike', 12, 1500, 'd', 'ice_spike', 'offensive', 'single', 'Conjures a sharp ice spike to pierce the enemy'),
            new Skill('Meteor', 35, 8000, 'f', 'meteor', 'offensive', 'aoe', 'Summons a devastating meteor from the sky'),
            new Skill('Shield', 0, 4000, 'q', 'shield', 'defensive', 'single', 'Creates a magical barrier to protect yourself'),
            new Skill('Heal', 0, 6000, 'w', 'heal', 'defensive', 'single', 'Restores your health with healing magic')
        ];
    }

    update(deltaTime: number): void {
        this.skills.forEach(skill => skill.update(deltaTime));
    }

    useSkill(skillIndex: number): boolean {
        if (skillIndex < 0 || skillIndex >= this.skills.length) {
            return false;
        }

        const skill = this.skills[skillIndex];
        if (!skill.canUse()) {
            return false;
        }

        skill.use();
        
        if (skill.skillType === 'offensive' && skill.damage > 0) {
            this.opponent.takeDamage(skill.damage);
            if (!this.opponent.isAlive) {
                this.gameState = 'playerWon';
            }
        } else if (skill.skillType === 'defensive') {
            if (skill.name === 'Heal') {
                this.player.heal(25);
            }
        }

        this.lastUsedSkill = skill;

        return true;
    }

    useSkillByKey(key: string): boolean {
        const skillIndex = this.skills.findIndex(skill => skill.keyBinding === key);
        if (skillIndex !== -1) {
            return this.useSkill(skillIndex);
        }
        return false;
    }

    getPlayerHealth(): number {
        return this.player.currentHealth;
    }

    getOpponentHealth(): number {
        return this.opponent.currentHealth;
    }

    getPlayerHealthPercentage(): number {
        return this.player.getHealthPercentage();
    }

    getOpponentHealthPercentage(): number {
        return this.opponent.getHealthPercentage();
    }

    getSkills(): Skill[] {
        return this.skills;
    }

    getLastUsedSkill(): Skill | null {
        return this.lastUsedSkill;
    }

    clearLastUsedSkill(): void {
        this.lastUsedSkill = null;
    }

    getGameState(): GameState {
        return this.gameState;
    }

    reset(): void {
        this.player = new Fighter('Player', 100, 200, 600);
        this.opponent = new Fighter('Opponent', 100, 200, 200);
        this.skills.forEach(skill => {
            skill.currentCooldown = 0;
        });
        this.gameState = 'fighting';
        this.lastUsedSkill = null;
    }
} 
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
            new Skill('Punch', 10, 1000, 'a', 'shoot'),
            new Skill('Kick', 15, 2000, 's', 'slash'),
            new Skill('Special', 25, 5000, 'd', 'spellcast'),
            new Skill('Block', 0, 1500, 'q', 'slash'),
            new Skill('Dodge', 0, 3000, 'w', 'shoot'),
            new Skill('Ultimate', 40, 10000, 'e', 'spellcast')
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
        
        if (skill.damage > 0) {
            this.opponent.takeDamage(skill.damage);
            if (!this.opponent.isAlive) {
                this.gameState = 'playerWon';
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
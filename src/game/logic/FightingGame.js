import { Fighter } from './Fighter.js';
import { Skill } from './Skill.js';

export class FightingGame {
    constructor() {
        this.player = new Fighter('Player', 100, 200, 600);
        this.opponent = new Fighter('Opponent', 100, 200, 200);
        this.skills = this.createSkills();
        this.gameState = 'fighting';
        this.lastUpdateTime = 0;
    }

    createSkills() {
        return [
            new Skill('Punch', 10, 1000, 'a'),
            new Skill('Kick', 15, 2000, 's'),
            new Skill('Special', 25, 5000, 'd'),
            new Skill('Block', 0, 1500, 'q'),
            new Skill('Dodge', 0, 3000, 'w'),
            new Skill('Ultimate', 40, 10000, 'e')
        ];
    }

    update(deltaTime) {
        this.skills.forEach(skill => skill.update(deltaTime));
    }

    useSkill(skillIndex) {
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

        return true;
    }

    useSkillByKey(key) {
        const skillIndex = this.skills.findIndex(skill => skill.keyBinding === key);
        if (skillIndex !== -1) {
            return this.useSkill(skillIndex);
        }
        return false;
    }

    getPlayerHealth() {
        return this.player.currentHealth;
    }

    getOpponentHealth() {
        return this.opponent.currentHealth;
    }

    getPlayerHealthPercentage() {
        return this.player.getHealthPercentage();
    }

    getOpponentHealthPercentage() {
        return this.opponent.getHealthPercentage();
    }

    getSkills() {
        return this.skills;
    }

    getGameState() {
        return this.gameState;
    }

    reset() {
        this.player = new Fighter('Player', 100, 200, 600);
        this.opponent = new Fighter('Opponent', 100, 200, 200);
        this.skills.forEach(skill => {
            skill.currentCooldown = 0;
        });
        this.gameState = 'fighting';
    }
} 
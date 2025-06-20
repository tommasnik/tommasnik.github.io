import { Fighter } from './Fighter';
import { Skill } from './Skill';
import { GameConstants, GameState } from '../constants/GameConstants';
import { CastingManager } from '../systems/CastingManager';

export class FightingGame {
    player: Fighter;
    opponent: Fighter;
    skills: Skill[];
    gameState: GameState;
    lastUpdateTime: number;
    lastUsedSkill: Skill | null;
    castingManager: CastingManager;

    constructor() {
        this.player = new Fighter(
            GameConstants.FIGHTERS.PLAYER.name,
            GameConstants.FIGHTERS.PLAYER.maxHealth,
            GameConstants.FIGHTERS.PLAYER.x,
            GameConstants.FIGHTERS.PLAYER.y
        );
        this.opponent = new Fighter(
            GameConstants.FIGHTERS.OPPONENT.name,
            GameConstants.FIGHTERS.OPPONENT.maxHealth,
            GameConstants.FIGHTERS.OPPONENT.x,
            GameConstants.FIGHTERS.OPPONENT.y
        );
        this.skills = this.createSkills();
        this.gameState = GameConstants.GAME_STATES.FIGHTING;
        this.lastUpdateTime = 0;
        this.lastUsedSkill = null;
        this.castingManager = new CastingManager();
    }

    createSkills(): Skill[] {
        const skillConfigs = [
            GameConstants.SKILLS.FIREBALL,
            GameConstants.SKILLS.LIGHTNING,
            GameConstants.SKILLS.ICE_SPIKE,
            GameConstants.SKILLS.METEOR,
            GameConstants.SKILLS.SHIELD,
            GameConstants.SKILLS.HEAL
        ];

        return skillConfigs.map(config => new Skill(
            config.name,
            config.damage,
            config.cooldown,
            config.keyBinding,
            config.animationType,
            config.skillType,
            config.targetType,
            config.description
        ));
    }

    startCastingSkill(skillIndex: number): boolean {
        if (skillIndex < 0 || skillIndex >= this.skills.length) {
            return false;
        }

        const skill = this.skills[skillIndex];
        const currentTime = Date.now();
        return this.castingManager.startCasting(skill, currentTime);
    }

    cancelCurrentCast(): void {
        this.castingManager.cancelAllCasting();
    }

    cancelSkillCast(skillIndex: number): void {
        if (skillIndex < 0 || skillIndex >= this.skills.length) {
            return;
        }
        const skill = this.skills[skillIndex];
        this.castingManager.cancelCasting(skill);
    }

    useSkill(skillIndex: number): boolean {
        if (skillIndex < 0 || skillIndex >= this.skills.length) {
            return false;
        }

        const skill = this.skills[skillIndex];
        if (skill.use()) {
            this.lastUsedSkill = skill;
            this.applySkillEffect(skill);
            return true;
        }
        return false;
    }

    private applySkillEffect(skill: Skill): void {
        if (skill.skillType === 'offensive') {
            this.opponent.takeDamage(skill.damage);
        } else if (skill.skillType === 'defensive') {
            if (skill.animationType === 'heal') {
                this.player.heal(25);
            }
        }

        if (!this.opponent.isAlive) {
            this.gameState = GameConstants.GAME_STATES.GAME_OVER;
        }
    }

    update(deltaTime: number): void {
        this.skills.forEach(skill => skill.update(deltaTime));

        const currentTime = Date.now();
        const completedSpells = this.castingManager.updateCasting(deltaTime, currentTime);
        
        for (const completedSpell of completedSpells) {
            this.lastUsedSkill = completedSpell;
            this.applySkillEffect(completedSpell);
        }
    }

    getSkills(): Skill[] {
        return this.skills;
    }

    getLastUsedSkill(): Skill | null {
        return this.lastUsedSkill;
    }

    getCurrentlyCastingSkill(): Skill | null {
        const castingSpells = this.castingManager.getCastingSpells();
        return castingSpells.length > 0 ? castingSpells[0].skill : null;
    }

    getCastingSpells(): any[] {
        return this.castingManager.getCastingSpells();
    }

    isCasting(skill: Skill): boolean {
        return this.castingManager.isCasting(skill);
    }

    getCastingProgress(skill: Skill): number {
        return this.castingManager.getCastingProgress(skill);
    }

    clearLastUsedSkill(): void {
        this.lastUsedSkill = null;
    }

    getPlayer(): Fighter {
        return this.player;
    }

    getOpponent(): Fighter {
        return this.opponent;
    }

    getGameState(): GameState {
        return this.gameState;
    }

    reset(): void {
        this.player = new Fighter(
            GameConstants.FIGHTERS.PLAYER.name,
            GameConstants.FIGHTERS.PLAYER.maxHealth,
            GameConstants.FIGHTERS.PLAYER.x,
            GameConstants.FIGHTERS.PLAYER.y
        );
        this.opponent = new Fighter(
            GameConstants.FIGHTERS.OPPONENT.name,
            GameConstants.FIGHTERS.OPPONENT.maxHealth,
            GameConstants.FIGHTERS.OPPONENT.x,
            GameConstants.FIGHTERS.OPPONENT.y
        );
        this.skills = this.createSkills();
        this.gameState = GameConstants.GAME_STATES.FIGHTING;
        this.lastUsedSkill = null;
        this.castingManager.reset();
    }
} 
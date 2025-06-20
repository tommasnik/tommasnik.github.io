import { FightingGame } from '../src/game/logic/FightingGame';

describe('FightingGame', () => {
    let game;

    beforeEach(() => {
        game = new FightingGame();
    });

    test('should create game with correct initial state', () => {
        expect(game.player.name).toBe('Player');
        expect(game.player.currentHealth).toBe(100);
        expect(game.opponent.name).toBe('Opponent');
        expect(game.opponent.currentHealth).toBe(1000);
        expect(game.skills.length).toBe(6);
        expect(game.gameState).toBe('fighting');
    });

    test('should create skills with correct properties', () => {
        const skills = game.getSkills();
        expect(skills[0].name).toBe('Fireball');
        expect(skills[0].damage).toBe(15);
        expect(skills[0].cooldown).toBe(2000);
        expect(skills[1].name).toBe('Lightning');
        expect(skills[1].damage).toBe(20);
        expect(skills[1].cooldown).toBe(3500);
    });

    test('should start casting skill', () => {
        const result = game.startCastingSkill(0);
        expect(result).toBe(true);
        expect(game.getCurrentlyCastingSkill()).toBe(game.skills[0]);
        expect(game.skills[0].isCasting).toBe(true);
    });

    test('should not start casting skill when on cooldown', () => {
        game.useSkill(0);
        const result = game.startCastingSkill(0);
        expect(result).toBe(false);
        expect(game.getCurrentlyCastingSkill()).toBe(null);
    });

    test('should cancel current cast', () => {
        game.startCastingSkill(0);
        expect(game.getCurrentlyCastingSkill()).toBe(game.skills[0]);
        
        game.cancelCurrentCast();
        expect(game.getCurrentlyCastingSkill()).toBe(null);
        expect(game.skills[0].isCasting).toBe(false);
    });

    test('should use skill and apply damage', () => {
        const initialHealth = game.opponent.currentHealth;
        const result = game.useSkill(0);
        
        expect(result).toBe(true);
        expect(game.opponent.currentHealth).toBe(initialHealth - game.skills[0].damage);
        expect(game.getLastUsedSkill()).toBe(game.skills[0]);
    });

    test('should not use skill when on cooldown', () => {
        game.useSkill(0);
        const result = game.useSkill(0);
        expect(result).toBe(false);
    });

    test('should apply heal effect', () => {
        game.player.takeDamage(25);
        const initialHealth = game.player.currentHealth;
        
        game.useSkill(5);
        expect(game.player.currentHealth).toBe(initialHealth + 25);
    });

    test('should change game state when opponent dies', () => {
        game.opponent.takeDamage(995);
        game.useSkill(0);
        
        expect(game.gameState).toBe('gameOver');
        expect(game.opponent.isAlive).toBe(false);
    });

    test('should update cast time but not complete cast automatically', () => {
        game.startCastingSkill(0);
        const skill = game.skills[0];
        
        game.update(skill.castTime);
        expect(game.getCurrentlyCastingSkill()).toBe(skill);
        expect(game.getLastUsedSkill()).toBe(null);
        expect(game.opponent.currentHealth).toBe(1000);
    });

    test('should update cooldowns', () => {
        game.useSkill(0);
        const initialCooldown = game.skills[0].currentCooldown;
        
        game.update(1000);
        expect(game.skills[0].currentCooldown).toBe(initialCooldown - 1000);
    });

    test('should get correct skills', () => {
        const skills = game.getSkills();
        expect(skills).toBe(game.skills);
        expect(skills.length).toBe(6);
    });

    test('should get last used skill', () => {
        expect(game.getLastUsedSkill()).toBe(null);
        
        game.useSkill(0);
        expect(game.getLastUsedSkill()).toBe(game.skills[0]);
    });

    test('should clear last used skill', () => {
        game.useSkill(0);
        expect(game.getLastUsedSkill()).toBe(game.skills[0]);
        
        game.clearLastUsedSkill();
        expect(game.getLastUsedSkill()).toBe(null);
    });

    test('should get currently casting skill', () => {
        expect(game.getCurrentlyCastingSkill()).toBe(null);
        
        game.startCastingSkill(0);
        expect(game.getCurrentlyCastingSkill()).toBe(game.skills[0]);
    });

    test('should get player and opponent', () => {
        expect(game.getPlayer()).toBe(game.player);
        expect(game.getOpponent()).toBe(game.opponent);
    });

    test('should get game state', () => {
        expect(game.getGameState()).toBe('fighting');
    });

    test('should reset game state completely', () => {
        game.useSkill(0);
        game.startCastingSkill(1);
        game.player.takeDamage(25);
        game.opponent.takeDamage(50);
        
        game.reset();
        
        expect(game.player.currentHealth).toBe(100);
        expect(game.opponent.currentHealth).toBe(1000);
        expect(game.gameState).toBe('fighting');
        expect(game.getLastUsedSkill()).toBe(null);
        expect(game.getCurrentlyCastingSkill()).toBe(null);
        
        game.skills.forEach(skill => {
            expect(skill.currentCooldown).toBe(0);
            expect(skill.isCasting).toBe(false);
            expect(skill.currentCastTime).toBe(0);
        });
    });
}); 
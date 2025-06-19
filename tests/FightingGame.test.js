import { FightingGame } from '../src/game/logic/FightingGame';

describe('FightingGame', () => {
    let game;

    beforeEach(() => {
        game = new FightingGame();
    });

    test('should create game with correct initial state', () => {
        expect(game.player.name).toBe('Player');
        expect(game.opponent.name).toBe('Opponent');
        expect(game.player.currentHealth).toBe(100);
        expect(game.opponent.currentHealth).toBe(100);
        expect(game.gameState).toBe('fighting');
        expect(game.skills).toHaveLength(6);
    });

    test('should create skills with correct properties', () => {
        const skills = game.skills;
        expect(skills[0].name).toBe('Punch');
        expect(skills[0].damage).toBe(10);
        expect(skills[0].keyBinding).toBe('a');
        
        expect(skills[1].name).toBe('Kick');
        expect(skills[1].damage).toBe(15);
        expect(skills[1].keyBinding).toBe('s');
    });

    test('should update skills cooldowns', () => {
        game.skills[0].use();
        game.update(500);
        expect(game.skills[0].currentCooldown).toBe(500);
    });

    test('should use skill by index', () => {
        const result = game.useSkill(0);
        expect(result).toBe(true);
        expect(game.opponent.currentHealth).toBe(90);
    });

    test('should not use skill when on cooldown', () => {
        game.useSkill(0);
        const result = game.useSkill(0);
        expect(result).toBe(false);
        expect(game.opponent.currentHealth).toBe(90);
    });

    test('should use skill by key binding', () => {
        const result = game.useSkillByKey('a');
        expect(result).toBe(true);
        expect(game.opponent.currentHealth).toBe(90);
    });

    test('should return false for invalid key binding', () => {
        const result = game.useSkillByKey('x');
        expect(result).toBe(false);
    });

    test('should return false for invalid skill index', () => {
        const result = game.useSkill(10);
        expect(result).toBe(false);
    });

    test('should change game state when opponent dies', () => {
        game.useSkill(5);
        game.update(10000); // Wait for cooldown
        game.useSkill(5);
        game.update(10000); // Wait for cooldown
        game.useSkill(5);
        
        expect(game.gameState).toBe('playerWon');
        expect(game.opponent.isAlive).toBe(false);
    });

    test('should get correct health values', () => {
        game.useSkill(0);
        expect(game.getPlayerHealth()).toBe(100);
        expect(game.getOpponentHealth()).toBe(90);
    });

    test('should get correct health percentages', () => {
        expect(game.getPlayerHealthPercentage()).toBe(1.0);
        expect(game.getOpponentHealthPercentage()).toBe(1.0);
        
        game.useSkill(0);
        expect(game.getOpponentHealthPercentage()).toBe(0.9);
    });

    test('should reset game state', () => {
        game.useSkill(0);
        game.reset();
        
        expect(game.player.currentHealth).toBe(100);
        expect(game.opponent.currentHealth).toBe(100);
        expect(game.gameState).toBe('fighting');
        expect(game.skills[0].currentCooldown).toBe(0);
    });

    test('should handle skills with zero damage', () => {
        const blockSkill = game.skills[3];
        expect(blockSkill.damage).toBe(0);
        
        const result = game.useSkill(3);
        expect(result).toBe(true);
        expect(game.opponent.currentHealth).toBe(100);
    });
}); 